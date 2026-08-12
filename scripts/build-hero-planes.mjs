/**
 * Сборка слоёв главного экрана из одной фотографии.
 *
 *   node scripts/build-hero-planes.mjs <путь-к-фото.jpg>
 *
 * Кадр разрезается на планы так же, как это сделано в reference
 * osmosupply/parallax-scrolling: там одна фотография горы разложена на небо,
 * гору и передний гребень. Здесь то же самое для автомобильного кадра:
 *
 *   public/hero/sky.webp  — небо, растянутое вниз (непрозрачная подложка);
 *   public/hero/car.webp  — всё ниже линии горизонта: дорога, деревья,
 *                           автомобиль (с прозрачностью).
 *
 * Небо нельзя оставить внутри подложки вместе с автомобилем: планы
 * разъезжаются на скролле, и в фоне проступил бы второй, «призрачный»
 * автомобиль.
 *
 * ── Требования к исходному кадру ────────────────────────────────────────
 *   · автомобиль снят на фоне открытого неба;
 *   · небо заметно светлее всего остального (проверяется автоматически);
 *   · кузов не сливается с небом по яркости.
 *
 * Небо ищется связной заливкой от верхней кромки, а не порогом по всему
 * кадру: порог в лоб пробивает дырки в тёмных участках самого кузова.
 */

import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 2400;

/**
 * Итоговая пропорция плиты — почти квадрат, как в reference (2000×1906).
 *
 * Слой в вёрстке заметно выше кадра (height 117.5% от контейнера в 120%
 * высоты секции). Широкая плита 3:2 в таком контейнере масштабируется по
 * высоте, и автомобиль раздувается на весь экран, а горизонт уезжает под
 * шапку. Добираем недостающую высоту прозрачностью сверху — она приходится
 * на небо, которое и так вырезано.
 */
const PLATE_RATIO = 1.05;
/** Ниже этой доли высоты заливка не идёт — защита переднего плана. */
const MAX_DEPTH = 0.62;
const FEATHER = 2;
/** На сколько пикселей ужать объект, чтобы срезать светлый ореол по кромке. */
const ERODE = 4;

/**
 * Грейдинг неба — только зенит.
 *
 * Небо намеренно тёмное и без событий: по нему идёт белый заголовок, и любое
 * светлое пятно за текстом убивает читаемость. Весь свет сцены отдан
 * горизонту, но он живёт не здесь, а в плите переднего плана (см. HALO).
 *
 * Почему так. Плита показывается через object-cover: на широком экране она
 * масштабируется по ширине, на узком — по высоте. Одна и та же доля высоты
 * попадает в разные места сцены, и полоса свечения, посаженная в небо,
 * совпадала с линией горизонта только на одном breakpoint. Замерено.
 */
const SKY_STOPS = [
  { t: 0.0, c: [10, 13, 20] },
  { t: 0.35, c: [20, 26, 38] },
  { t: 0.7, c: [34, 42, 56] },
  { t: 1.0, c: [44, 52, 66] },
];

/**
 * Закатное свечение за линией горизонта.
 *
 * Запекается в плиту переднего плана, прямо над вырезанной кромкой, — тогда
 * оно привязано к деревьям и кузову жёстко, при любых пропорциях экрана.
 *
 * Это главный источник тонального размаха: замер референса Osmo показал
 * диапазон 180 единиц яркости (светлая гора 194 против чёрного гребня 58),
 * тогда как у прошлой версии сцены было всего 104 и всё в тёмной каше.
 * Чёрный силуэт автомобиля должен читаться на светлом, иначе «погружения»
 * не происходит.
 */
const HALO = {
  color: [255, 186, 132],
  /** Насколько высоко свечение поднимается над кромкой, в долях высоты кадра. */
  reach: 0.3,
  strength: 1,
  /** Центр по горизонтали — там, где садится солнце. */
  x: 0.62,
  spread: 0.62,
};
/** Фирменный красный — вторым, слабым источником у левого края. */
const BRAND_HALO = { color: [214, 46, 40], x: 0.12, spread: 0.42, strength: 0.5 };
/** Затемнение по краям кадра. */
const VIGNETTE = 0.22;

const mix = (a, b, t) => a + (b - a) * t;

async function readPixels(input) {
  const { data, info } = await sharp(input)
    .resize(WIDTH)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { rgb: data, W: info.width, H: info.height };
}

function luminance(rgb, count) {
  const lum = new Float32Array(count);
  for (let i = 0, p = 0; p < count; i += 3, p++) {
    lum[p] = rgb[i] * 0.299 + rgb[i + 1] * 0.587 + rgb[i + 2] * 0.114;
  }
  return lum;
}

