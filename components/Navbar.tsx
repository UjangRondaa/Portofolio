'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { MOTION_OK, gsap, onIntro, useGSAP } from '@/lib/gsap';
import { profile, socials } from '@/lib/content';
import { NAV_LINKS } from '@/lib/nav';
import { LocalTime, RollText } from './ui';

// Tombol garis tepi yang terisi warna aksen dari bawah saat disorot.
const fillBtn =
  'group isolate overflow-hidden rounded-full border border-white/20 transition-colors duration-300 hover:border-accent hover:text-accent-ink';
function Fill() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 -z-10 translate-y-[105%] rounded-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0"
    />
  );
}

export default function Navbar() {
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const active = usePathname();

  // Logo kecil di kiri atas dan tombol di kanan muncul setelah layar pembuka selesai.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap
          .timeline({ paused: true })
          .from('.hd-reveal', { yPercent: 110, duration: 1.4, ease: 'expo.out' }, 0.15)
          .from('.hd-fade', { autoAlpha: 0, y: -16, duration: 1, ease: 'expo.out' }, 0.5);
        const off = onIntro(() => tl.play());
        return () => off();
      });
    },
    { scope: header },
  );

  // Panel menu meluncur dari kanan; isi menu naik bergantian.
  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(drawer.current, { autoAlpha: 1 })
        .fromTo('.dr-backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0)
        .fromTo('.dr-panel', { xPercent: 100 }, { xPercent: 0, duration: 0.75, ease: 'expo.inOut' }, 0)
        .fromTo('.dr-line', { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 0.3)
        .fromTo('.dr-item', { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 0.4)
        .fromTo('.dr-fade', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.7);
    },
    { scope: drawer },
  );

  useEffect(() => {
    const tl = menuTl.current;
    if (tl) {
      if (!window.matchMedia(MOTION_OK).matches) tl.progress(open ? 1 : 0).pause();
      else if (open) tl.timeScale(1).play();
      else tl.timeScale(1.8).reverse();
    }

    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-gradient-to-b from-bg via-bg/80 to-transparent sm:h-40" />

      <header ref={header} className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
        <a
          href="/"
          aria-label="Ke beranda"
          data-transition-label={profile.nickname.toUpperCase()}
          className="pointer-events-auto block self-center font-display text-lg font-semibold uppercase leading-none tracking-[0.12em] sm:text-xl"
        >
          <span className="line-mask">
            <span className="hd-reveal block">
              {profile.nickname}
            </span>
          </span>
        </a>

        <nav aria-label="Navigasi utama" className="hd-fade pointer-events-auto flex items-center gap-3 sm:gap-5">
          <p className="hidden text-right text-xs font-medium leading-relaxed sm:block">
            <LocalTime timeZone={profile.timeZone} />
            <span className="block text-muted">(GMT+7)</span>
          </p>
          <a href="/kontak" className={`${fillBtn} relative px-4 py-2.5 text-xs font-bold uppercase tracking-wide sm:px-5 sm:text-sm`}>
            <Fill />
            <RollText>Hubungi</RollText>
          </a>
          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={`${fillBtn} relative grid h-11 w-11 place-items-center`}
          >
            <Fill />
            <span className="flex flex-col gap-1">
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
            </span>
          </button>
        </nav>
      </header>

      <div ref={drawer} inert={!open} role="dialog" aria-modal="true" aria-label="Menu" className="invisible fixed inset-0 z-[70]">
        <div className="dr-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="dr-panel absolute right-0 top-0 flex h-full w-[min(90vw,30rem)] flex-col overflow-y-auto overscroll-contain border-l border-line bg-bg px-7 pb-10 pt-24 sm:px-10">
          <button
            ref={closeBtn}
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className={`${fillBtn} absolute right-5 top-5 grid h-11 w-11 place-items-center sm:right-8 sm:top-7`}
          >
            <Fill />
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-current" />
            </span>
          </button>

          <ul className="relative">
            <span aria-hidden className="dr-line absolute left-0 top-0 h-px w-full origin-left bg-white/15" />
            {NAV_LINKS.map((l) => (
              <li key={l.href} className="relative overflow-hidden">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.href ? 'page' : undefined}
                  className="dr-item group flex items-center gap-4 py-4 font-display text-3xl font-medium leading-none tracking-tight sm:py-5 sm:text-4xl"
                >
                  <span className={`h-2.5 w-2.5 shrink-0 bg-accent transition-opacity duration-300 ${active === l.href ? 'opacity-100' : 'opacity-0'}`} />
                  <RollText>{l.labelEn}</RollText>
                </a>
                <span aria-hidden className="dr-line absolute bottom-0 left-0 h-px w-full origin-left bg-white/15" />
              </li>
            ))}
          </ul>

          <div className="dr-fade mt-auto flex flex-col gap-6 pt-12">
            {profile.email && (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Email</p>
                <a href={`mailto:${profile.email}`} className="mt-1 inline-block break-all text-[15px] font-bold tracking-tight text-accent sm:text-xl">
                  {profile.email}
                </a>
              </div>
            )}
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Social</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
                {socials
                  .filter((s) => s.href)
                  .map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-lg">
                        <RollText>{s.label}</RollText>
                        <ArrowUpRight className="h-4 w-4 text-muted transition-transform duration-500 group-hover:rotate-45" />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
