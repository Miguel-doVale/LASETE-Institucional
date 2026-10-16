import { useEffect } from 'react';
import { useReducedMotion } from './preferences';

// One delegated listener per surface, no React updates during pointer movement.
export function usePointerHighlight(scope: string) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (
      reduced ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return;
    let frame = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      if (!target?.isConnected) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--pointer-x', `${x - rect.left}px`);
      target.style.setProperty('--pointer-y', `${y - rect.top}px`);
    };
    const move = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest<HTMLElement>('button, a');
      if (!control || !control.closest(scope) || control.matches(':disabled'))
        return;
      target = control;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    document.addEventListener('pointermove', move, { passive: true });
    return () => {
      document.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
    };
  }, [scope, reduced]);
}
