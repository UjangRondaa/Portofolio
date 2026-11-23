'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { MOTION_OK, SplitText, gsap, useGSAP } from '@/lib/gsap';
import { profile, projects, skills, socials } from '@/lib/content';
import { BrandIcon } from './BrandIcon';
import { SectionLabel } from './ui';

// Tautan di bawah foto: Instagram & GitHub.
const photoSocials = (['instagram', 'github'] as const)
  .map((b) => socials.find((s) => s.brand === b && s.href))
  .filter((s) => s !== undefined);

const STATS = [
  { value: projects.length, from: 0, label: 'Proyek di portofolio ini', color: 'text-ink' },
  { value: new Set(skills.flatMap((s) => s.items)).size, from: 0, label: 'Tools yang pernah saya pakai', color: 'text-accent' },
  { value: 2023, from: 2000, label: 'Tahun mulai kuliah Informatika', color: 'text-sunset' },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: '(min-width: 1024px)' }, (ctx) => {
        if (!ctx.conditions!.motion) return;
        const desktop = ctx.conditions!.desktop;

        // Teks dipecah per baris (bertopeng) dan per kata.
        const split = SplitText.create('.about-text', { type: 'lines,words', mask: 'lines' });

        // Baris naik dari balik topeng saat bagian ini masuk layar.
        gsap.from(split.lines, {
          yPercent: 100,
          duration: 1.2,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.about-text', start: 'top 85%' },
        });

        // "Membaca": kata demi kata berubah dari redup & buram menjadi tajam mengikuti gulir.
        // Di layar besar, bagian ini disematkan (pin) supaya teks terbaca utuh sebelum lanjut.
        gsap.fromTo(
          split.words,
          { opacity: 0.12, filter: 'blur(6px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: desktop
              ? { trigger: '.about-pin', start: 'top 20%', end: '+=140%', scrub: 0.6, pin: true }
              : { trigger: '.about-text', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 },
          },
        );

        // Foto terbuka dari bawah seperti tirai, sementara isinya sedikit mengecil.
        const photo = { trigger: '.about-photo', start: 'top 85%' };
        gsap.fromTo(
          '.about-photo',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: photo },
        );
        gsap.fromTo('.about-photo-inner', { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: photo });
        gsap.from('.about-frame', { y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: photo });
        gsap.from('.about-caption', { y: 20, autoAlpha: 0, duration: 1, delay: 0.5, ease: 'expo.out', scrollTrigger: photo });

        gsap.utils.toArray<HTMLElement>('.stat-num').forEach((el) => {
          const counter = { v: Number(el.dataset.from) };
          gsap.to(counter, {
            v: Number(el.dataset.to),
            duration: 2,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
            onUpdate: () => (el.textContent = String(Math.round(counter.v))),
          });
        });
        gsap.from('.stat', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 90%' } });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tentang" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <SectionLabel>Tentang saya</SectionLabel>

      <div className="about-pin mt-12 grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <p className="about-text font-display text-[clamp(1.9rem,4.4vw,4rem)] font-normal leading-[1.1] tracking-[-0.025em]">
            {profile.about}
          </p>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">{profile.intro}</p>
        </div>

        <figure className="w-full max-w-xs lg:col-span-4 lg:col-start-9 lg:max-w-none">
          {/* Bingkai: garis gradasi senja + bayangan kotak bergeser di belakang foto. */}
          <div className="about-frame relative">
            <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-line" />
            <div className="relative rounded-2xl bg-sunset p-[3px] shadow-[0_30px_80px_-30px_rgba(255,79,154,0.55)]">
              <div className="rounded-[calc(1rem-3px)] bg-raised p-2">
                <div className="about-photo relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                  <div className="about-photo-inner absolute inset-0">
                    <Image
                      src={profile.photo}
                      alt={`Foto ${profile.name}`}
                      fill
                      sizes="(min-width: 1024px) 30vw, 320px"
                      quality={90}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nama akun media sosial: hanya teks + logo, bukan tautan. */}
          <ul className="about-caption mt-4 flex flex-col gap-2 text-sm text-ink/80">
            {photoSocials.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <BrandIcon name={s.brand} className="h-4 w-4 text-muted" />
                <span>{s.handle}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>

      <dl className="stats mt-20 grid border-t border-line sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="stat flex flex-col-reverse border-b border-line py-8 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
            <dt className="mt-2 text-sm text-muted">{s.label}</dt>
            <dd className="font-display text-6xl font-semibold tracking-tight sm:text-7xl">
              <span className={`stat-num tabular-nums ${s.color}`} data-from={s.from} data-to={s.value}>
                {s.value}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
