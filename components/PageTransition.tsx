'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MOTION_OK, ScrollTrigger, gsap } from '@/lib/gsap';
import { labelFor } from '@/lib/nav';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

// Setiap tautan ke halaman lain di situs ini memakai transisi tirai: tirai naik menutup layar,
// halaman berganti di baliknya, nama halaman tujuan muncul, lalu tirai beserta namanya naik membuka.
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const arrived = useRef<(() => void) | null>(null);
  const current = useRef(pathname);

  useEffect(() => {
    current.current = pathname;
    arrived.current?.();
    arrived.current = null;
  }, [pathname]);

  useEffect(() => {
    let busy = false;

    const play = (tl: gsap.core.Timeline) => new Promise<void>((r) => tl.eventCallback('onComplete', () => r()));

    // `text` dari atribut data-transition-label pada tautan, jika ada; selain itu nama halaman tujuan.
    const go = async (href: string, text?: string) => {
      busy = true;
      label.current!.textContent = text || labelFor(href);
      router.prefetch(href);

      // Tutup: panel warna naik dari bawah; nama halaman masih tersembunyi di dalamnya.
      await play(
        gsap
          .timeline()
          .set(curtain.current, { autoAlpha: 1, yPercent: 100 })
          .set(word.current, { yPercent: 10, autoAlpha: 0 })
          .to(curtain.current, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' }),
      );

      if (href !== current.current) {
        const done = new Promise<void>((r) => (arrived.current = r));
        router.push(href, { scroll: false });
        await Promise.race([done, wait(4000)]);
        await nextFrame();
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      ScrollTrigger.refresh();

      // Buka: nama muncul (fade + geser halus), jeda sebentar, lalu panel naik membuka layar.
      // Nama berada DI DALAM panel sehingga ikut terbawa bersama warnanya (dengan parallax ringan),
      // bukan dipotong mask terpisah.
      const page = document.getElementById('page-content');
      await play(
        gsap
          .timeline()
          .to(word.current, { yPercent: -6, autoAlpha: 1, duration: 0.7, ease: 'power2.out' })
          .to({}, { duration: 0.3 })
          .addLabel('reveal')
          .to(curtain.current, { yPercent: -100, duration: 0.9, ease: 'power3.out' }, 'reveal')
          .to(word.current, { yPercent: 38, duration: 0.9, ease: 'power3.out' }, 'reveal')
          .fromTo(page, { y: 48 }, { y: 0, duration: 1, ease: 'power3.out', clearProps: 'transform' }, 'reveal')
          .set(curtain.current, { autoAlpha: 0 }),
      );
      busy = false;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="/"]');
      const href = link?.getAttribute('href');
      if (!link || !href || href.startsWith('//') || link.target === '_blank' || link.hasAttribute('download')) return;
      e.preventDefault();
      if (busy) return;
      if (!window.matchMedia(MOTION_OK).matches) return router.push(href);
      void go(href, link.dataset.transitionLabel);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return (
    <div
      ref={curtain}
      aria-hidden
      className="pointer-events-none invisible fixed inset-0 z-[90] overflow-hidden bg-sunset text-accent-ink will-change-transform"
    >
      <div
        ref={word}
        className="absolute inset-0 flex items-center justify-center p-5 text-center opacity-0 will-change-transform sm:p-8 lg:p-12"
      >
        <span ref={label} className="block font-display text-[12vw] font-light italic leading-[0.9] tracking-[-0.04em]" />
      </div>
    </div>
  );
}
