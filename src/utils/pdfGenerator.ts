import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomerDetails, OrderListItem } from '../types';
import { formatQuantityStr } from './whatsapp';

/**
 * Pure JavaScript OKLCH color parser and converter to RGB/Hex.
 * Guarantees html2canvas never crashes with "Attempting to parse an unsupported color function oklch".
 */
export function oklchToRgb(oklchStr: string): string {
  if (!oklchStr || typeof oklchStr !== 'string') return '#000000';
  
  const match = oklchStr.match(/oklch\(\s*([\d.%]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/i);
  if (!match) return '#000000';

  let l = parseFloat(match[1]);
  if (match[1].endsWith('%')) l = l / 100;
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  let alpha = 1;
  if (match[4]) {
    alpha = parseFloat(match[4]);
    if (match[4].endsWith('%')) alpha = alpha / 100;
  }

  // Convert OKLCH -> OKLAB
  const hRad = (h * Math.PI) / 180;
  const aVal = c * Math.cos(hRad);
  const bVal = c * Math.sin(hRad);

  // Convert OKLAB -> Linear LMS
  const l_ = l + 0.3963377774 * aVal + 0.2158037573 * bVal;
  const m_ = l - 0.1055613458 * aVal - 0.0638541728 * bVal;
  const s_ = l - 0.0894841775 * aVal - 1.2914855480 * bVal;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  // Convert LMS -> Linear RGB
  const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Linear RGB -> sRGB
  const transfer = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

  const r = Math.min(255, Math.max(0, Math.round(transfer(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(transfer(gLin) * 255)));
  const b = Math.min(255, Math.max(0, Math.round(transfer(bLin) * 255)));

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

export function cleanCssText(cssText: string): string {
  if (!cssText) return '';
  return cssText
    .replace(/oklch\([^)]+\)/gi, (m) => oklchToRgb(m))
    .replace(/lab\([^)]+\)/gi, '#000000');
}

/**
 * Direct vector-based PDF generator as a guaranteed fail-safe backup.
 */
export function createFallbackPDFBlob(
  customerDetails: CustomerDetails,
  items: OrderListItem[],
  companyName: string
): Blob {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42); // slate-900
  pdf.text('LISTA DE PEDIDO DE PRODUTOS', 14, 16);

  // Divider
  pdf.setDrawColor(15, 23, 42);
  pdf.setLineWidth(0.6);
  pdf.line(14, 20, 196, 20);

  // Customer & Order Information
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);

  let currentY = 25;
  if (customerDetails.name && customerDetails.name.trim() !== '' && customerDetails.name !== 'Não informado') {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Cliente: ${customerDetails.name.trim()}`, 14, currentY);
    currentY += 5;
  }
  if (customerDetails.phone && customerDetails.phone.trim() !== '' && customerDetails.phone !== 'Não informado') {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Telefone: ${customerDetails.phone.trim()}`, 14, currentY);
    currentY += 5;
  }
  if (customerDetails.address && customerDetails.address.trim() !== '') {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Tipo: Entrega em Domicílio`, 14, currentY);
    currentY += 5;
    pdf.text(`Endereço: ${customerDetails.address.trim()}`, 14, currentY);
    currentY += 5;
  }
  if (customerDetails.deliveryDate && customerDetails.deliveryDate.trim() !== '') {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Data/Horário: ${customerDetails.deliveryDate.trim()}`, 14, currentY);
    currentY += 5;
  }

  currentY += 3;

  // Items Table Header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(14, currentY, 182, 7, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('Código', 16, currentY + 4.8);
  pdf.text('Item / Produto', 55, currentY + 4.8);
  pdf.text('Quantidade', 130, currentY + 4.8);
  pdf.text('Observações', 165, currentY + 4.8);

  currentY += 7;
  pdf.setTextColor(15, 23, 42);

  items.forEach((item, index) => {
    if (currentY > 270) {
      pdf.addPage();
      currentY = 15;
    }

    if (index % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(14, currentY, 182, 6.5, 'F');
    }

    pdf.setFont('courier', 'bold');
    pdf.text(item.barcode || '-', 16, currentY + 4.5);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}. ${item.name}`, 55, currentY + 4.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(formatQuantityStr(item.quantity, item.unit), 130, currentY + 4.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.note || '-', 165, currentY + 4.5);

    pdf.setDrawColor(226, 232, 240);
    pdf.line(14, currentY + 6.5, 196, currentY + 6.5);
    currentY += 6.5;
  });

  return pdf.output('blob');
}

export async function generateOrderPDFBlob(
  elementId: string,
  customerDetails?: CustomerDetails,
  items?: OrderListItem[],
  companyName: string = ''
): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) {
    if (customerDetails && items) {
      return createFallbackPDFBlob(customerDetails, items, companyName);
    }
    throw new Error('Elemento para PDF não encontrado');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc, clonedElement) => {
        // 1. Process all style tags in clonedDoc and replace oklch/lab
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((styleTag) => {
          if (styleTag.textContent) {
            styleTag.textContent = cleanCssText(styleTag.textContent);
          }
        });

        // 2. Process all external link stylesheets
        const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
        linkTags.forEach((link) => {
          try {
            const sheet = (link as HTMLLinkElement).sheet;
            if (sheet && sheet.cssRules) {
              let cssText = '';
              for (let i = 0; i < sheet.cssRules.length; i++) {
                cssText += sheet.cssRules[i].cssText + '\n';
              }
              const cleanText = cleanCssText(cssText);
              const newStyle = clonedDoc.createElement('style');
              newStyle.textContent = cleanText;
              clonedDoc.head.appendChild(newStyle);
            }
          } catch {
            // cross-origin stylesheet reading error ignored
          }
        });

        // 3. Traversal on clonedElement nodes to replace any computed oklch/lab inline
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
            try {
              const computed = windowRef.getComputedStyle(node);
              for (const prop of colorProps) {
                const val = computed.getPropertyValue(prop);
                if (val && (val.includes('oklch') || val.includes('lab') || val.includes('color('))) {
                  const rgbVal = cleanCssText(val);
                  node.style.setProperty(prop, rgbVal, 'important');
                }
              }
            } catch {
              // ignore node computed style read error
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
    const margin = 5;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (imgProps.height * contentWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
    return pdf.output('blob');
  } catch (canvasErr) {
    console.warn('html2canvas render failed, using fallback vector PDF generator:', canvasErr);
    if (customerDetails && items) {
      return createFallbackPDFBlob(customerDetails, items, companyName);
    }
    throw canvasErr;
  }
}

export async function shareOrDownloadPDF(
  elementId: string,
  customerDetails: CustomerDetails,
  items: OrderListItem[],
  companyName: string = '',
  fileName: string = 'Lista_de_Pedido.pdf'
): Promise<{ shared: boolean; downloaded: boolean }> {
  const pdfBlob = await generateOrderPDFBlob(elementId, customerDetails, items, companyName);
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
