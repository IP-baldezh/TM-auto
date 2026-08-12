import 'server-only';

import { createHash, createHmac } from 'node:crypto';
import type { StorageAdapter } from './index';

/**
 * Загрузка в S3-совместимое хранилище без SDK.
 *
 * Подпись AWS Signature V4 занимает около семидесяти строк, а @aws-sdk
 * тянет за собой десятки мегабайт зависимостей ради двух запросов —
 * PUT и DELETE. Адресация path-style: её понимают и Yandex Object Storage,
 * и MinIO, и Cloudflare R2.
 */

const SERVICE = 's3';
const ALGORITHM = 'AWS4-HMAC-SHA256';

type S3Config = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl: string;
};

function readConfig(): S3Config | null {
  const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '');
  const region = process.env.S3_REGION;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) return null;

  const publicUrl = (process.env.S3_PUBLIC_URL || `${endpoint}/${bucket}`).replace(/\/$/, '');
  return { endpoint, region, bucket, accessKeyId, secretAccessKey, publicUrl };
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256Hex(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Кодирование пути: сегменты экранируются, разделители остаются. */
function encodeKey(key: string): string {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`))
    .join('/');
}

function signRequest(
  config: S3Config,
  method: 'PUT' | 'DELETE',
  key: string,
  payload: Buffer,
  extraHeaders: Record<string, string>,
): { url: string; headers: Record<string, string> } {
  const url = new URL(`${config.endpoint}/${config.bucket}/${encodeKey(key)}`);

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(payload);

  // Ключи сразу приводим к нижнему регистру: канонический вид требует
  // именно его, и так не нужно потом искать исходное написание.
  const headers: Record<string, string> = {};
  const setHeader = (name: string, value: string) => {
    headers[name.toLowerCase()] = value;
  };

  setHeader('host', url.host);
  setHeader('x-amz-content-sha256', payloadHash);
  setHeader('x-amz-date', amzDate);
  for (const [name, value] of Object.entries(extraHeaders)) setHeader(name, value);

  const sortedKeys = Object.keys(headers).sort();
  const canonicalHeaders = sortedKeys.map((h) => `${h}:${(headers[h] ?? '').trim()}\n`).join('');
  const signedHeaders = sortedKeys.join(';');

  const canonicalRequest = [
    method,
    url.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${dateStamp}/${config.region}/${SERVICE}/aws4_request`;
  const stringToSign = [ALGORITHM, amzDate, scope, sha256Hex(canonicalRequest)].join('\n');

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${config.secretAccessKey}`, dateStamp), config.region), SERVICE),
    'aws4_request',
  );
  const signature = createHmac('sha256', signingKey).update(stringToSign, 'utf8').digest('hex');

  headers.authorization =
    `${ALGORITHM} Credential=${config.accessKeyId}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return { url: url.toString(), headers };
}

export function createS3Adapter(): StorageAdapter | null {
  const config = readConfig();
  if (!config) return null;

  return {
    name: 's3',

    async put(key, data, contentType) {
      const { url, headers } = signRequest(config, 'PUT', key, data, {
        'content-type': contentType,
        'x-amz-acl': 'public-read',
      });

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: new Uint8Array(data),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(`S3 вернул ${response.status}: ${detail.slice(0, 300)}`);
      }

      return { url: `${config.publicUrl}/${encodeKey(key)}`, key };
    },

    async remove(key) {
      const empty = Buffer.alloc(0);
      const { url, headers } = signRequest(config, 'DELETE', key, empty, {});
      await fetch(url, { method: 'DELETE', headers }).catch(() => {
        // Удаление файла из хранилища не должно ломать сохранение контента.
      });
    },
  };
}
