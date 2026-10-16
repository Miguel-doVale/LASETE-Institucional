/* THESIS: a marca é o único elemento da abertura; o conteúdo começa depois.
OWN-WORLD: preto neutro, caracteres brancos, espaço e tipografia de proporção normal.
STORY: explorar o símbolo, depois conhecer as pessoas e o trabalho da liga.
FIRST VIEWPORT: navbar e um volume cúbico ASCII central, sem textos sobrepostos, com Matrix discreta ao fundo.
FORM: composição explicitamente pedida na revisão; sem sorteio de direção. */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/preferences';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Emblem } from './Brand';
import type { PointerState } from './HeroScene';
const HeroScene = lazy(() => import('./HeroScene'));
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const pointer = useRef<PointerState>({
    x: 0,
    y: 0,
    hover: 0,
    rx: 0.34,
    ry: Math.PI / 4,
  });
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(
    null,
  );
  const [visible, setVisible] = useState(true);
  const [dragging, setDragging] = useState(false);
  const reduced = !!useReducedMotion();
  useEffect(() => {
    if (!root.current) return;
    let inView = true;
    const update = () => setVisible(inView && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    io.observe(root.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  useGSAP(
    () => {
      if (reduced) return;
      gsap.to('.hero-object', {
        y: -56,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.15,
        },
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );
  const release = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    pointer.current.hover = 0;
    pointer.current.invalidate?.();
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <section
      ref={root}
      className="hero"
      aria-label="LASETE em ASCII"
      data-matrix="hero"
    >
      <div
        className={`hero-object ${dragging ? 'is-dragging' : ''}`}
        tabIndex={0}
        role="group"
        aria-label="Símbolo 3D interativo da LASETE"
        aria-describedby="symbol-instructions"
        onKeyDown={(event) => {
          if (
            ![
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              'Home',
            ].includes(event.key)
          )
            return;
          event.preventDefault();
          if (event.key === 'Home') {
            pointer.current.rx = 0.34;
            pointer.current.ry = Math.PI / 4;
          }
          if (event.key === 'ArrowLeft') pointer.current.ry -= 0.16;
          if (event.key === 'ArrowRight') pointer.current.ry += 0.16;
          if (event.key === 'ArrowUp') pointer.current.rx -= 0.16;
          if (event.key === 'ArrowDown') pointer.current.rx += 0.16;
          pointer.current.invalidate?.();
        }}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          pointer.current.x =
            ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          pointer.current.y =
            -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
          pointer.current.hover =
            event.pointerType === 'touch' || reduced ? 0 : 1;
          pointer.current.invalidate?.();
          if (drag.current) {
            pointer.current.ry =
              drag.current.ry + (event.clientX - drag.current.x) * 0.007;
            pointer.current.rx = Math.max(
              -1.1,
              Math.min(
                1.1,
                drag.current.rx + (event.clientY - drag.current.y) * 0.005,
              ),
            );
            pointer.current.invalidate?.();
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || event.pointerType === 'touch') return;
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            rx: pointer.current.rx,
            ry: pointer.current.ry,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={() => {
          pointer.current.hover = 0;
          pointer.current.invalidate?.();
        }}
      >
        <Suspense
          fallback={
            <div className="scene-fallback">
              <Emblem />
            </div>
          }
        >
          <HeroScene pointer={pointer} visible={visible} reduced={reduced} />
        </Suspense>
      </div>
      <a className="hero-scroll" href="#conheca">
        <span className="scroll-mark" aria-hidden="true">
          <span />
        </span>
        <span>Explore a LASETE</span>
      </a>
      <p id="symbol-instructions" className="sr-only">
        Passe o mouse para dispersar os caracteres e arraste para girar. Com o
        teclado, use as setas para girar e Home para restaurar. No celular,
        deslize normalmente para conhecer a liga.
      </p>
    </section>
  );
}