/** Порог: середина между яркостью верхней полосы и центра кадра. */
function autoThreshold(lum, W, H) {
  let sky = 0;
  let skyN = 0;
  for (let y = 0; y < H * 0.08; y++) for (let x = 0; x < W; x++) { sky += lum[y * W + x]; skyN++; }
  let obj = 0;
  let objN = 0;
  for (let y = Math.round(H * 0.45); y < H * 0.7; y++)
    for (let x = Math.round(W * 0.25); x < W * 0.75; x++) { obj += lum[y * W + x]; objN++; }

  const skyMean = sky / skyN;
  const objMean = obj / objN;
  if (skyMean - objMean < 60) {
    throw new Error(
      `Небо и объект слишком близки по яркости (${Math.round(skyMean)} и ${Math.round(objMean)}). ` +
        'Нужен кадр с автомобилем на фоне открытого светлого неба.',
    );
  }
  // Ближе к небу, чем к объекту: блики на кузове не должны считаться небом.
  return objMean + (skyMean - objMean) * 0.78;
}

function floodSky(lum, W, H, threshold) {
  const isSky = new Uint8Array(W * H);
  const stack = [];
  const limitY = Math.round(H * MAX_DEPTH);

  for (let x = 0; x < W; x++) if (lum[x] > threshold) { isSky[x] = 1; stack.push(x); }

  while (stack.length) {
    const p = stack.pop();
    const y = (p / W) | 0;
    const x = p - y * W;
    const push = (nx, ny) => {
      if (nx < 0 || nx >= W || ny < 0 || ny >= limitY) return;
      const q = ny * W + nx;
      if (isSky[q] || lum[q] <= threshold) return;
      isSky[q] = 1;
      stack.push(q);
    };
    push(x - 1, y); push(x + 1, y); push(x, y - 1); push(x, y + 1);
  }
  return isSky;
}

/**
 * Плита неба.
 *
 * Строится не растяжкой каждой колонки вниз, а по двум профилям —
 * вертикальному и горизонтальному. Растяжка по колонкам оставляет
 * вертикальные полосы под каждым фонарным столбом, торчащим в небо.
 */
function buildSky(rgb, lum, isSky, W, H) {
  // Горизонтальная неравномерность берётся из настоящего неба — она не даёт
  // градиенту выглядеть синтетическим. Вертикаль задана вручную: исходное
  // небо здесь ровное и пересветлённое, из него полезной кривой не выйдет.
  const colLum = new Float32Array(W);
  const band = Math.max(1, Math.round(H * 0.08));
  let colMean = 0;
  for (let x = 0; x < W; x++) {
    let sum = 0;
    let n = 0;
    for (let y = 0; y < band; y++) if (isSky[y * W + x]) { sum += lum[y * W + x]; n++; }
    colLum[x] = n ? sum / n : 0;
    colMean += colLum[x];
  }
  colMean /= W;

  const rampAt = (t) => {
    let a = SKY_STOPS[0];
    let b = SKY_STOPS[SKY_STOPS.length - 1];
    for (let i = 0; i < SKY_STOPS.length - 1; i++) {
      if (t >= SKY_STOPS[i].t && t <= SKY_STOPS[i + 1].t) {
        a = SKY_STOPS[i];
        b = SKY_STOPS[i + 1];
        break;
      }
    }
    const span = Math.max(1e-6, b.t - a.t);
    const k = Math.min(1, Math.max(0, (t - a.t) / span));
    return [mix(a.c[0], b.c[0], k), mix(a.c[1], b.c[1], k), mix(a.c[2], b.c[2], k)];
  };

  const out = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    const ny = y / H;
    const base = rampAt(ny);
    for (let x = 0; x < W; x++) {
      const nx = x / W;
      // ±6% яркости от реального неба — чуть живой горизонтальный рельеф
      const shade = colMean > 0 ? 0.94 + 0.12 * (colLum[x] / colMean - 1 + 0.5) : 1;

      let r = base[0] * shade;
      let g = base[1] * shade;
      let b = base[2] * shade;

      // Виньетка: края кадра уходят в темноту
      const vig = 1 - VIGNETTE * Math.min(1, Math.hypot((nx - 0.5) / 0.72, (ny - 0.36) / 0.9) ** 2);
      r *= vig;
      g *= vig;
      b *= vig;

      const d = (y * W + x) * 3;
      out[d] = Math.min(255, Math.round(r));
      out[d + 1] = Math.min(255, Math.round(g));
      out[d + 2] = Math.min(255, Math.round(b));
    }
  }
  return out;
}

