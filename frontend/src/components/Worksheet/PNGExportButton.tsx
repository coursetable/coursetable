import { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import saveFile from 'file-saver';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import logo from '../../images/brand/bluebook.svg';
import wordmarkOutlines from '../../images/brand/wordmark_outlines.svg';
import { useStore } from '../../store';

const CANVAS_SCALE = 2; // Higher resolution export (2x)
const WATERMARK_PADDING = 20; // Padding from canvas edges (base pixels)
const LOGO_HEIGHT = 40; // Logo icon height (base pixels)
const WORDMARK_HEIGHT = 24; // Wordmark text height (base pixels)
const LOGO_WORDMARK_SPACING = 8; // Space between logo and wordmark (base pixels)

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
): Promise<void> => {
  const [logoImg, wordmarkImg] = await Promise.all([
    loadImage(logo),
    loadImage(wordmarkOutlines),
  ]);

  const scaledPadding = WATERMARK_PADDING * CANVAS_SCALE;
  const scaledLogoHeight = LOGO_HEIGHT * CANVAS_SCALE;
  const scaledWordmarkHeight = WORDMARK_HEIGHT * CANVAS_SCALE;
  const scaledSpacing = LOGO_WORDMARK_SPACING * CANVAS_SCALE;

  const logoY = canvasHeight - scaledLogoHeight - scaledPadding;
  const wordmarkY = canvasHeight - scaledWordmarkHeight - scaledPadding;

  const logoAspectRatio = logoImg.width / logoImg.height;
  const logoWidth = scaledLogoHeight * logoAspectRatio;
  ctx.drawImage(logoImg, scaledPadding, logoY, logoWidth, scaledLogoHeight);

  const wordmarkAspectRatio = wordmarkImg.width / wordmarkImg.height;
  const wordmarkWidth = scaledWordmarkHeight * wordmarkAspectRatio;
  const wordmarkX = scaledPadding + logoWidth + scaledSpacing;
  ctx.drawImage(
    wordmarkImg,
    wordmarkX,
    wordmarkY,
    wordmarkWidth,
    scaledWordmarkHeight,
  );
};

export default function PNGExportButton() {
  const { viewedSeason } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
    })),
  );
  const [isExporting, setIsExporting] = useState(false);

  const exportPNG = async () => {
    setIsExporting(true);
    try {
      const calendarElement = document.querySelector('.rbc-calendar');

      if (!calendarElement) {
        toast.error('Calendar not found. Please try again.');
        setIsExporting(false);
        return;
      }

      const canvas = await html2canvas(calendarElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: CANVAS_SCALE,
        logging: false,
        useCORS: true,
      });

      // HTML2Canvas result can't be drawn on directly
      // So we redraw it to add watermark
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const finalCtx = finalCanvas.getContext('2d');

      if (!finalCtx) {
        toast.error('Failed to get canvas context.');
        setIsExporting(false);
        return;
      }

      finalCtx.drawImage(canvas, 0, 0);
      await drawWatermark(finalCtx, finalCanvas.height);

      finalCanvas.toBlob((blob) => {
        if (blob) {
          saveFile(blob, `${viewedSeason}_worksheet.png`);
          toast.success('Calendar exported as PNG!');
        } else {
          toast.error('Failed to export calendar as PNG.');
        }
        setIsExporting(false);
      });
    } catch {
      toast.error('Error exporting calendar as PNG.');
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
