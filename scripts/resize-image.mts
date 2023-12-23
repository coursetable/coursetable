// Adopted from https://github.com/facebook/docusaurus/blob/1a62b41e319845af33375d1bf7763cb83c73bb56/admin/scripts/resizeImage.js
/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import sharp from 'sharp';
import imageSizeWrong from 'image-size';

// https://arethetypeswrong.github.io/?p=image-size%401.0.2
// It declared the wrong export shape
const imageSize = imageSizeWrong.default;

// You can use it as:
//
// # Resize all images in headshots (which is most likely)
// bun scripts/resize-image.mts
//
// # Resize specified images / all images in a folder
// # This does not read folders recursively as of now
// bun scripts/resize-image.mts image1.png some-folder ...
//
// By default, images are resized to 400×400. You can explicitly give a
// width/height as arguments.
// bun scripts/resize-image.mts --width 400 --height 400 image1.png

function maybeParseInt(n: string) {
  const res = Number.parseInt(n, 10);
  if (Number.isNaN(res)) return undefined;
  return res;
}

const headshotsPath = 'frontend/src/images/headshots';

program
  .arguments('[imagePaths...]')
  .option('-w, --width <width>', 'Image width', maybeParseInt)
  .option('-h, --height <height>', 'Image height', maybeParseInt)
  .option('--test', 'Test mode')
  .action(
    async (
      imagePaths: string[],
      options: {
        width: number | undefined;
        height: number | undefined;
        test: boolean;
      },
    ) => {
      if (imagePaths.length === 0) imagePaths.push(headshotsPath);
      const rootDir = fileURLToPath(new URL('..', import.meta.url));
      const images = (
        await Promise.all(
          imagePaths.map(async (p) =>
            path.extname(p)
              ? [path.resolve(rootDir, p)]
              : (await fs.readdir(p, { recursive: true })).map((f) =>
                  path.resolve(rootDir, p, f),
                ),
          ),
        )
      )
        .flat()
        .filter((p) => ['.png', '.jpg', '.jpeg'].includes(path.extname(p)));

      const stats = {
        skipped: 0,
        resized: 0,
      };

      await Promise.all(
        images.map(async (imgPath) => {
          const { width, height } = imageSize(imgPath);
          if (!width || !height) {
            console.warn(`Could not read image ${imgPath}`);
            return;
          }
          const targetWidth = options.width ?? 400;
          const targetHeight =
            options.height ?? Math.floor((height / width) * targetWidth);
          if (
            width <= targetWidth &&
            height <= targetHeight &&
            imgPath.endsWith('.jpg')
          ) {
            // Do not emit if not resized. Important because we can't guarantee
            // idempotency during resize -> optimization
            stats.skipped += 1;
            return;
          }
          console.log(
            `Resized ${imgPath}: before ${width}×${height}; now ${targetWidth}×${targetHeight}`,
          );

          if (!options.test) {
            const data = await sharp(imgPath)
              .resize(targetWidth, targetHeight, {
                fit: 'cover',
                position: 'top',
              })
              .jpeg()
              .toBuffer();
            await fs.unlink(imgPath);
            await fs.writeFile(imgPath.replace(/jpeg|png/u, 'jpg'), data);
          }
          stats.resized += 1;
        }),
      );

      console.log(`Images resizing complete.
  resized: ${stats.resized}
  skipped: ${stats.skipped}`);

      if (stats.resized > 0 && options.test) {
        console.error(
          'Found images that were not resized. Please run the resize script locally (or through bun lint).',
        );
        process.exit(1);
      }
    },
  );

program.parse(process.argv);

// You should also run
// optimizt `find src/images/headshots -type f -name '*.jpg'`.
// This is not included here because @funboxteam/optimizt doesn't seem to play
// well with M1 so I had to run this in a Rosetta terminal.
