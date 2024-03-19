import Jimp from 'jimp';

export async function generateOpenGraphImage(
  courseTitle: string,
): Promise<Buffer> {
  const width = 1200;
  const height = 630;

  let image = new Jimp(width, height, '#ffffff');

  const fontSize = 64;
  const fontPath = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

  const textWidth = Jimp.measureText(fontPath, courseTitle);
  const textHeight = Jimp.measureTextHeight(fontPath, courseTitle, width);

  // Add text to the image
  image = await image.print(
    fontPath,
    (width - textWidth) / 2,
    (height - textHeight) / 2,
    {
      text: courseTitle,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    width,
    height,
  );

  // Convert the image to Buffer
  return await image.getBufferAsync(Jimp.MIME_PNG);
}
