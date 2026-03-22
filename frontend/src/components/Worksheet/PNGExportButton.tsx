import { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import saveFile from 'file-saver';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import ctWhite from '../../images/brand/ct_white.svg';
import wordmarkOutlines from '../../images/brand/wordmark_outlines.svg';
import { useStore } from '../../store';

const EXPORT_WIDTH = 1600;
const EXPORT_HEIGHT = 1000;
const CANVAS_SCALE = 2; // Higher resolution export (2x)
const WATERMARK_PADDING = 8; // Padding from canvas edges (base pixels)
const WORDMARK_HEIGHT = 14; // Wordmark text height (base pixels)
const MAX_RETRIES = 5; // Maximum retry attempts for watermark
const RETRY_DELAY = 100; // Delay between retries in milliseconds

const EXPORT_CLASS = 'exporting-png';

const EXPORT_LAYOUT_WIDTH = EXPORT_WIDTH / CANVAS_SCALE;
const EXPORT_LAYOUT_HEIGHT = EXPORT_HEIGHT / CANVAS_SCALE;

const EXPORT_BG = {
  light: '#ffffff',
  dark: '#121212',
} as const;

function drawCaptureLetterboxed(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  theme: 'light' | 'dark',
): void {
  const bg = EXPORT_BG[theme];
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  const scale = Math.min(
    EXPORT_WIDTH / source.width,
    EXPORT_HEIGHT / source.height,
  );
  const drawW = source.width * scale;
  const drawH = source.height * scale;
  const offsetX = (EXPORT_WIDTH - drawW) / 2;
  const offsetY = (EXPORT_HEIGHT - drawH) / 2;

  ctx.drawImage(source, offsetX, offsetY, drawW, drawH);
}

/** Widen cloned calendar so capture matches desktop export, not viewport. */
function applyExportLayoutToClonedCalendar(doc: Document): void {
  const cal = doc.querySelector<HTMLElement>('.rbc-calendar');
  if (!cal) return;

  cal.style.setProperty('box-sizing', 'border-box', 'important');
  cal.style.setProperty('width', `${EXPORT_LAYOUT_WIDTH}px`, 'important');
  cal.style.setProperty('max-width', `${EXPORT_LAYOUT_WIDTH}px`, 'important');
  cal.style.setProperty('min-height', `${EXPORT_LAYOUT_HEIGHT}px`, 'important');
  cal.style.setProperty('height', 'auto', 'important');
  cal.style.setProperty('overflow', 'visible', 'important');

  let node: HTMLElement | null = cal.parentElement;
  for (let depth = 0; node && node !== doc.body && depth < 10; depth += 1) {
    node.style.setProperty('overflow', 'visible', 'important');
    node.style.setProperty('max-width', 'none', 'important');
    node = node.parentElement;
  }
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  fetch(src)
    .then((response) => response.blob())
    .then((blob) => {
      const dataUrl = URL.createObjectURL(blob);
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          URL.revokeObjectURL(dataUrl);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(dataUrl);
          reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = dataUrl;
      });
    })
    .catch((error: unknown) => {
      throw new Error(`Failed to fetch image: ${src}`, { cause: error });
    });

const drawWatermark = async (
  ctx: CanvasRenderingContext2D,
  canvasHeight: number,
  theme: 'light' | 'dark',
): Promise<void> => {
  const logoSrc = theme === 'dark' ? ctWhite : wordmarkOutlines;
  const logoImg = await loadImage(logoSrc);

  const scaledPadding = WATERMARK_PADDING * CANVAS_SCALE;
  const scaledWordmarkHeight = WORDMARK_HEIGHT * CANVAS_SCALE;

  const wordmarkY = canvasHeight - scaledWordmarkHeight - scaledPadding;

  const logoAspectRatio = logoImg.width / logoImg.height;
  const wordmarkWidth = scaledWordmarkHeight * logoAspectRatio;
  ctx.drawImage(
    logoImg,
    scaledPadding,
    wordmarkY,
    wordmarkWidth,
    scaledWordmarkHeight,
  );
};

// Retry watermark loading to handle temporary failures
const retryWatermark = async (
  ctx: CanvasRenderingContext2D,
  canvasHeight: number,
  theme: 'light' | 'dark',
): Promise<void> => {
  let lastError: Error | undefined = undefined;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await drawWatermark(ctx, canvasHeight, theme);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES - 1) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, RETRY_DELAY);
        });
      }
    }
  }
  throw lastError ?? new Error('Failed to load watermark after retries');
};

export default function PNGExportButton() {
  const { viewedSeason, theme } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      theme: state.theme,
    })),
  );
  const [isExporting, setIsExporting] = useState(false);

  const exportPNG = async () => {
    setIsExporting(true);
    try {
      const calendarElement =
        document.querySelector<HTMLElement>('.rbc-calendar');

      if (!calendarElement)
        throw new Error('Calendar not found. Please try again.');

      const canvas = await html2canvas(calendarElement, {
        backgroundColor: theme === 'dark' ? EXPORT_BG.dark : EXPORT_BG.light,
        scale: CANVAS_SCALE,
        logging: false,
        useCORS: true,
        onclone(doc) {
          doc.body.classList.add(EXPORT_CLASS);
          doc.documentElement.dataset.theme = theme;
          applyExportLayoutToClonedCalendar(doc);
        },
      });

      // Letterbox capture, then watermark
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = EXPORT_WIDTH;
      finalCanvas.height = EXPORT_HEIGHT;
      const finalCtx = finalCanvas.getContext('2d');

      if (!finalCtx) throw new Error('Failed to get canvas context.');

      drawCaptureLetterboxed(finalCtx, canvas, theme);
      await retryWatermark(finalCtx, finalCanvas.height, theme);

      await new Promise<void>((resolve, reject) => {
        finalCanvas.toBlob((blob) => {
          if (blob) {
            saveFile(blob, `${viewedSeason}_worksheet.png`);
            toast.success('Calendar exported as PNG!');
            resolve();
          } else {
            reject(new Error('Failed to export calendar as PNG.'));
          }
        });
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error exporting calendar as PNG.';
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button type="button" onClick={exportPNG} disabled={isExporting}>
      <span style={{ height: '2rem', width: '2rem', display: 'inline-block' }}>
        <FaImage style={{ height: '1.5rem', width: '1.5rem' }} />
      </span>
      &nbsp;&nbsp;{isExporting ? 'Exporting...' : 'Download as PNG'}
    </button>
  );
}
