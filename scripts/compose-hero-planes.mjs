/**
 * Сборка слоёв главного экрана из ГОТОВЫХ изображений.
 *
 *   node scripts/compose-hero-planes.mjs <фон.png> <автомобиль.png>
 *
 * Используйте, когда планы уже разрезаны — например, дизайнером:
 *   · фон         — непрозрачный кадр (небо, горы, город);
 *   · автомобиль  — кадр с прозрачностью выше линии горизонта.
 *
 * Если есть только одна фотография и резать её некому — берите
 * scripts/build-hero-planes.mjs, он вырезает небо сам.
 *
 * ── Зачем плиты доращиваются ───────────────────────────────────────────
 * В вёрстке слой заметно выше кадра (height 117.5% от контейнера в 120%
 * высоты секции) — так задано в reference, и благодаря этому слою есть куда
 * уезжать на скролле. Широкая плита в таком контейнере масштабируется по
 * высоте и обрезается с боков, поэтому обе доводятся до почти квадратной
 * пропорции: фон — продолжением неба вверх, передний план — прозрачностью.
 *
 * Доращивание общее для обоих планов, поэтому они остаются совмещёнными.
 */

import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 2400;
/** Почти квадрат — как у reference (2000×1906). */
const PLATE_RATIO = 1.05;

/** Во сколько раз темнеет продолженное небо к верхней кромке плиты. */
const SKY_DARKEN_TOP = 0.55;

/**
 * Градиентное затемнение неба в самом кадре — как градиентный фильтр
 * у фотографов.
 *
 * Зачем: по небу идёт белый заголовок, а в кадре есть луна и светлые облака.
 * В худшей точке фон под текстом доходил до яркости 233 — белый давал 1.2:1.
 * Локальное пятно под текстом эту задачу решает, но выглядит грязным
 * овалом на небе (проверено). Ровный вертикальный градиент читается
 * естественно и заодно поднимает гору по контрасту.
 *
 * Действует от верхней кромки кадра до SKY_ND_END его высоты.
 */
const SKY_ND_TOP = 0.2;
const SKY_ND_END = 0.6;

/**
 * Раскладка по вертикали — в долях высоты плиты.
 *
 * Плиты registered между собой, поэтому обе величины задают одну сцену:
 *
 *   0 ─────────────── верх плиты, тёмный зенит
 *   BG_TOP ────────── здесь начинается кадр с горами
 *   CAR_TOP ───────── здесь начинается автомобиль
 *   1 ─────────────── низ
 *
 * Между BG_TOP и CAR_TOP видна гора — это единственная полоса, где она вообще
 * появляется: ниже её полностью закрывает передний план. Если поставить фон
 * слишком низко, гор в кадре не будет совсем (проверено — так и вышло с
 * первого раза).
 *
 * Передний план всегда во всю ширину плиты и прижат к низу — его CAR_TOP
 * определяется собственной пропорцией кадра. Уменьшать его нельзя: по бокам
 * остаются прозрачные поля, и полоса дороги обрывается прямыми вертикальными
 * срезами прямо посреди горы. Проверено.
 *
 * Сколько видно горы, регулируется только BG_TOP.
 */
const BG_TOP = 0.2;

const mix = (a, b, t) => a + (b - a) * t;

/**
 * Продолжение неба вверх.
 *
 * Верхняя строка кадра растягивается вверх и постепенно затемняется — так
 * ведёт себя настоящее небо к зениту. Простая заливка одним цветом дала бы
 * заметную границу на стыке.
 */
