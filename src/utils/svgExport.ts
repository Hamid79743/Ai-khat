import { CalligraphyCustomization } from '../types/calligraphy';
import { CALLIGRAPHY_STYLES } from './calligraphyPresets';

export function generateCalligraphySVG(config: CalligraphyCustomization): string {
  const width = 1000;
  const height = 1000;
  const pad = 60;
  const innerPad = pad + 20;

  // Font family resolution
  let fontFamily = "'Amiri', serif";
  if (config.style === 'thuluth') fontFamily = "'Amiri', serif";
  else if (config.style === 'naskh') fontFamily = "'Amiri', 'Noto Naskh Arabic', serif";
  else if (config.style === 'diwani') fontFamily = "'Marhey', 'Amiri', cursive";
  else if (config.style === 'ruqaa') fontFamily = "'Aref Ruqaa', serif";
  else if (config.style === 'kufic') fontFamily = "'Reem Kufi', sans-serif";
  else if (config.style === 'nastaliq') fontFamily = "'Noto Nastaliq Urdu', 'Gulzar', serif";

  const calcFontSize = Math.round(config.fontSize * 1.5);
  const strokeWidth = (config.strokeThickness * 1.5) / 2;

  // Background defs & fills
  let bgElement = '';
  if (config.background === 'emerald') {
    bgElement = `<rect width="${width}" height="${height}" fill="url(#emeraldGrad)" />`;
  } else if (config.background === 'parchment') {
    bgElement = `<rect width="${width}" height="${height}" fill="url(#parchmentGrad)" />`;
  } else if (config.background === 'obsidian') {
    bgElement = `<rect width="${width}" height="${height}" fill="url(#obsidianGrad)" />`;
  } else if (config.background === 'lapis') {
    bgElement = `<rect width="${width}" height="${height}" fill="url(#lapisGrad)" />`;
  }

  // Border elements
  let borderElement = '';
  const goldColor = config.background === 'parchment' && config.inkColor === 'lampblack' ? '#8f6e1b' : 'url(#goldGrad)';

  if (config.border === 'arabesque' || config.border === 'double-gold') {
    borderElement = `
      <!-- Double Gold Borders -->
      <rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="${goldColor}" stroke-width="2.5" />
      <rect x="${innerPad}" y="${innerPad}" width="${width - innerPad * 2}" height="${height - innerPad * 2}" fill="none" stroke="${goldColor}" stroke-width="5" />
      
      <!-- Corner Rosettes -->
      <g fill="${config.background === 'transparent' ? 'none' : '#072418'}" stroke="${goldColor}" stroke-width="2">
        <circle cx="${innerPad}" cy="${innerPad}" r="22" />
        <circle cx="${width - innerPad}" cy="${innerPad}" r="22" />
        <circle cx="${innerPad}" cy="${height - innerPad}" r="22" />
        <circle cx="${width - innerPad}" cy="${height - innerPad}" r="22" />
        
        <circle cx="${innerPad}" cy="${innerPad}" r="6" fill="#f7e089" stroke="none" />
        <circle cx="${width - innerPad}" cy="${innerPad}" r="6" fill="#f7e089" stroke="none" />
        <circle cx="${innerPad}" cy="${height - innerPad}" r="6" fill="#f7e089" stroke="none" />
        <circle cx="${width - innerPad}" cy="${height - innerPad}" r="6" fill="#f7e089" stroke="none" />
      </g>
    `;
  } else if (config.border === 'arch') {
    const archTopY = pad + 70;
    borderElement = `
      <!-- Mihrab Islamic Arch -->
      <path d="M ${pad} ${height - pad} L ${pad} ${archTopY} C ${pad} ${pad}, ${width / 2 - 70} ${pad - 20}, ${width / 2} ${pad} C ${width / 2 + 70} ${pad - 20}, ${width - pad} ${pad}, ${width - pad} ${archTopY} L ${width - pad} ${height - pad} Z" fill="none" stroke="${goldColor}" stroke-width="4" />
    `;
  } else if (config.border === 'girih') {
    borderElement = `
      <rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="${goldColor}" stroke-width="3" stroke-dasharray="14,10" />
      <rect x="${innerPad}" y="${innerPad}" width="${width - innerPad * 2}" height="${height - innerPad * 2}" fill="none" stroke="${goldColor}" stroke-width="1.5" />
    `;
  } else if (config.border === 'subtle') {
    borderElement = `
      <rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="${goldColor}" stroke-width="2" />
    `;
  }

  // Ink color resolution
  let textFill = 'url(#goldGrad)';
  if (config.inkColor === 'white') textFill = '#ffffff';
  else if (config.inkColor === 'lampblack') textFill = '#111827';
  else if (config.inkColor === 'rosegold') textFill = 'url(#roseGoldGrad)';
  else if (config.inkColor === 'emerald') textFill = 'url(#emeraldInkGrad)';

  // Tashkeel filtering
  let cleanText = config.text;
  if (!config.showTashkeel) {
    cleanText = cleanText.replace(/[\u064B-\u065F\u0670]/g, '');
  }

  const lines = cleanText.split('\n');
  const lineSpacing = calcFontSize * (config.lineHeight || 1.6);
  const startY = 500 - ((lines.length - 1) * lineSpacing) / 2;

  let textTspans = '';
  lines.forEach((line, index) => {
    const y = startY + index * lineSpacing;
    textTspans += `<tspan x="500" y="${y}">${escapeXml(line)}</tspan>\n`;
  });

  // Proportion grid (Nuqāt)
  let gridElement = '';
  if (config.showProportionGrid) {
    const dotSize = 18;
    const centerY = 500;
    const alifDots = config.style === 'thuluth' ? 7 : config.style === 'naskh' ? 5 : 4;
    const startX = width - innerPad - 60;
    let dots = '';
    for (let i = 0; i < alifDots; i++) {
      const dotY = centerY - (i * dotSize * 1.4);
      dots += `<polygon points="${startX},${dotY - dotSize / 2} ${startX + dotSize / 2},${dotY} ${startX},${dotY + dotSize / 2} ${startX - dotSize / 2},${dotY}" fill="rgba(212,175,55,0.3)" stroke="#d4af37" stroke-width="1" />`;
    }

    gridElement = `
      <line x1="${innerPad + 30}" y1="${centerY}" x2="${width - innerPad - 30}" y2="${centerY}" stroke="rgba(212,175,55,0.4)" stroke-width="1.5" />
      ${dots}
    `;
  }

  // Tughra Medallion
  let tughraElement = '';
  if (config.layout === 'tughra') {
    tughraElement = `
      <circle cx="500" cy="500" r="380" fill="none" stroke="${goldColor}" stroke-width="2.5" />
      <circle cx="500" cy="500" r="365" fill="none" stroke="${goldColor}" stroke-width="1.5" stroke-dasharray="8,6" />
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,700;1,700&amp;family=Aref+Ruqaa:wght@700&amp;family=Cinzel:wght@700&amp;family=Marhey:wght@700&amp;family=Noto+Nastaliq+Urdu:wght@700&amp;family=Reem+Kufi:wght@700&amp;display=swap');
      .calligraphy-text {
        font-family: ${fontFamily};
        font-size: ${calcFontSize}px;
        font-weight: bold;
        text-anchor: middle;
        dominant-baseline: central;
        direction: rtl;
        letter-spacing: ${config.letterSpacing}px;
      }
      .signature-text {
        font-family: 'Cinzel', serif;
        font-size: 14px;
        letter-spacing: 4px;
        fill: #d4af37;
        opacity: 0.7;
        text-anchor: middle;
      }
    </style>

    <!-- Gradients -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#fde68a" />
      <stop offset="50%" stop-color="#d4af37" />
      <stop offset="85%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe4e6" />
      <stop offset="50%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#9f1239" />
    </linearGradient>

    <linearGradient id="emeraldInkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a7f3d0" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>

    <radialGradient id="emeraldGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#093625" />
      <stop offset="60%" stop-color="#041c13" />
      <stop offset="100%" stop-color="#020e09" />
    </radialGradient>

    <radialGradient id="parchmentGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#f9f3e3" />
      <stop offset="70%" stop-color="#e9dcbe" />
      <stop offset="100%" stop-color="#d5c49f" />
    </radialGradient>

    <radialGradient id="obsidianGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#18181c" />
      <stop offset="100%" stop-color="#060608" />
    </radialGradient>

    <radialGradient id="lapisGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0a2540" />
      <stop offset="70%" stop-color="#051627" />
      <stop offset="100%" stop-color="#020b14" />
    </radialGradient>
  </defs>

  <!-- Canvas Surface -->
  ${bgElement}

  <!-- Borders & Tezhib -->
  ${borderElement}

  <!-- Tughra Medallion -->
  ${tughraElement}

  <!-- Proportion Grid -->
  ${gridElement}

  <!-- Calligraphy Text -->
  <g transform="rotate(${config.slantAngle} 500 500)">
    <text 
      class="calligraphy-text" 
      fill="${textFill}" 
      ${config.strokeThickness > 1.5 ? `stroke="${textFill}" stroke-width="${strokeWidth}" stroke-linejoin="round"` : ''}
    >
      ${textTspans}
    </text>
  </g>

  <!-- Watermark Signature -->
  <text x="500" y="${height - pad + 30}" class="signature-text">KHATAT AI  •  خطاط الذكاء الاصطناعي</text>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