/**
 * Расширение области неба на несколько пикселей.
 *
 * Пиксели на самой кромке смешаны с небом. Исходное небо почти белое, новое —
 * тёмное, поэтому любой остаток старого читается светлым ореолом по контуру
 * кузова и деревьев. Сдвигаем границу внутрь объекта, за загрязнённые пиксели.
 */
function dilateSky(isSky, W, H, passes) {
  let current = isSky;
  for (let i = 0; i < passes; i++) {
    const next = Uint8Array.from(current);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = y * W + x;
        if (current[p]) continue;
        if (
          (x > 0 && current[p - 1]) ||
          (x < W - 1 && current[p + 1]) ||
          (y > 0 && current[p - W]) ||
          (y < H - 1 && current[p + W])
        ) {
          next[p] = 1;
        }
      }
    }
    current = next;
  }
  return current;
}

/**
 * Закатное зарево над линией горизонта.
 *
 * Пишется в прозрачную зону плиты переднего плана — там, где вырезано небо, —
 * и потому всегда стоит ровно над кромкой деревьев и крышей: обе живут в этой
 * же плите. Свечение в плите неба так не умеет, его сносит масштабированием
 * при другом соотношении сторон экрана.
 *
 * Возвращает полупрозрачный слой RGBA, который накладывается поверх плиты
 * неба и под непрозрачной частью переднего плана.
 */
function buildHalo(isSky, W, H) {
  const skyline = new Int32Array(W);
  for (let x = 0; x < W; x++) {
    let y = 0;
    while (y < H && isSky[y * W + x]) y++;
    skyline[x] = y;
  }

  // Линия горизонта — медиана кромки, одно число на весь кадр.
  //
  // Привязывать зарево к кромке каждой колонки нельзя: оно начинает повторять
  // её контур и читается как светящийся купол над крышей автомобиля, а не как
  // закат. Проверено — выглядит неестественно. Настоящее зарево горизонтально,
  // а деревья и кузов просто встают на его фоне силуэтом.
  const sorted = Array.from(skyline).sort((a, b) => a - b);
  const horizon = sorted[Math.round(sorted.length * 0.62)] ?? Math.round(H * 0.3);

  const reachPx = H * HALO.reach;
  const out = Buffer.alloc(W * H * 4);

  for (let x = 0; x < W; x++) {
    const nx = x / W;
    const warm = Math.max(0, 1 - Math.abs(nx - HALO.x) / HALO.spread) ** 1.6 * HALO.strength;
    const brand =
      Math.max(0, 1 - Math.abs(nx - BRAND_HALO.x) / BRAND_HALO.spread) ** 1.8 * BRAND_HALO.strength;

    const from = Math.max(0, Math.round(horizon - reachPx));
    // Немного заходим ниже горизонта — там всё равно непрозрачный передний
    // план, зато не остаётся щели по самой кромке.
    const to = Math.min(H, Math.round(horizon + H * 0.04));

    for (let y = from; y < to; y++) {
      const t = y <= horizon ? 1 - (horizon - y) / reachPx : 1;
      const falloff = t ** 2.2;

      const aWarm = falloff * warm;
      const aBrand = falloff * brand;
      const a = Math.min(1, aWarm + aBrand);
      if (a <= 0.002) continue;

      const k = aWarm + aBrand > 0 ? aBrand / (aWarm + aBrand) : 0;
      const d = (y * W + x) * 4;
      out[d] = Math.round(mix(HALO.color[0], BRAND_HALO.color[0], k));
      out[d + 1] = Math.round(mix(HALO.color[1], BRAND_HALO.color[1], k));
      out[d + 2] = Math.round(mix(HALO.color[2], BRAND_HALO.color[2], k));
      out[d + 3] = Math.round(255 * a);
    }
  }
  return out;
}

async function buildCar(rgb, isSky, W, H) {
  const alpha = Buffer.alloc(W * H);
  for (let p = 0; p < W * H; p++) alpha[p] = isSky[p] ? 0 : 255;

  // blur() на одноканальном raw промотирует изображение в 3 канала —
  // читать результат как один канал нельзя, альфа поедет со сдвигом.
  const blurred = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
    .blur(FEATHER)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bc = blurred.info.channels;

  const out = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    out[p * 4] = rgb[p * 3];
    out[p * 4 + 1] = rgb[p * 3 + 1];
    out[p * 4 + 2] = rgb[p * 3 + 2];
    out[p * 4 + 3] = blurred.data[p * bc];
  }
  return out;
}

