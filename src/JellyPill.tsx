import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx, jellyVars, type JellyStyleProps } from './shared';
import { mergeHandlers, useJellyInteractions } from './interactions';

export interface JellyPillProps
  extends JellyStyleProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Fully rounded (`pill`) or a rounded rectangle (`rect`). Default `pill`. */
  shape?: 'pill' | 'rect';
  /** The leading icon — an `<svg>` element (e.g. `<JellyGlyph>`). */
  icon?: ReactNode;
  /** The label content. */
  children?: ReactNode;
}

/**
 * A labelled jelly button: icon on the left, text on the right, in the same gel
 * material. `shape="pill"` is fully rounded; `shape="rect"` is a rounded
 * rectangle. (The `radius` prop is chicklet-only and ignored here.)
 */
export const JellyPill = forwardRef<HTMLButtonElement, JellyPillProps>(function JellyPill(
  props,
  ref,
) {
  const {
    shape = 'pill',
    icon,
    children,
    color,
    color2,
    gradient,
    gradientAngle,
    size,
    radius: _radius,
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
        `jelly--${shape}`,
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
      <span className="jelly__label">
        {icon}
        <span>{children}</span>
      </span>
    </button>
  );
});
