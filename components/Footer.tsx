'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/gsap';
import { profile, socials } from '@/lib/content';
import { NAV_LINKS } from '@/lib/nav';

// Teks dengan garis bawah yang tergambar dari kiri saat disorot.
function Underline({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-in group-hover:origin-left group-hover:scale-x-100" />
    </span>
  );
}

// Satu baris teks bertopeng: isinya naik dari balik tepi bawah saat footer muncul.
function Line({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`-mb-2 block overflow-hidden pb-2 ${className}`}>
      <span className="ft-line block will-change-transform">{children}</span>
    </span>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <Line className="text-sm uppercase tracking-[0.2em] text-accent-ink/60">{children}</Line>;
}

// Footer menempel di dasar layar dan tersingkap dari balik isi halaman saat digulir sampai habis.
// Tingginya mengikuti isi; tiap baris teks naik dari balik topengnya.
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Teks tidak disembunyikan lebih dulu: animasi naik baru dijalankan saat footer mulai
        // tersingkap, jadi kalaupun pemicunya gagal, teks tetap terlihat.
        const lines = gsap.utils.toArray<HTMLElement>('.ft-line');
        ScrollTrigger.create({
          // Elemennya diambil langsung: selector teks hanya dicari di dalam footer (scope useGSAP).
          trigger: document.getElementById('page-content'),
          start: 'bottom bottom',
          onEnter: () => gsap.fromTo(lines, { yPercent: 150 }, { yPercent: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out', overwrite: true }),
        });
      });
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <footer ref={root} className="sticky bottom-0 z-0 flex flex-col overflow-hidden bg-sunset px-5 pb-10 pt-20 font-footer font-light text-accent-ink sm:px-8 lg:px-12">
      <div className="grid grid-cols-2 gap-10 xl:grid-cols-3 xl:gap-8">
        <div className="col-span-2 flex flex-col gap-6 xl:col-span-1">
          {profile.email && (
            <div>
              <Heading>Email</Heading>
              <Line className="mt-1">
                <a href={`mailto:${profile.email}`} className="group inline-block break-all text-lg font-normal sm:text-2xl">
                  <Underline>{profile.email}</Underline>
                </a>
              </Line>
            </div>
          )}
          <div>
            <Heading>Lokasi</Heading>
            <Line className="mt-1 text-lg font-normal sm:text-2xl">{profile.location}</Line>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Heading>Halaman</Heading>
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Line key={l.href}>
                <a href={l.href} className="group inline-block text-xl tracking-tight sm:text-2xl">
                  <Underline>{l.label}</Underline>
                </a>
              </Line>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <Heading>Sosial</Heading>
          <nav className="flex flex-col gap-3">
            {socials
              .filter((s) => s.href)
              .map((s) => (
                <Line key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-xl tracking-tight sm:text-2xl">
                    <Underline>{s.label}</Underline>
                    <ArrowUpRight className="h-5 w-5 text-accent-ink/60" />
                  </a>
                </Line>
              ))}
          </nav>
        </div>
      </div>

      <div className="mt-[6vh] border-t border-accent-ink/20 pt-6 text-sm uppercase tracking-wider text-accent-ink/70">
        <Line>
          © {new Date().getFullYear()} {profile.name}.
        </Line>
      </div>
    </footer>
  );
}
