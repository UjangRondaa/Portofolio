'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { MOTION_OK, gsap, useGSAP } from '@/lib/gsap';
import { RollText } from './ui';

// Ajakan menghubungi di akhir setiap halaman, kecuali halaman Kontak itu sendiri.
export default function StayInTouch() {
  const pathname = usePathname();
  if (pathname === '/kontak') return null;
  return <Section key={pathname} />;
}

function Section() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.sit-line', { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } });
        gsap.from('.sit-fade', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="flex min-h-[80vh] flex-col justify-center border-t border-line px-5 py-24 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-12 xl:flex-row xl:items-start xl:justify-between xl:gap-16">
        <h2 className="max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
          <span className="line-mask">
            <span className="sit-line block">Tetap</span>
          </span>
          <span className="line-mask">
            <span className="sit-line block font-light italic"><span className="text-sunset">terhubung</span></span>
          </span>
        </h2>
        <div className="flex max-w-md flex-col gap-8 xl:pt-4">
          <p className="sit-fade text-xl leading-snug text-muted sm:text-2xl">
            Punya pertanyaan soal proyek, masukan, atau sekadar ingin menyapa? Hubungi saya di sini.
          </p>
          <a
            href="/kontak"
            className="sit-fade group relative isolate inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-accent bg-accent/10 px-8 py-5 text-lg font-bold uppercase tracking-wide text-accent transition-colors duration-300 hover:text-accent-ink"
          >
            <span aria-hidden className="absolute inset-0 -z-10 translate-y-[105%] bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <RollText>Hubungi saya</RollText>
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
          </a>
        </div>
      </div>
    </section>
  );
}
