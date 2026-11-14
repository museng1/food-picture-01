// food-picture-01 entry: a steaming bowl of tonkotsu ramen, shot from above.
//
// The photograph lives beside this file as entry.png (a JPEG wearing the
// entry.png name, which the gate allows: format is read from the first bytes).
// The program delivers those bytes to /output/entry.png, after proving the
// file still passes every gate rule itself: a whole PNG or JPEG, at most
// 1 MiB, at most 1024x1024 pixels.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Revision note: wholeness is verified, not assumed — a JPEG must end at its
// FF D9 marker and a PNG's chunks must tile the file exactly (see checkWhole).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BYTE_LIMIT = 1_048_576;
const SIDE_LIMIT = 1024;

function refuse(reason: string): never {
  throw new Error(`food-picture-01: ${reason}`);
}

function isPng(b: Buffer): boolean {
  return b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
}

function isJpeg(b: Buffer): boolean {
  return b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
}

// The size the header promises, whichever format the file is.
function headerSize(b: Buffer): { width: number; height: number } {
  if (isPng(b)) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  let at = 2;
  while (at + 9 < b.length && b[at] === 0xff) {
    const marker = b[at + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: b.readUInt16BE(at + 5), width: b.readUInt16BE(at + 7) };
    }
    at += 2 + b.readUInt16BE(at + 2);
  }
  return refuse('no start-of-frame segment found');
}

// Nothing missing, nothing trailing: the file ends exactly where its format
// says it should.
function checkWhole(b: Buffer): void {
  if (isJpeg(b)) {
    if (b[b.length - 2] !== 0xff || b[b.length - 1] !== 0xd9) refuse('JPEG lacks its end-of-image marker');
    return;
  }
  let at = 8;
  while (at + 8 <= b.length) {
    const length = b.readUInt32BE(at);
    const type = b.toString('ascii', at + 4, at + 8);
    at += 12 + length;
    if (type === 'IEND') break;
  }
  if (at !== b.length) refuse('PNG chunks do not tile the file exactly');
}

function deliver(): void {
  const bytes = readFileSync(new URL('./entry.png', import.meta.url));
  if (!isPng(bytes) && !isJpeg(bytes)) refuse('entry.png is neither PNG nor JPEG');
  if (bytes.length > BYTE_LIMIT) refuse(`${bytes.length} bytes exceeds the 1 MiB limit`);
  const { width, height } = headerSize(bytes);
  if (width > SIDE_LIMIT || height > SIDE_LIMIT) refuse(`${width}x${height} exceeds 1024x1024`);
  checkWhole(bytes);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, 'entry.png');
  writeFileSync(target, bytes);
  console.log(`served entry.png (${isPng(bytes) ? 'PNG' : 'JPEG'} ${width}x${height}, ${bytes.length} bytes) -> ${target}`);
}

deliver();
