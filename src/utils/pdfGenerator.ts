import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper canvas context to normalize modern CSS colors (oklch, lab, etc.) into hex/rgb
const getCanvasCtx = () => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  return canvas.getContext('2d');
};

const canvasCtx = getCanvasCtx();

function normalizeColor(colorStr: string): string {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit' || colorStr === 'initial') {
    return colorStr;
  }
  if (!canvasCtx) return colorStr;
  try {
    canvasCtx.fillStyle = '#000000';
    canvasCtx.fillStyle = colorStr;
    return canvasCtx.fillStyle;
  } catch {
    return colorStr;
  }
}

export async function generateOrderPDFBlob(elementId: string): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemento para PDF não encontrado');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    onclone: (clonedDoc, clonedElement) => {
      // 1. Convert all oklch/lab definitions in all <style> tags
      const styleTags = clonedDoc.querySelectorAll('style');
      styleTags.forEach((styleTag) => {
        if (styleTag.textContent && (styleTag.textContent.includes('oklch') || styleTag.textContent.includes('lab'))) {
          styleTag.textContent = styleTag.textContent.replace(/(?:oklch|lab)\([^)]+\)/gi, (match) => {
            return normalizeColor(match);
          });
        }
      });

      // 2. Fix inline and computed color styles on all target elements
      if (clonedElement) {
        const windowRef = clonedDoc.defaultView || window;
        const colorProps = [
          'color',
          'background-color',
          'border-color',
          'border-top-color',
          'border-right-color',
          'border-bottom-color',
          'border-left-color',
          'outline-color',
        ];

        const fixNodeColors = (node: HTMLElement) => {
          const computed = windowRef.getComputedStyle(node);
          for (const prop of colorProps) {
            const val = computed.getPropertyValue(prop);
            if (val && (val.includes('oklch') || val.includes('lab') || val.includes('color('))) {
              const rgbVal = normalizeColor(val);
              node.style.setProperty(prop, rgbVal, 'important');
            }
          }

          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child instanceof HTMLElement) {
              fixNodeColors(child);
            }
          }
        };

        fixNodeColors(clonedElement);
      }
    },
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  // Add margin
  const margin = 5;
  const contentWidth = pdfWidth - margin * 2;
  const contentHeight = (imgProps.height * contentWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
  return pdf.output('blob');
}

export async function shareOrDownloadPDF(
  elementId: string, 
  fileName: string = 'Lista_de_Pedido.pdf'
): Promise<{ shared: boolean; downloaded: boolean }> {
  const pdfBlob = await generateOrderPDFBlob(elementId);
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  // 1. Try Native Web Share API (Direct sharing to WhatsApp on Mobile)
  if (
    navigator.canShare &&
    navigator.canShare({ files: [pdfFile] })
  ) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: 'Lista de Pedido',
        text: 'Segue a lista de pedido em PDF.',
      });
      return { shared: true, downloaded: false };
    } catch (shareErr) {
      // User cancelled share modal or sharing failed, fallback to download
      console.log('Compartilhamento cancelado ou não suportado, realizando download...', shareErr);
    }
  }

  // 2. Fallback: Download PDF file to device
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return { shared: false, downloaded: true };
}
