/**
 * Colour helpers — derive the temperature-matched shadow ink the jelly material
 * uses for its internal subsurface shade (the `--jelly-tint` custom property).
 */

/** Hue (0–360) of a hex or `hsl()` colour, or `null` if achromatic / unparseable. */
export function hueOf(color: string): number | null {
  const c = String(color).trim();
  let r: number;
  let g: number;
  let b: number;
  let m = c.match(/^#([0-9a-f]{3})$/i);
  if (m) {
    r = parseInt(m[1][0] + m[1][0], 16);
    g = parseInt(m[1][1] + m[1][1], 16);
    b = parseInt(m[1][2] + m[1][2], 16);
  } else if ((m = c.match(/^#([0-9a-f]{6})$/i))) {
    r = parseInt(m[1].slice(0, 2), 16);
    g = parseInt(m[1].slice(2, 4), 16);
    b = parseInt(m[1].slice(4, 6), 16);
  } else if ((m = c.match(/hsla?\(\s*([\d.]+)/i))) {
    return parseFloat(m[1]) % 360;
  } else {
    return null;
  }
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  if (d === 0) return null;
  let h: number;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

/**
 * A dark shadow-ink tinted to the colour's temperature — amber for warm hues
 * (reds/oranges/yellows/magenta), blue for cool hues (greens/cyans/blues/
 * purples). Returns `null` for greys so they keep the neutral ink. Maps to the
 * `--jelly-tint` custom property.
 */
export function tintFor(color: string): string | null {
  const h = hueOf(color);
  if (h == null) return null;
  const warm = h < 75 || h >= 300;
  return warm ? '#2c2102' : '#021a30';
}