/** Полоса из одной строки кадра, растянутая по вертикали с затемнением. */
async function stripFromRow(resized, W, rowY, height, darkenTo) {
  const { data } = await sharp(resized)
    .extract({ left: 0, top: rowY, width: W, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const strip = Buffer.alloc(W * height * 3);
  for (let y = 0; y < height; y++) {
    // 0 у самого кадра, 1 у дальней кромки
    const t = darkenTo === null ? 0 : 1 - y / height;
    const k = darkenTo === null ? 1 : mix(1, darkenTo, t);
    for (let x = 0; x < W; x++) {
      const s = x * 3;
      const d = (y * W + x) * 3;
      strip[d] = Math.round(data[s] * k);
      strip[d + 1] = Math.round(data[s + 1] * k);
      strip[d + 2] = Math.round(data[s + 2] * k);
    }
  }
  return sharp(strip, { raw: { width: W, height, channels: 3 } })
    // Размытие убирает вертикальные полосы от растяжки одной строки
    .blur(12)
    .png()
    .toBuffer();
}

/**
 * Плита фона: кадр ставится на заданную высоту, небо продолжается вверх,
 * низ добивается цветом нижней строки (он всё равно скрыт передним планом).
 */
async function buildBackground(input, W, targetH) {
  const base = await sharp(input).resize(W).removeAlpha().toBuffer();
  const H = (await sharp(base).metadata()).height;

  // Градиентный фильтр по небу
  const { data: px } = await sharp(base).raw().toBuffer({ resolveWithObject: true });
  const ndEnd = Math.round(H * SKY_ND_END);
  for (let y = 0; y < ndEnd; y++) {
    const k = mix(SKY_ND_TOP, 1, y / ndEnd);
    for (let x = 0; x < W; x++) {
      const p = (y * W + x) * 3;
      px[p] = Math.round(px[p] * k);
      px[p + 1] = Math.round(px[p + 1] * k);
      px[p + 2] = Math.round(px[p + 2] * k);
    }
  }
  const resized = await sharp(px, { raw: { width: W, height: H, channels: 3 } })
    .png()
    .toBuffer();

  const padTop = Math.max(0, Math.round(targetH * BG_TOP));
  const padBottom = Math.max(0, targetH - padTop - H);

  const parts = [{ input: resized, top: padTop, left: 0 }];
  if (padTop > 0) {
    parts.unshift({ input: await stripFromRow(resized, W, 0, padTop, SKY_DARKEN_TOP), top: 0, left: 0 });
  }
  if (padBottom > 0) {
    parts.push({
      input: await stripFromRow(resized, W, H - 1, padBottom, null),
      top: padTop + H,
      left: 0,
    });
  }

  const buffer = await sharp({
    create: { width: W, height: targetH, channels: 3, background: '#000' },
  })
    .composite(parts)
    .png()
    .toBuffer();

  return { buffer, padTop, padBottom, srcH: H };
}

async function main() {
  const [bgPath, carPath] = process.argv.slice(2);
  if (!bgPath || !carPath || !existsSync(bgPath) || !existsSync(carPath)) {
    console.error('Укажите оба файла: node scripts/compose-hero-planes.mjs фон.png авто.png');
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), 'public', 'hero');
  mkdirSync(outDir, { recursive: true });

  const plateH = Math.round(WIDTH / PLATE_RATIO);
  const skyPath = path.join(outDir, 'sky.webp');
  const carOutPath = path.join(outDir, 'car.webp');
  const ogPath = path.join(outDir, 'og.jpg');

  // ── Фон ────────────────────────────────────────────────────────────────
  const sky = await buildBackground(bgPath, WIDTH, plateH);
  await sharp(sky.buffer).webp({ quality: 82 }).toFile(skyPath);

  // ── Передний план ──────────────────────────────────────────────────────
  // Во всю ширину и прижат к низу — иначе по бокам видны срезы полосы дороги.
  const carScaled = await sharp(carPath).resize(WIDTH).ensureAlpha().png().toBuffer();
  const carScaledH = (await sharp(carScaled).metadata()).height;
  const carTop = plateH - carScaledH;

  await sharp({
    create: { width: WIDTH, height: plateH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: carScaled, top: carTop, left: 0 }])
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(carOutPath);

  // Где в готовой плите крыша и низ автомобиля — по ним настраивается вёрстка
  const { data, info } = await sharp(carOutPath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  let roof = -1;
  let bottom = -1;
  for (let y = 0; y < info.height; y++) {
    let opaque = 0;
    for (let x = Math.round(info.width * 0.2); x < info.width * 0.8; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 200) opaque++;
    }
    if (opaque > 0 && roof < 0) roof = y;
    if (opaque > 0) bottom = y;
  }

  // ── Картинка для соцсетей ──────────────────────────────────────────────
  const OG_W = 1200;
  const OG_H = 630;
  const ogSky = await sharp(skyPath).resize(OG_W, OG_H, { fit: 'cover' }).toBuffer();
  const ogCarH = Math.round((OG_W * plateH) / WIDTH);
  const ogCarTop = Math.max(0, OG_H - Math.round(ogCarH * (1 - roof / info.height)) - 40);
  const ogCar = await sharp(carOutPath)
    .resize(OG_W)
    .extract({ left: 0, top: 0, width: OG_W, height: Math.min(ogCarH, OG_H - ogCarTop) })
    .toBuffer();

  await sharp(ogSky)
    .composite([{ input: ogCar, top: ogCarTop, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(ogPath);

  const kb = (p) => (statSync(p).size / 1024).toFixed(0) + ' КБ';
  console.log(`Плита ${WIDTH}x${plateH} (пропорция ${PLATE_RATIO})`);
  console.log(`  public/hero/sky.webp  ${kb(skyPath)}   кадр с горами на ${(BG_TOP*100).toFixed(0)}% высоты плиты`);
  console.log(`  public/hero/car.webp  ${kb(carOutPath)}   автомобиль от ${((carTop/plateH)*100).toFixed(0)}% высоты, во всю ширину`);
  console.log(`  public/hero/og.jpg    ${kb(ogPath)}`);
  console.log(
    `\nОриентиры в плите переднего плана: крыша ${((roof / info.height) * 100).toFixed(1)}%, ` +
      `низ ${((bottom / info.height) * 100).toFixed(1)}%`,
  );
  console.log('Их используют .parallax__car / посадка заголовка в globals.css.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
