import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from '@/lib/preferences';
import gsap from 'gsap';
// Content is visible in CSS. Only off-screen elements are prepared for a one-time entrance.
export function useScrollReveal(
  root: RefObject<HTMLElement | null>,
  route: string,
) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const surface = root.current;
    if (!surface || reduced) return;
    const seen = new WeakSet<Element>();
    const context = gsap.context(() => {}, surface);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        visible.forEach((entry, index) => {
          observer.unobserve(entry.target);
          context.add(() =>
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.48,
              delay: Math.min(index * 0.055, 0.165),
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            }),
          );
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    );
    const register = (element: Element) => {
      if (seen.has(element) || element.parentElement?.closest('[data-reveal]'))
        return;
      seen.add(element);
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && rect.bottom > 88) return;
      context.add(() => gsap.set(element, { opacity: 0, y: 20 }));
      observer.observe(element);
    };
    const scan = (container: Element) => {
      if (container.matches('[data-reveal]')) register(container);
      container.querySelectorAll('[data-reveal]').forEach(register);
    };
    scan(surface);
    const changes = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        }),
      );
    });
    changes.observe(surface, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      changes.disconnect();
      context.revert();
    };
  }, [root, route, reduced]);
}