async function main() {
  const input = process.argv[2];
  if (!input || !existsSync(input)) {
    console.error('Укажите исходный кадр: node scripts/build-hero-planes.mjs фото.jpg');
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), 'public', 'hero');
  mkdirSync(outDir, { recursive: true });

  const { rgb, W, H } = await readPixels(input);
  const lum = luminance(rgb, W * H);
  const threshold = autoThreshold(lum, W, H);
  const isSky = floodSky(lum, W, H, threshold);

  let skyPx = 0;
  for (let p = 0; p < W * H; p++) if (isSky[p]) skyPx++;
  const skyShare = (skyPx / (W * H)) * 100;
  if (skyShare < 5) {
    throw new Error(`Неба нашлось всего ${skyShare.toFixed(1)}% — проверьте кадр.`);
  }
  if (skyShare > 75) {
    throw new Error(`Небом посчиталось ${skyShare.toFixed(1)}% кадра — заливка протекла в объект.`);
  }

  // Плита неба строится по исходной маске, планы с прозрачностью — по расширенной.
  const eroded = dilateSky(isSky, W, H, ERODE);
  const skyRgb = buildSky(rgb, lum, isSky, W, H);
  const carRgba = await buildCar(rgb, eroded, W, H);
  const haloRgba = buildHalo(eroded, W, H);

  const skyPath = path.join(outDir, 'sky.webp');
  const carPath = path.join(outDir, 'car.webp');

  // Доращиваем плиты сверху до пропорции reference.
  const plateH = Math.round(W / PLATE_RATIO);
  const padTop = Math.max(0, plateH - H);

  await sharp(skyRgb, { raw: { width: W, height: H, channels: 3 } })
    .blur(3)
    // Небо продолжается вверх своим самым тёмным цветом — зенитом.
    .extend({
      top: padTop,
      background: { r: SKY_STOPS[0].c[0], g: SKY_STOPS[0].c[1], b: SKY_STOPS[0].c[2] },
    })
    .webp({ quality: 80 })
    .toFile(skyPath);

  // Зарево смягчается и кладётся ПОД передний план: свечение должно быть за
  // деревьями и кузовом, иначе они перестанут читаться силуэтом.
  const haloSoft = await sharp(haloRgba, { raw: { width: W, height: H, channels: 4 } })
    .blur(Math.max(2, Math.round(W * 0.006)))
    .png()
    .toBuffer();

  const carLayer = await sharp(carRgba, { raw: { width: W, height: H, channels: 4 } })
    // Передний план притемняется: чёрный силуэт на светлом горизонте — это и
    // есть тональный размах, ради которого всё делается.
    .modulate({ brightness: 0.82, saturation: 0.8 })
    .linear(1.12, -14)
    .png()
    .toBuffer();

  await sharp(haloSoft)
    .composite([{ input: carLayer }])
    // Прозрачное поле сверху — до пропорции reference.
    .extend({ top: padTop, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 86, alphaQuality: 100 })
    .toFile(carPath);

  // ── Картинка для соцсетей: те же планы, сведённые в один кадр ─────────
  const OG_W = 1200;
  const OG_H = 630;
  const carOgH = Math.round((OG_W * H) / W);
  const ogPath = path.join(outDir, 'og.jpg');

  // Крыша автомобиля приходится на 19.3% высоты плиты — сажаем её на ~200px.
  const carTop = Math.max(0, Math.round(200 - 0.193 * carOgH));
  // Плита выше кадра соцсетей, поэтому обрезаем её по видимой полосе:
  // composite не принимает вход больше основы.
  const visibleH = Math.min(carOgH, OG_H - carTop);

  const ogSky = await sharp(skyPath).resize(OG_W, OG_H, { fit: 'cover' }).toBuffer();
  const ogCar = await sharp(carPath)
    .resize(OG_W)
    .extract({ left: 0, top: 0, width: OG_W, height: visibleH })
    .toBuffer();

  await sharp(ogSky)
    .composite([{ input: ogCar, top: carTop, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(ogPath);

  const kb = (p) => (statSync(p).size / 1024).toFixed(0) + ' КБ';
  console.log(`Порог по яркости: ${Math.round(threshold)}, неба вырезано: ${skyShare.toFixed(1)}%`);
  console.log(`  public/hero/sky.webp  ${W}x${plateH}  ${kb(skyPath)}`);
  console.log(`  public/hero/car.webp  ${W}x${plateH}  ${kb(carPath)}  (с прозрачностью)`);
  console.log(`  public/hero/og.jpg    ${OG_W}x${OG_H}  ${kb(ogPath)}  (для соцсетей)`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
