'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Award, Maximize2, X } from 'lucide-react';
import { MOTION_OK, gsap, useGSAP } from '@/lib/gsap';
import { certificates, type Certificate } from '@/lib/content';
import { SectionLabel } from './ui';

export default function Certificates() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Certificate | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.cert-heading', { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cert-heading', start: 'top 85%' } });
        gsap.from('.cert-card', { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.cert-grid', start: 'top 85%' } });
      });
    },
    { scope: root },
  );

  const open = (c: Certificate) => {
    setActive(c);
    dialog.current?.showModal();
  };

  return (
    <section ref={root} id="sertifikat" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <SectionLabel>Sertifikat</SectionLabel>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h2 className="line-mask">
          <span className="cert-heading block font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl">
            Bukti <span className="text-accent">pencapaian</span>
          </span>
        </h2>
        <p className="max-w-sm text-muted">sertifikat yang sudah saya peroleh.</p>
      </div>

      <ul className="cert-grid mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <li key={c.credentialId} className="cert-card group flex flex-col rounded-[1.75rem] border border-line bg-surface p-3 transition-colors duration-500 hover:border-white/20">
            <button
              type="button"
              onClick={() => open(c)}
              data-cursor="Lihat"
              aria-label={`Lihat sertifikat ${c.title}`}
              className="relative block aspect-[1400/989] overflow-hidden rounded-[1.25rem] bg-raised"
            >
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-bg/0 transition-colors duration-500 group-hover:bg-bg/30" />
              <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-bg/80 text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>

            <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
              <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                <span className="flex items-center gap-2 text-accent">
                  <Award className="h-3.5 w-3.5" /> {c.issuer}
                </span>
                <span>{c.date}</span>
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight">{c.title}</h3>
              <p className="mt-2 font-mono text-xs text-muted">
                {c.hours ? `${c.hours} jam belajar · ` : ''}ID {c.credentialId}
              </p>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold transition-colors hover:text-accent lg:mt-auto lg:pt-6"
              >
                Verifikasi sertifikat
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover/link:rotate-45" />
              </a>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-[min(92vw,1100px,calc((100svh-9rem)*1.41))] max-w-none bg-transparent p-0 text-ink backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {active && (
          <figure className="relative">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Tutup"
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-bg/80 text-ink backdrop-blur transition-colors hover:bg-accent hover:text-accent-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <Image src={active.image} alt={`Sertifikat ${active.title}`} width={1400} height={989} sizes="92vw" className="h-auto w-full rounded-2xl" />
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <span>
                <span className="block font-display text-xl font-semibold">{active.title}</span>
                <span className="font-mono text-xs text-muted">
                  {active.issuer} · {active.date}
                </span>
              </span>
              <a href={active.href} target="_blank" rel="noopener noreferrer" className="btn-accent group">
                Verifikasi
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </a>
            </figcaption>
          </figure>
        )}
      </dialog>
    </section>
  );
}
