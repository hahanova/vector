import { interpolateColor, getContrastRatio } from "./utils";

describe("interpolateColor", () => {
  it("should return the interpolated color", () => {
    expect(interpolateColor(50)).toBe("rgb(116, 104, 148)");
    expect(interpolateColor(0)).toBe("rgb(51, 51, 51)");
    expect(interpolateColor(100)).toBe("rgb(180, 156, 245)");
  });
});

describe("getContrastRatio", () => {
  it("should return the correct contrast ratio", () => {
    const rgb1 = { r: 255, g: 255, b: 255 };
    const rgb2 = { r: 0, g: 0, b: 0 };
    expect(getContrastRatio(rgb1, rgb2)).toBe(21);
  });
});
