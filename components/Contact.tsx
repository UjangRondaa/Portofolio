'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/gsap';
import { profile, socials } from '@/lib/content';
import { BrandIcon } from './BrandIcon';
import ContactForm from './ContactForm';
import { Magnetic, RollText, SectionLabel } from './ui';

const github = socials.find((s) => s.brand === 'github' && s.href);
const activeSocials = socials.filter((s) => s.href);

// Judul besar: tiap baris berisi kata-kata. Baris kedua tampil tipis & miring.
const TITLE = [["Let's", 'Work'], ['Together']];
const SUBTITLE = 'Punya ide, proyek, atau peluang kolaborasi?';
// Posisi lima tanda "+" di sekitar judul, seperti di lusion.co.
const CROSSES = ['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'left-1/2 bottom-0 -translate-x-1/2', 'right-0 bottom-0'];

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // Tombol kapsul membuka email; jika email kosong, mengarah ke GitHub.
  // "Let's talk" membuka aplikasi email pengunjung dengan tujuan & subjek sudah terisi.
  const mail = `mailto:${profile.email}?subject=${encodeURIComponent(`Halo ${profile.name.split(' ')[0]}, mari ngobrol`)}`;
  const cta = profile.email ? { href: mail, label: "Let's talk" } : { href: github?.href ?? '/', label: 'Lihat GitHub' };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Masuk ala lusion: tanda "+" muncul berputar, subjudul naik kata per kata sambil miring,
        // lalu huruf judul naik bergantian. Berbalik lagi saat bagian ini digulir keluar.
        const words = gsap.utils.toArray<HTMLElement>('.lw-word');
        const enter = gsap
          .timeline({ paused: true })
          .fromTo('.lw-cross', { scale: 0, rotate: 0 }, { scale: 1, rotate: 180, duration: 1.4, stagger: 0.08, ease: 'expo.out' }, 0)
          .fromTo('.lw-sub', { yPercent: 200, rotate: 30 }, { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.04, ease: 'expo.out' }, 0)
          .add(
            words.map((w, i) =>
              gsap.fromTo(w.querySelectorAll('.lw-char'), { yPercent: 100 }, { yPercent: 0, duration: 1.2, stagger: 0.04, ease: 'expo.out', delay: i * 0.1 }),
            ),
            0.1,
          );

        // Saat diam: tiap 2 detik satu huruf acak di setiap kata berguling ke atas.
        const roll = () =>
          words.forEach((w, i) => {
            const inners = w.querySelectorAll('.lw-roll');
            const el = inners[Math.floor(Math.random() * inners.length)];
            gsap.fromTo(el, { yPercent: 0 }, { yPercent: -50, duration: 1, delay: i * 0.12, ease: 'expo.inOut' });
          });
        const loop = gsap.delayedCall(2, function repeat() {
          roll();
          loop.restart(true);
        }).pause();

        ScrollTrigger.create({
          trigger: '.contact-title',
          start: 'top 85%',
          end: 'bottom top',
          onEnter: () => (enter.timeScale(1).play(), loop.restart(true)),
          onEnterBack: () => loop.restart(true),
          onLeave: () => loop.pause(),
          onLeaveBack: () => (enter.timeScale(2).reverse(), loop.pause()),
        });

        gsap.from('.contact-cta', { scale: 0, rotate: -90, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.contact-title', start: 'top 60%' } });
        gsap.from('.contact-fade', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.contact-rows', start: 'top 90%' } });
        return () => loop.kill();
      });
    },
    { scope: root },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section ref={root} id="kontak" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <SectionLabel>Contact</SectionLabel>

      <div className="relative mt-10 flex flex-col gap-12 py-10 lg:flex-row lg:items-end lg:justify-between">
        {CROSSES.map((pos) => (
          <span key={pos} aria-hidden className={`absolute ${pos} h-4 w-4`}>
            <span className="lw-cross relative block h-full w-full">
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-ink" />
              <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-ink" />
            </span>
          </span>
        ))}

        <div>
          <p aria-hidden className="flex flex-wrap gap-x-[0.3em] overflow-hidden font-mono text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">
            {SUBTITLE.split(' ').map((w, i) => (
              <span key={i} className="lw-sub inline-block origin-bottom-left">
                {w}
              </span>
            ))}
          </p>
          <h2 className="contact-title mt-6 font-display text-[clamp(3.2rem,10.5vw,11rem)] font-semibold leading-none tracking-[-0.03em]">
            <a href={cta.href} aria-label={`${TITLE.flat().join(' ')}. ${SUBTITLE}`} className="group relative inline-block">
              {TITLE.map((line, li) => (
                <span key={li} aria-hidden className={`flex flex-wrap gap-x-[0.22em] ${li === 1 ? 'font-light italic text-accent' : ''}`}>
                  {line.map((word) => (
                    // Tiap kata dipotong setinggi satu baris; huruf naik dari bawah garis ini.
                    <span key={word} className="lw-word flex h-[1.08em] overflow-hidden pr-[0.06em]">
                      {[...word].map((ch, ci) => (
                        <span key={ci} className="lw-char inline-block will-change-transform">
                          {/* Dua salinan huruf bertumpuk; menggeser -50% menampilkan salinan kedua (efek berguling). */}
                          <span className="lw-roll flex flex-col will-change-transform">
                            <span className="block h-[1.08em]">{ch}</span>
                            <span className="block h-[1.08em]">{ch}</span>
                          </span>
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              ))}
              {/* Garis yang tergambar saat judul disorot. */}
              <span aria-hidden className="absolute -bottom-[0.02em] left-0 h-[0.06em] w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
            </a>
          </h2>
        </div>

        <div className="contact-cta shrink-0 self-start lg:self-auto">
          <Magnetic strength={0.45}>
            <a
              href={cta.href}
              target={cta.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              // Tombol kapsul lonjong yang dimiringkan, seperti di lusion.co.
              className="group inline-flex -rotate-6 items-center gap-3 whitespace-nowrap rounded-full bg-sunset px-9 py-5 text-lg font-semibold uppercase tracking-wide text-accent-ink transition-[filter] duration-500 hover:brightness-110 sm:px-12 sm:py-6 sm:text-2xl"
            >
              {cta.label}
              <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45 sm:h-7 sm:w-7" />
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="contact-rows mt-20 grid gap-10 border-t border-line pt-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <ContactForm />
        </div>

        <ul className="md:col-span-6 md:col-start-7">
          {profile.email && (
            <li className="contact-fade border-b border-line">
              <button type="button" onClick={copyEmail} className="group flex w-full items-center justify-between gap-4 py-5 text-left">
                <span>
                  <span className="block font-mono text-xs uppercase tracking-[0.15em] text-muted">Email</span>
                  <span className="mt-1 block break-all font-display text-2xl font-semibold sm:text-3xl">{profile.email}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-sm text-muted group-hover:text-accent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Tersalin' : 'Salin'}
                </span>
              </button>
            </li>
          )}
          {activeSocials.map((s) => (
            <li key={s.label} className="contact-fade border-b border-line">
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-5">
                <span className="flex items-center gap-4">
                  <BrandIcon name={s.brand} className="h-6 w-6 text-muted transition-colors group-hover:text-accent" />
                  <span className="font-display text-2xl font-semibold sm:text-3xl">
                    <RollText>{s.label}</RollText>
                  </span>
                </span>
                <span className="flex items-center gap-3 text-sm text-muted">
                  <span className="hidden sm:inline">{s.handle}</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45 group-hover:text-accent" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
