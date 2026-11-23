'use client';

import { useRef } from 'react';
import { FINE_POINTER, gsap, useGSAP } from '@/lib/gsap';

// Kursor kustom untuk mouse/trackpad. Elemen dengan atribut data-cursor="Teks" menampilkan label.
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!window.matchMedia(FINE_POINTER).matches) return;
    const r = ring.current!;
    const d = dot.current!;

    gsap.set([r, d], { xPercent: -50, yPercent: -50 });
    gsap.set(r, { scale: 0.3 });
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3' });
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' });

    let shown = false;
    let last = { x: -1, y: -1 };
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([r, d], { x: e.clientX, y: e.clientY });
        gsap.to([r, d], { autoAlpha: 1, duration: 0.3 });
      }
      last = { x: e.clientX, y: e.clientY };
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };

    const update = (el: Element | null) => {
      const target = el?.closest<HTMLElement>('[data-cursor], a, button');
      const text = target?.dataset.cursor ?? '';
      if (label.current) label.current.textContent = text;
      gsap.to(r, {
        scale: text ? 1 : target ? 0.55 : 0.3,
        backgroundColor: text ? 'rgb(255 79 154 / 1)' : 'rgb(255 241 246 / 0)',
        borderColor: text ? 'rgb(255 79 154 / 1)' : 'rgb(255 241 246 / 0.5)',
        duration: 0.4,
        ease: 'power3',
      });
      gsap.to(label.current, { autoAlpha: text ? 1 : 0, duration: 0.2 });
      gsap.to(d, { autoAlpha: target ? 0 : 1, duration: 0.2 });
    };
    const over = (e: PointerEvent) => update(e.target as Element);
    // Saat halaman bergulir di bawah kursor yang diam, periksa ulang elemen di bawahnya.
    const scroll = () => last.x >= 0 && update(document.elementFromPoint(last.x, last.y));

    const leave = () => {
      shown = false;
      last = { x: -1, y: -1 };
      gsap.to([r, d], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    window.addEventListener('scroll', scroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('scroll', scroll);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden [@media(pointer:fine)]:block">
      <div
        ref={ring}
        className="invisible absolute left-0 top-0 flex h-24 w-24 items-center justify-center rounded-full border border-ink/50 opacity-0"
      >
        <span ref={label} className="text-sm font-semibold text-accent-ink opacity-0" />
      </div>
      <div ref={dot} className="invisible absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-ink opacity-0" />
    </div>
  );
}
