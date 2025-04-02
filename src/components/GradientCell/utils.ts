export const interpolateColor = (value: number) => {
  const startColor = { r: 51, g: 51, b: 51 }; // #333333
  const endColor = { r: 180, g: 156, b: 245 }; // #b49cf5

  const interpolate = (start: number, end: number, factor: number) => {
    return Math.round(start + (end - start) * factor);
  };

  const factor = value / 100; // Assuming value ranges from 0 to 100
  const r = interpolate(startColor.r, endColor.r, factor);
  const g = interpolate(startColor.g, endColor.g, factor);
  const b = interpolate(startColor.b, endColor.b, factor);

  return `rgb(${r}, ${g}, ${b})`;
};

const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastRatio = (
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
) => {
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);

  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
};
