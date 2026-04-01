export type PatternType =
  | 'grid'
  | 'dots'
  | 'lines'
  | 'waves'
  | 'hexagons'
  | 'triangles'
  | 'checkerboard'
  | 'stripes'
  | 'circles'
  | 'boxes';

export interface PatternConfig {
  type: PatternType;
  opacity: number;
  scale: number;
  color: string;
  rotation?: number;
}

export const PATTERN_DEFINITIONS: Record<PatternType, string> = {
  grid: `
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"/>
    </pattern>
  `,
  dots: `
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="2" fill="currentColor"/>
    </pattern>
  `,
  lines: `
    <pattern id="lines" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="1"/>
    </pattern>
  `,
  waves: `
    <pattern id="waves" width="40" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="currentColor" stroke-width="1"/>
    </pattern>
  `,
  hexagons: `
    <pattern id="hexagons" width="28" height="49" patternUnits="userSpaceOnUse">
      <path d="M14 0 L28 8.5 L28 24.5 L14 33 L0 24.5 L0 8.5 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    </pattern>
  `,
  triangles: `
    <pattern id="triangles" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M15 0 L30 30 L0 30 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    </pattern>
  `,
  checkerboard: `
    <pattern id="checkerboard" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="10" height="10" fill="currentColor"/>
      <rect x="10" y="10" width="10" height="10" fill="currentColor"/>
    </pattern>
  `,
  stripes: `
    <pattern id="stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
      <rect x="0" y="0" width="5" height="10" fill="currentColor"/>
    </pattern>
  `,
  circles: `
    <pattern id="circles" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" stroke-width="1"/>
    </pattern>
  `,
  boxes: `
    <pattern id="boxes" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect x="5" y="5" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1" rx="5"/>
    </pattern>
  `,
};

export const generatePatternSVG = (config: PatternConfig): string => {
  const { type, opacity, color } = config;
  const patternDef = PATTERN_DEFINITIONS[type].replace(/currentColor/g, color);

  return `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" pointer-events="none">
      <defs>
        ${patternDef}
      </defs>
      <rect width="100%" height="100%" fill="url(#${type})" 
            fill-opacity="${opacity}" />
    </svg>
  `;
};
