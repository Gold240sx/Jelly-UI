import { useRef } from 'react';
import type { PointerEvent as RPointerEvent, AnimationEvent as RAnimationEvent } from 'react';

type P = RPointerEvent<HTMLButtonElement>;
type A = RAnimationEvent<HTMLButtonElement>;

/** The pointer/animation handlers the jelly material wants on its button. */
export interface JellyHandlers {
  onPointerMove?: (e: P) => void;
  onPointerLeave?: (e: P) => void;
  onPointerDown?: (e: P) => void;
  onPointerUp?: (e: P) => void;
  onPointerCancel?: (e: P) => void;
  onAnimationEnd?: (e: A) => void;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The gel's two micro-interactions, as spreadable React handlers:
 *  - a wet specular highlight that tracks the cursor (`--mx` / `--my`)
 *  - a springy secondary bounce on release (the `.jelly--bounce` keyframes)
 *
 * Returns an empty object when disabled, so it is always safe to spread.
 */
export function useJellyInteractions(enabled = true): JellyHandlers {
  const pressed = useRef(false);
  if (!enabled) return {};

  return {
    onPointerMove(e) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    },
    onPointerLeave(e) {
      e.currentTarget.style.removeProperty('--mx');
      e.currentTarget.style.removeProperty('--my');
    },
    onPointerDown() {
      pressed.current = true;
    },
    onPointerCancel() {
      pressed.current = false;
    },
    onPointerUp(e) {
      // bounce only on release of a press that began on this same button
      if (!pressed.current) return;
      pressed.current = false;
      if (prefersReducedMotion()) return;
      const el = e.currentTarget;
      el.classList.remove('jelly--bounce');
      void el.offsetWidth; // force reflow so the animation can replay
      el.classList.add('jelly--bounce');
    },
    onAnimationEnd(e) {
      if (e.animationName === 'jelly-bounce') {
        e.currentTarget.classList.remove('jelly--bounce');
      }
    },
  };
}

const compose = <E,>(a?: (e: E) => void, b?: (e: E) => void): ((e: E) => void) | undefined =>
  a || b
    ? (e: E) => {
        a?.(e);
        b?.(e);
      }
    : undefined;

/** Merge the library's interaction handlers with any the consumer also passed. */
export function mergeHandlers(lib: JellyHandlers, user: JellyHandlers): JellyHandlers {
  return {
    onPointerMove: compose(lib.onPointerMove, user.onPointerMove),
    onPointerLeave: compose(lib.onPointerLeave, user.onPointerLeave),
    onPointerDown: compose(lib.onPointerDown, user.onPointerDown),
    onPointerUp: compose(lib.onPointerUp, user.onPointerUp),
    onPointerCancel: compose(lib.onPointerCancel, user.onPointerCancel),
    onAnimationEnd: compose(lib.onAnimationEnd, user.onAnimationEnd),
  };
}
