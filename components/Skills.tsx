'use client';

import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/gsap';
import { skills } from '@/lib/content';
import { SectionLabel } from './ui';
import { ToolIcon } from './ToolIcon';

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.skills-heading', { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.skills-heading', start: 'top 85%' } });
        gsap.set('.skill-card', { y: 70, autoAlpha: 0 });
        ScrollTrigger.batch('.skill-card', {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out' }),
        });
      });
    },
    { scope: root },
  );

  // Posisi kursor disimpan di variabel CSS untuk efek sorotan (lihat .spotlight di globals.css).
  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <section ref={root} id="keahlian" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel>My skills</SectionLabel>
          <h2 className="line-mask mt-5">
            <span className="skills-heading block font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl">
              Tools
            </span>
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-muted">
            Untuk saat ini hanya ini tools yang saya kuasai, tapi saya sedang mempelajari beberapa tools baru untuk meningkatkan kemampuan saya
          </p>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
            <Sparkles className="h-4 w-4" /> Sedang didalami: AI Engineering
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {skills.map((g, i) => {
            const Icon = g.icon;
            return (
              <li
                key={g.title}
                onPointerMove={spotlight}
                className={`skill-card spotlight ${i === skills.length - 1 && skills.length % 2 === 1 ? "sm:col-span-2" : ""} group relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-7 transition-colors duration-500 hover:border-accent/30`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-raised text-accent transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold">{g.title}</h3>
                <p className="mt-1 text-sm text-muted">{g.desc}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((item) => {
                    const learning = g.learning?.includes(item);
                    return (
                    <li
                      key={item}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink/85 transition-transform duration-300 hover:-translate-y-0.5 ${
                        learning ? 'border border-dashed border-accent/50 bg-accent/5' : 'bg-raised'
                      }`}
                    >
                      <ToolIcon name={item} />
                      {item}
                      {learning && (
                        <span className="ml-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                          belajar
                        </span>
                      )}
                    </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
