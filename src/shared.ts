import type { CSSProperties } from 'react';
import { tintFor } from './tint';

/**
 * The material knobs shared by every jelly component. Each maps to a CSS custom
 * property on the button; the whole look derives from `color` (`--c`).
 */
export interface JellyStyleProps {
  /** Accent colour → `--c`. The single knob the entire material derives from. */
  color?: string;
  /** Second gradient stop → `--c2`. Providing it turns the gradient on. */
  color2?: string;
  /** Force the two-colour gradient on/off. Defaults to `true` when `color2` is set. */
  gradient?: boolean;
  /** Gradient angle in degrees → `--grad-angle` (default 120). */
  gradientAngle?: number;
  /** Button size → `--jelly-size`. A number is treated as pixels. */
  size?: number | string;
  /** Corner radius → `--jelly-radius` (chicklet only; e.g. `'30%'`). */
  radius?: number | string;
  /** Outer glow strength → `--jelly-bloom`. */
  bloom?: number;
  /** Surface gloss strength → `--jelly-gloss`. */
  gloss?: number;
  /** Icon scale (0–1) → `--jelly-icon-scale`. */
  iconScale?: number;
  /** Holographic iridescent-sheen variant (`.jelly--holo`). */
  holo?: boolean;
  /** Transparent liquid-glass variant (`.jelly--clear`). */
  clear?: boolean;
  /** Colourless white-glass variant (`.jelly--neutral`) — ignores `color`. */
  neutral?: boolean;
  /** Selected / active state — the pumped glow (`.is-active`). */
  active?: boolean;
  /** Enable cursor-light tracking + release bounce. Default `true`. */
  interactive?: boolean;
}

const len = (v?: number | string): string | undefined =>
  v == null ? undefined : typeof v === 'number' ? `${v}px` : v;

/** Build the inline custom-property style object from the material props. */
export function jellyVars(p: JellyStyleProps): CSSProperties {
  const v: Record<string, string | number> = {};
  if (p.color) v['--c'] = p.color;

  const grad = p.gradient ?? p.color2 != null;
  if (grad) {
    v['--grad'] = 1;
    if (p.color2) v['--c2'] = p.color2;
    if (p.gradientAngle != null) v['--grad-angle'] = `${p.gradientAngle}deg`;
  }

  const size = len(p.size);
  if (size) v['--jelly-size'] = size;
  const radius = len(p.radius);
  if (radius) v['--jelly-radius'] = radius;
  if (p.bloom != null) v['--jelly-bloom'] = p.bloom;
  if (p.gloss != null) v['--jelly-gloss'] = p.gloss;
  if (p.iconScale != null) v['--jelly-icon-scale'] = p.iconScale;

  // a colourless (neutral) button keeps the default neutral ink shadow
  if (!p.neutral && p.color) {
    const t = tintFor(p.color);
    if (t) v['--jelly-tint'] = t;
  }

  return v as CSSProperties;
}

/** Tiny classnames joiner. */
export const cx = (...a: Array<string | false | null | undefined>): string =>
  a.filter(Boolean).join(' ');
