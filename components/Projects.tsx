'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MOTION_OK, gsap, useGSAP } from '@/lib/gsap';
import { projects, socials, type Project } from '@/lib/content';
import { BrandIcon } from './BrandIcon';
import { SectionLabel } from './ui';

const github = socials.find((s) => s.brand === 'github' && s.href);
const pad = (n: number) => String(n).padStart(2, '0');

// Di layar lebar, bagian ini "menempel" dan kartu bergeser ke samping saat digulir.
// Di ponsel (atau jika pengguna mematikan animasi) kartu tersusun ke bawah.
export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const track = root.current!.querySelector<HTMLElement>('.proj-track')!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.proj-pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to('.proj-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.proj-pin', start: 'top top', end: () => `+=${distance()}`, scrub: true },
        });
        // Isi visual kartu bergeser sedikit berlawanan arah (parallax di dalam kartu).
        gsap.utils.toArray<HTMLElement>('.proj-art').forEach((art) => {
          gsap.fromTo(art, { xPercent: -12 }, {
            xPercent: 12,
            ease: 'none',
            scrollTrigger: { trigger: art.closest('.proj-card'), containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
          });
        });
      });

      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('.proj-card').forEach((card) => {
          gsap.from(card, { y: 80, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%' } });
        });
      });

      mm.add(MOTION_OK, () => {
        gsap.from('.proj-heading', { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.proj-heading', start: 'top 85%' } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="proyek" className="relative">
      <div className="proj-pin flex flex-col justify-center py-24 lg:motion-safe:h-[100svh] lg:motion-safe:overflow-hidden lg:motion-safe:py-0">
        <div className="flex flex-wrap items-end justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <div>
            <SectionLabel>Proyek pilihan</SectionLabel>
            <h2 className="line-mask mt-5">
              <span className="proj-heading block font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl">
                Karya <em className="font-light">terbaru</em><span className="text-accent">.</span>
              </span>
            </h2>
          </div>
          <div className="hidden w-56 lg:motion-safe:block">
            <p className="mb-2 flex justify-between font-mono text-xs text-muted">
              <span>Geser</span>
              <span>{pad(projects.length)} proyek</span>
            </p>
            <div className="h-px bg-line">
              <div className="proj-progress h-full origin-left scale-x-0 bg-accent" />
            </div>
          </div>
        </div>

        <div className="proj-track mt-12 flex flex-col gap-6 px-5 sm:px-8 lg:motion-safe:mt-14 lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:gap-8 lg:px-12">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
          {github && (
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="GitHub"
              className="proj-card group flex shrink-0 flex-col justify-between rounded-[2rem] border border-dashed border-line p-8 transition-colors hover:border-accent lg:motion-safe:h-[min(68svh,36rem)] lg:motion-safe:w-[24rem]"
            >
              <BrandIcon name="github" className="h-10 w-10 text-muted transition-colors group-hover:text-accent" />
              <span className="mt-16 block">
                <span className="block font-display text-4xl font-semibold leading-tight">
                  Lihat semua di GitHub
                  <ArrowUpRight className="ml-2 inline h-8 w-8 transition-transform duration-500 group-hover:rotate-45" />
                </span>
                <span className="mt-3 block font-mono text-sm text-muted">{github.handle}</span>
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const Icon = p.icon;
  const Wrapper = p.href ? 'a' : 'div';
  const linkProps = p.href ? { href: p.href, target: '_blank', rel: 'noopener noreferrer', 'data-cursor': 'Buka' } : {};

  return (
    <article className="proj-card shrink-0 lg:motion-safe:h-[min(68svh,36rem)] lg:motion-safe:w-[min(72vw,60rem)]">
      <Wrapper
        {...linkProps}
        className="group grid h-full overflow-hidden rounded-[2rem] border border-line bg-surface transition-colors duration-500 hover:border-white/20 lg:grid-cols-[1.15fr_1fr]"
      >
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto" style={{ '--c': p.color } as React.CSSProperties}>
          <div
            className="proj-art absolute inset-[-15%]"
            style={{
              background:
                'radial-gradient(circle at 30% 35%, color-mix(in oklab, var(--c) 70%, transparent), transparent 55%),' +
                'radial-gradient(circle at 75% 75%, color-mix(in oklab, var(--c) 35%, transparent), transparent 50%),' +
                'linear-gradient(160deg, #1c1c1f, #0d0d0e)',
            }}
          >
            <div className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          </div>
          <span className="text-outline absolute -bottom-6 -left-2 font-display text-[9rem] font-semibold leading-none sm:text-[12rem]">
            {pad(index + 1)}
          </span>
          <div className="relative grid h-full place-items-center p-10">
            <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-rotate-6 group-hover:scale-110 sm:p-9">
              <Icon className="h-14 w-14 sm:h-20 sm:w-20" strokeWidth={1.25} />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-7 sm:p-9">
          <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.15em] text-muted">
            <span>{p.category}</span>
            <span>{p.year}</span>
          </div>
          <h3 className="mt-8 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-4xl lg:text-5xl lg:motion-safe:mt-auto">{p.title}</h3>
          <p className="mt-4 leading-relaxed text-muted">{p.desc}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink/80">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 flex items-center gap-2 text-sm font-semibold">
            {p.href ? (
              <>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-bg transition-colors duration-300 group-hover:bg-accent">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                </span>
                Lihat kode di GitHub
              </>
            ) : (
              <span className="text-muted">Repositori pribadi</span>
            )}
          </p>
        </div>
      </Wrapper>
    </article>
  );
}
