'use client';

import { useEffect, useRef, useState } from 'react';
import { FINE_POINTER, gsap, useGSAP } from '@/lib/gsap';

// Elemen yang sedikit "tertarik" ke arah kursor.
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !window.matchMedia(FINE_POINTER).matches) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-block will-change-transform">
      {children}
    </span>
  );
}

// Teks yang "menggulung" ke atas saat elemen induk (.group) disorot.
export function RollText({ children }: { children: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full">{children}</span>
      <span
        aria-hidden
        className="absolute left-0 top-full transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{children}</p>;
}

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState('--.--');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return <time className="tabular-nums">{time} WIB</time>;
}
