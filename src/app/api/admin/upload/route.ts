import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth/session';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  buildObjectKey,
  getStorage,
} from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Требуется вход' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный запрос' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Файл не передан' }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: `Файл больше ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} МБ` },
      { status: 413 },
    );
  }

  const contentType = file.type || 'application/octet-stream';
  if (!ALLOWED_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return NextResponse.json(
      { ok: false, error: 'Допустимы только изображения: JPEG, PNG, WebP, AVIF, SVG' },
      { status: 415 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = buildObjectKey('content', file.name);
    const result = await getStorage().put(key, buffer, contentType);
    return NextResponse.json({ ok: true, url: result.url });
  } catch (error) {
    console.error('[upload] не удалось сохранить файл', error);
    return NextResponse.json(
      { ok: false, error: 'Не удалось сохранить файл в хранилище' },
      { status: 500 },
    );
  }
}
