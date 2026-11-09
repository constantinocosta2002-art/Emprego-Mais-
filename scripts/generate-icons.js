import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height) {
  // Simple PNG encoder in pure node with zlib
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const rOuter = width * 0.46;
  const rInner = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Dark gradient #0B0F17 to #05070A
      const bgR = Math.floor(11 - (y / height) * 6);
      const bgG = Math.floor(15 - (y / height) * 8);
      const bgB = Math.floor(23 - (y / height) * 13);

      let r = bgR;
      let g = bgG;
      let b = bgB;
      let a = 255;

      // Outer gold ring
      if (Math.abs(dist - rOuter) < width * 0.02) {
        r = 212; g = 175; b = 55; // Gold #D4AF37
      } else if (dist < rOuter && dist > rInner) {
        // Inner gold glow accent
        if ((x + y) % 12 < 3) {
          r = 245; g = 158; b = 11;
        }
      }

      // Central stylized "V" emblem
      // Normalised coordinates (-1 to 1)
      const nx = dx / (width * 0.32);
      const ny = dy / (height * 0.32);

      // V shape: y in [-0.6, 0.6], x in [-0.6, 0.6]
      const vLeft = Math.abs(ny - (nx * 1.8 + 0.2));
      const vRight = Math.abs(ny - (-nx * 1.8 + 0.2));
      const inV = (vLeft < 0.22 && nx < 0.1 && ny > -0.6 && ny < 0.6) ||
                  (vRight < 0.22 && nx > -0.1 && ny > -0.6 && ny < 0.6);

      // Central upward arrow
      const inArrowShaft = Math.abs(nx) < 0.1 && ny > -0.2 && ny < 0.4;
      const inArrowHead = ny < -0.2 && ny > -0.6 && Math.abs(nx) < ((-ny - 0.2) * 0.8);

      if (inV || inArrowShaft || inArrowHead) {
        // Shimmering Gold
        r = 245; g = 210; b = 80;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(4 + 4 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  
  // Calculate CRC32
  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// Generate PWA assets
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180));
fs.writeFileSync('public/favicon.ico', createPNG(64, 64));
console.log('Icons generated successfully!');
