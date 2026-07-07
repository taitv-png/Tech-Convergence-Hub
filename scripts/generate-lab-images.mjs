import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const rootDir = path.resolve(process.cwd());
const sourceDir = path.join(rootDir, 'public', 'lab-images');
const baseFiles = [
  'tech-01.jpg',
  'tech-02.jpg',
  'tech-03.jpg',
  'tech-04.jpg',
  'tech-05.jpg',
  'tech-06.jpg',
  'tech-07.jpg',
  'tech-08.jpg',
  'tech-09.jpg',
  'tech-10.jpg',
  'tech-11.jpg',
  'tech-12.jpg',
  'tech-13.jpg',
];

const labIds = [
  'precision-mechanics-lab',
  'hologram-printing-lab',
  'classroom-e103',
  'hologram-exhibition-room',
  'immersive-technology-center',
  'human-centered-ai-lab',
  'urban-physics-lab',
  'research-lab',
  'smart-city-lab',
  'digital-twin-lab',
  'automated-vehicles-lab',
  'space-ocean-robotics-lab',
  'ocean-robotics-lab',
  'industrial-production-line-lab',
  'embedded-iot-process-lab',
  'process-control-industrial-network-lab',
  'edge-physical-ai-lab',
  'ai-big-data-lab',
  'ocean-monitoring-planning-energy-lab',
  'ocean-physics-lab',
  'ocean-renewable-energy-lab',
  'smart-port-mobility-rail-lab',
  'smart-mobility-lab',
  'rail-systems-lab',
  'classroom-e503',
  'classroom-e502',
  'classroom-e504',
  'classroom-e501',
  'security-lab',
  'security-lab-extra',
  'circular-economy-lab',
  'isc-open-lab',
  'open-lab-prototyping-library',
  'meeting-station-cafe',
  'innovation-lounge',
];

const positions = ['center', 'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'entropy'];

const colorSets = [
  { r: 255, g: 106, b: 0 },
  { r: 0, g: 180, b: 255 },
  { r: 71, g: 214, b: 139 },
  { r: 140, g: 92, b: 255 },
  { r: 255, g: 204, b: 0 },
  { r: 255, g: 90, b: 132 },
  { r: 36, g: 160, b: 255 },
];

const hashString = (value) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const loadBase = async (fileName) => sharp(path.join(sourceDir, fileName)).rotate();

const generateVariant = async ({ inputPath, outputPath, seed, width, height, kind }) => {
  const palette = colorSets[seed % colorSets.length];
  const overlayOpacity = kind === 'card' ? 0.12 : 0.16;
  const labelOpacity = kind === 'card' ? 0.10 : 0.14;
  const gradientStops = `
    <stop offset="0%" stop-color="rgba(${palette.r}, ${palette.g}, ${palette.b}, ${overlayOpacity})" />
    <stop offset="100%" stop-color="rgba(0, 0, 0, 0.05)" />
  `;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">${gradientStops}</linearGradient>
        <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
          <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <rect width="100%" height="100%" fill="url(#grid)" opacity="${labelOpacity}" />
      <path d="M 0 ${Math.round(height * 0.78)} C ${Math.round(width * 0.22)} ${Math.round(height * 0.72)}, ${Math.round(width * 0.42)} ${Math.round(height * 0.95)}, ${Math.round(width)} ${Math.round(height * 0.82)}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3" />
      <circle cx="${Math.round(width * 0.12)}" cy="${Math.round(height * 0.18)}" r="${Math.round(Math.min(width, height) * 0.08)}" fill="rgba(255,255,255,0.12)" />
      <circle cx="${Math.round(width * 0.86)}" cy="${Math.round(height * 0.2)}" r="${Math.round(Math.min(width, height) * 0.05)}" fill="rgba(255,255,255,0.14)" />
    </svg>`;

  await sharp(inputPath)
    .resize(width, height, { fit: 'cover', position: positions[seed % positions.length] })
    .modulate({ brightness: 0.96 + (seed % 8) * 0.02, saturation: 1.02 + (seed % 5) * 0.05 })
    .sharpen({ sigma: 0.8 + (seed % 3) * 0.2 })
    .composite([{ input: Buffer.from(svg), blend: 'over' }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outputPath);
};

const main = async () => {
  const outputDir = path.join(rootDir, 'public', 'lab-images');
  await fs.mkdir(outputDir, { recursive: true });

  for (let index = 0; index < labIds.length; index += 1) {
    const baseCard = baseFiles[index % baseFiles.length];
    const baseDetail = baseFiles[(index + 5) % baseFiles.length];
    const cardName = `lab-card-${String(index + 1).padStart(2, '0')}.jpg`;
    const detailName = `lab-detail-${String(index + 1).padStart(2, '0')}.jpg`;

    const cardSeed = hashString(`${labIds[index]}|card|${index}`);
    const detailSeed = hashString(`${labIds[index]}|detail|${index}`);

    await generateVariant({
      inputPath: path.join(sourceDir, baseCard),
      outputPath: path.join(outputDir, cardName),
      seed: cardSeed,
      width: 1200,
      height: 900,
      kind: 'card',
    });

    await generateVariant({
      inputPath: path.join(sourceDir, baseDetail),
      outputPath: path.join(outputDir, detailName),
      seed: detailSeed,
      width: 1800,
      height: 1200,
      kind: 'detail',
    });

    process.stdout.write(`generated ${index + 1}/${labIds.length}\r`);
  }

  process.stdout.write('\n');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});