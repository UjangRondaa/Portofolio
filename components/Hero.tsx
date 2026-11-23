'use client';

import { useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { FINE_POINTER, MOTION_OK, gsap, onIntro, useGSAP } from '@/lib/gsap';
import { profile } from '@/lib/content';
import { Magnetic, RollText } from './ui';

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Judul tampil langsung; hanya teks & tombol di sekitarnya yang muncul pelan.
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
        tl.from('.hero-fade', { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.09 }, 0.2);
        const off = onIntro(() => tl.play());

        // Nama bergerak lebih lambat dari halaman saat digulir (parallax).
        const scroll = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero-title', { yPercent: -20, ease: 'none', scrollTrigger: scroll });
        gsap.to('.hero-bottom', { autoAlpha: 0, y: -60, ease: 'none', scrollTrigger: { ...scroll, end: '60% top' } });

        return () => off();
      });

      mm.add(FINE_POINTER, () => {
        const glow = root.current!.querySelector('.hero-glow')!;
        const xTo = gsap.quickTo(glow, 'x', { duration: 1.6, ease: 'power3' });
        const yTo = gsap.quickTo(glow, 'y', { duration: 1.6, ease: 'power3' });
        const move = (e: PointerEvent) => {
          const r = root.current!.getBoundingClientRect();
          xTo(e.clientX - r.width / 2);
          yTo(e.clientY - r.height / 2);
        };
        root.current!.addEventListener('pointermove', move);
        return () => root.current?.removeEventListener('pointermove', move);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-8 pt-40 sm:px-8 sm:pt-56 lg:px-12 lg:pt-64">
      <div aria-hidden className="bg-ruled pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="hero-glow h-[36rem] w-[36rem] rounded-full bg-sunset opacity-20 blur-[130px]" />
      </div>

      <div className="hero-title relative mb-12 sm:mb-16">
        <h1
          aria-label={`${profile.name}, ${profile.role}`}
          className="font-display text-[clamp(3rem,9vw,10rem)] font-semibold leading-[0.9] tracking-[-0.04em]"
        >
          {profile.roleLines.map((line, i) => (
            <span key={line} aria-hidden className="line-mask">
              <span className={`hero-word block ${i === 1 ? 'font-light italic' : ''}`}>
                {i === 1 ? <span className="text-sunset">{line}</span> : line}
              </span>
            </span>
          ))}
        </h1>
      </div>

      <div className="hero-bottom relative grid gap-8 border-t border-line pt-6 md:grid-cols-12 md:items-end">
        <p className="hero-fade max-w-md text-base leading-relaxed text-muted md:col-span-5 sm:text-lg">
          {profile.intro}
        </p>

        <div className="hero-fade flex flex-wrap gap-3 md:col-span-3 md:col-start-10 md:justify-end">
          <Magnetic>
            <a href="/proyek" className="btn-accent group">
              <RollText>Lihat proyek</RollText>
              <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="/kontak" className="btn-ghost group md:hidden">
              Hubungi <ArrowUpRight className="h-4 w-4" />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
