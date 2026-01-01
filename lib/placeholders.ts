/**
 * Medicine Placeholder Images
 *
 * Generates SVG data URIs for medicine placeholder images.
 * No external dependencies - works offline and has zero latency.
 */

interface PlaceholderConfig {
  width: number;
  height: number;
  bgColor: string;
  textColor: string;
  text: string;
  icon?: string;
}

function generateSVGDataURI(config: PlaceholderConfig): string {
  const { width, height, bgColor, textColor, text, icon } = config;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      ${icon ? `
        <text x="50%" y="35%" text-anchor="middle" font-size="60" fill="#${textColor}" opacity="0.3">${icon}</text>
      ` : ''}
      <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#${textColor}">
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString('base64')}`;
}

// Medicine category placeholders
export const medicinePlaceholders = {
  'Pain Relief': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: 'E74C3C',
    textColor: 'ffffff',
    text: 'Pain Relief',
    icon: '💊'
  }),

  'Allergy': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '3498DB',
    textColor: 'ffffff',
    text: 'Allergy Relief',
    icon: '🤧'
  }),

  'Vitamins & Supplements': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: 'F39C12',
    textColor: 'ffffff',
    text: 'Vitamins',
    icon: '💊'
  }),

  'Cold & Flu': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '9B59B6',
    textColor: 'ffffff',
    text: 'Cold & Flu',
    icon: '🤒'
  }),

  'Digestive Health': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '1ABC9C',
    textColor: 'ffffff',
    text: 'Digestive Health',
    icon: '💊'
  }),

  'default': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '95A5A6',
    textColor: 'ffffff',
    text: 'Medicine',
    icon: '💊'
  })
};

// Function to get placeholder by category
export function getMedicinePlaceholder(category: string): string {
  return medicinePlaceholders[category as keyof typeof medicinePlaceholders] || medicinePlaceholders.default;
}

// Specific medicine placeholders
export const specificPlaceholders = {
  'ibuprofen': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: 'E74C3C',
    textColor: 'ffffff',
    text: 'Ibuprofen 200mg',
    icon: '💊'
  }),

  'cetirizine': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '3498DB',
    textColor: 'ffffff',
    text: 'Cetirizine 10mg',
    icon: '💊'
  }),

  'vitamin-d3': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: 'F39C12',
    textColor: 'ffffff',
    text: 'Vitamin D3',
    icon: '☀️'
  }),

  'cold-flu': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '9B59B6',
    textColor: 'ffffff',
    text: 'Cold & Flu Relief',
    icon: '🤧'
  }),

  'antacid': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '1ABC9C',
    textColor: 'ffffff',
    text: 'Antacid Tablets',
    icon: '💊'
  }),

  'paracetamol': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: 'E74C3C',
    textColor: 'ffffff',
    text: 'Paracetamol 500mg',
    icon: '💊'
  }),

  'omega-3': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: 'F39C12',
    textColor: 'ffffff',
    text: 'Omega-3 Fish Oil',
    icon: '🐟'
  }),

  'cough-syrup': generateSVGDataURI({
    width: 400,
    height: 300,
    bgColor: '9B59B6',
    textColor: 'ffffff',
    text: 'Cough Syrup',
    icon: '🍯'
  })
};
