import 'server-only';

import { localStorageAdapter } from './local';
import { createS3Adapter } from './s3';

export type PutResult = { url: string; key: string };

export type StorageAdapter = {
  readonly name: string;
  put(key: string, data: Buffer, contentType: string): Promise<PutResult>;
  remove(key: string): Promise<void>;
};

let cached: StorageAdapter | null = null;

/**
 * Драйвер выбирается переменной STORAGE_DRIVER.
 *
 *   local — файлы в public/uploads. Годится для разработки и для одиночного
 *           сервера с постоянным диском, но не переживает пересоздание
 *           контейнера.
 *   s3    — любое S3-совместимое хранилище (Yandex Object Storage, MinIO,
 *           Cloudflare R2). Рекомендуется для production.
 */
export function getStorage(): StorageAdapter {
  if (cached) return cached;

  if (process.env.STORAGE_DRIVER === 's3') {
    const adapter = createS3Adapter();
    if (adapter) {
      cached = adapter;
      return adapter;
    }
    console.warn(
      '[storage] STORAGE_DRIVER=s3, но настройки S3 неполны — используется локальный диск.',
    );
  }

  cached = localStorageAdapter;
  return cached;
}

/** Безопасное имя объекта: без путей вверх, без пробелов и кириллицы в ключе. */
export function buildObjectKey(folder: string, originalName: string): string {
  const extension = (originalName.split('.').pop() ?? 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'misc';
  return `${safeFolder}/${stamp}-${random}.${extension || 'bin'}`;
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
] as const;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
