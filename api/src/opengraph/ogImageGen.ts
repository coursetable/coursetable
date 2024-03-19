import sharp from 'sharp';

export async function generateOpenGraphImage(
  courseTitle: string,
): Promise<Buffer> {
  const width = 1200;
  const height = 630;
  const svgText = `
    <svg width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" fill="#333">${courseTitle}</text>
    </svg>
  `;

  // Create a buffer from the SVG text
  const svgBuffer = Buffer.from(svgText);

  const image = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: svgBuffer }])
    .png()
    .toBuffer();

  return image;
}
