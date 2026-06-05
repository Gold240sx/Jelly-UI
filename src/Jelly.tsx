import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx, jellyVars, type JellyStyleProps } from './shared';
import { mergeHandlers, useJellyInteractions } from './interactions';

export interface JellyProps
  extends JellyStyleProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /**
   * The icon — an `<svg viewBox="0 0 24 24">` element. Use `<JellyGlyph>` from
   * `@inova.dev/jelly-ui/icons`, or pass your own lucide-style SVG.
   */
  children?: ReactNode;
}

/**
 * An icon-only jelly button (the "chicklet"). Drive it with a single `color`;
 * everything else — the emissive core, subsurface shade, bloom, gloss and rim
 * light — is derived from it in CSS.
 *
 * Remember an `aria-label`, since the button has no visible text.
 */
export const Jelly = forwardRef<HTMLButtonElement, JellyProps>(function Jelly(props, ref) {
  const {
    color,
    color2,
    gradient,
    gradientAngle,
    size,
    radius,
    bloom,
    gloss,
    iconScale,
    holo,
    clear,
    neutral,
    active,
    interactive = true,
    className,
    style,
    children,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onAnimationEnd,
    ...rest
  } = props;

  const lib = useJellyInteractions(interactive);
  const handlers = mergeHandlers(lib, {
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onAnimationEnd,
  });

  return (
    <button
      ref={ref}
      className={cx(
        'jelly',
        holo && 'jelly--holo',
        clear && 'jelly--clear',
        neutral && 'jelly--neutral',
        active && 'is-active',
        className,
      )}
      style={{
        ...jellyVars({
          color,
          color2,
          gradient,
          gradientAngle,
          size,
          radius,
          bloom,
          gloss,
          iconScale,
          neutral,
        }),
        ...style,
      }}
      {...handlers}
      {...rest}
    >
      <span className="jelly__body" aria-hidden />
      <span className="jelly__core" aria-hidden />
      <span className="jelly__halo" aria-hidden />
      {children}
    </button>
  );
});
