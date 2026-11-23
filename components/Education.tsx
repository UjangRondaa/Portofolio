'use client';

import { useRef } from 'react';
import { GraduationCap, MapPin } from 'lucide-react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/gsap';
import { education } from '@/lib/content';
import { SectionLabel } from './ui';

// Riwayat pendidikan sebagai garis waktu: garis "tergambar" mengikuti gulir,
// dan titik tiap jenjang menyala saat garis melewatinya.
export default function Education() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.edu-heading', { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.edu-heading', start: 'top 85%' } });
        gsap.from('.edu-intro', { y: 30, autoAlpha: 0, duration: 1, delay: 0.2, ease: 'expo.out', scrollTrigger: { trigger: '.edu-heading', start: 'top 85%' } });
        gsap.fromTo('.edu-line', { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.edu-list', start: 'top 70%', end: 'bottom 60%', scrub: true },
        });
        gsap.utils.toArray<HTMLElement>('.edu-item').forEach((item) => {
          ScrollTrigger.create({ trigger: item, start: 'top 62%', toggleClass: { targets: item, className: 'is-active' } });
          gsap.from(item.querySelectorAll('.edu-fade'), {
            y: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: item, start: 'top 80%' },
          });
          // Angka tahun besar di belakang bergeser pelan (parallax).
          gsap.fromTo(item.querySelector('.edu-year'), { yPercent: 30 }, {
            yPercent: -30, ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="pendidikan" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <SectionLabel>Education</SectionLabel>
      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        <h2 className="line-mask lg:col-span-7">
          <span className="edu-heading block font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl">
            Tempat saya <em className="font-light">belajar</em>
            <span className="text-sunset">.</span>
          </span>
        </h2>
        <p className="edu-intro max-w-sm self-end text-muted lg:col-span-4 lg:col-start-9">
          Jenjang pendidikan yang membentuk cara saya bertanya dan berpikir.
        </p>
      </div>

      <ol className="edu-list relative mt-16 lg:ml-[33.333%]">
        <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-line" />
        <span aria-hidden className="edu-line absolute bottom-0 left-[5px] top-0 w-px origin-top bg-accent" />
        {education.map((e) => (
          <li key={e.school + e.period} className="edu-item group relative pb-20 pl-12 last:pb-0 sm:pl-16">
            <span
              aria-hidden
              className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full border border-muted bg-bg transition-all duration-500 group-[.is-active]:scale-150 group-[.is-active]:border-accent group-[.is-active]:bg-accent"
            />
            <span
              aria-hidden
              className="edu-year text-outline pointer-events-none absolute -top-6 right-0 hidden select-none font-display text-[8rem] font-semibold italic leading-none sm:block"
            >
              {e.period.match(/\d{4}/)?.[0]}
            </span>

            <p className="edu-fade relative font-mono text-xs uppercase tracking-[0.2em] text-accent">{e.period}</p>
            <div className="edu-fade relative mt-3 flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-white p-2 sm:h-16 sm:w-16">
                {e.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.logo} alt={`Logo ${e.school}`} className="h-full w-full object-contain" />
                ) : (
                  <GraduationCap aria-hidden className="h-6 w-6 text-muted" strokeWidth={1.5} />
                )}
              </span>
              <h3 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">{e.school}</h3>
            </div>
            <p className="edu-fade relative mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink/75">
              {e.degree && (
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-accent" /> {e.degree}
                </span>
              )}
              <span className="flex items-center gap-2 text-muted">
                <MapPin className="h-4 w-4" /> {e.place}
              </span>
            </p>
            {e.desc && <p className="edu-fade relative mt-4 max-w-xl leading-relaxed text-muted">{e.desc}</p>}
            {e.highlights && e.highlights.length > 0 && (
              <ul className="edu-fade relative mt-5 flex flex-wrap gap-2">
                {e.highlights.map((h) => (
                  <li key={h} className="rounded-full border border-line px-3 py-1 text-xs text-ink/80">
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
