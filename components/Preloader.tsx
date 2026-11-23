'use client';

import { useRef, useState } from 'react';
import { MOTION_OK, ScrollTrigger, finishIntro, gsap, useGSAP } from '@/lib/gsap';

// Huruf "R" kapital dalam bentuk piksel (5 kolom x 7 baris). Baris ke-4 (indeks 3) sejajar dengan bar loading.
const GLYPH = ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'];
const COLS = 5;
const ROWS = GLYPH.length;
const BAR_ROW = 3;
const PIXELS = GLYPH.flatMap((row, r) => [...row].flatMap((ch, c) => (ch === 'X' ? [{ c, r }] : [])));
// Piksel yang menjadi pusat zoom saat layar terbuka (harus piksel terisi).
const FOCUS = { x: 2 - COLS / 2 + 0.5, y: BAR_ROW - ROWS / 2 + 0.5 };

const DIGITS = [1, 10, 100]; // jumlah langkah pada digit ratusan, puluhan, satuan

const sat = (v: number) => Math.min(1, Math.max(0, v));
const expoInOut = gsap.parseEase('expo.inOut');

// Layar pembuka: hitungan persen besar bergulir di pojok kiri bawah, bar piksel di tengah terisi,
// lalu berubah menjadi huruf "R" bergradasi senja yang membesar sambil berputar untuk membuka halaman.
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const strips = useRef<(HTMLSpanElement | null)[]>([]);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const html = document.documentElement;
      const finish = () => {
        html.style.overflow = '';
        setDone(true);
        ScrollTrigger.refresh();
      };

      if (!window.matchMedia(MOTION_OK).matches) {
        finishIntro();
        finish();
        return;
      }

      html.style.overflow = 'hidden';
      const cv = canvas.current!;
      const ctx = cv.getContext('2d')!;
      const css = getComputedStyle(html);
      const color = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
      const BG = color('--color-bg', '#0c0716');

      // Gradasi senja (jingga -> pink -> ungu) dalam koordinat piksel huruf.
      const sunset = ctx.createLinearGradient(-COLS / 2, -ROWS / 2, COLS / 2, ROWS / 2);
      sunset.addColorStop(0, '#ffb347');
      sunset.addColorStop(0.5, '#ff4f9a');
      sunset.addColorStop(1, '#9b5cff');

      // progress: isi bar & hitungan, morph: bar -> huruf R, zoom: huruf membesar membuka layar.
      const s = { progress: 0, morph: 0, zoom: 0, digitsOut: 0 };
      const eased = DIGITS.map(() => 0);
      let w = 0;
      let h = 0;
      let dpr = 1;

      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        cv.width = w * dpr;
        cv.height = h * dpr;
      };
      resize();
      window.addEventListener('resize', resize);

      const rect = (x: number, y: number) => ctx.fillRect(x - 0.01, y - 0.01, 1.02, 1.02);

      const draw = (dt: number) => {
        // Hitungan bergulir: tiap digit mengejar targetnya dengan pelunakan eksponensial.
        const pct = Math.floor(s.progress * 100);
        DIGITS.forEach((steps, i) => {
          const target = Math.floor(pct / (100 / steps));
          eased[i] += (target - eased[i]) * (1 - Math.exp(-7 * dt));
          if (Math.abs(target - eased[i]) < 0.01) eased[i] = target;
          const out = expoInOut(sat(s.digitsOut * 1.2 - (0.2 * i) / (DIGITS.length - 1)));
          const el = strips.current[i];
          if (el) el.style.transform = `translateY(${-(eased[i] + out)}em)`;
        });

        const n = Math.min(42, w / 30);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, w, h);

        const z = expoInOut(s.zoom);
        const target = Math.hypot(w, h) * 1.25;
        const p = n * Math.pow(target / n, z);
        ctx.translate(w / 2, h / 2);
        ctx.rotate(-z * 0.9);
        ctx.scale(p, p);
        ctx.translate(-FOCUS.x * z, -FOCUS.y * z);

        const barY = BAR_ROW - ROWS / 2;
        // Bar loading: jalur redup, isi bergradasi. Memudar saat berubah menjadi huruf.
        const barAlpha = 1 - sat(s.morph * 3);
        if (barAlpha > 0) {
          ctx.globalAlpha = barAlpha;
          ctx.fillStyle = 'rgba(255, 241, 246, 0.16)';
          ctx.fillRect(-COLS / 2, barY, COLS, 1);
          ctx.fillStyle = sunset;
          ctx.fillRect(-COLS / 2, barY, COLS * s.progress, 1);
          ctx.globalAlpha = 1;
        }

        if (s.morph > 0) {
          // Piksel huruf tumbuh dari baris bar ke posisinya masing-masing, yang jauh menyusul belakangan.
          const pos = PIXELS.map(({ c, r }) => {
            const delay = (Math.abs(r - BAR_ROW) / 3) * 0.4;
            const k = expoInOut(sat((s.morph - delay) / 0.6));
            return { x: c - COLS / 2, y: barY + (r - BAR_ROW) * k, k };
          });

          if (s.zoom > 0) {
            // Huruf menjadi "jendela": bagian dalamnya memperlihatkan halaman di belakang.
            ctx.globalCompositeOperation = 'destination-out';
            pos.forEach(({ x, y }) => rect(x, y));
            ctx.globalCompositeOperation = 'source-over';
          }
          ctx.fillStyle = sunset;
          pos.forEach(({ x, y, k }) => {
            ctx.globalAlpha = Math.min(sat(k * 4 + (y === barY ? 1 : 0)), 1 - sat(s.zoom * 5));
            rect(x, y);
          });
          ctx.globalAlpha = 1;
        }
      };

      const tick = (_t: number, deltaMs: number) => draw(Math.min(deltaMs, 100) / 1000);
      gsap.ticker.add(tick);

      // Isi bar mengikuti waktu, lalu menunggu font & halaman selesai dimuat sebelum mencapai 100.
      const loaded = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true })),
      ]);

      const tl = gsap.timeline({ paused: true, onComplete: () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', resize);
        finish();
      } });
      tl.to(s, { progress: 1, duration: 0.45, ease: 'power2.out' })
        .to(s, { digitsOut: 1, duration: 1, ease: 'none' }, '+=0.25')
        .to(s, { morph: 1, duration: 0.9, ease: 'none' }, '<0.15')
        .to(s, { zoom: 1, duration: 1.5, ease: 'none' }, '+=0.35')
        .add(finishIntro, '-=0.75');

      const intro = gsap.to(s, { progress: 0.86, duration: 1.4, ease: 'power2.inOut' });
      let cancelled = false;
      void Promise.all([loaded, intro.then()]).then(() => {
        if (!cancelled) tl.play();
      });

      return () => {
        cancelled = true;
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', resize);
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[100]">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div className="absolute bottom-0 left-0 flex h-[1em] overflow-hidden px-[0.04em] font-display text-[7vw] font-semibold leading-none tabular-nums text-ink">
        {DIGITS.map((steps, i) => (
          <span key={steps} className="block">
            <span ref={(el) => void (strips.current[i] = el)} className="flex flex-col will-change-transform">
              {/* Angka 0..steps, ditambah satu baris kosong agar digit bisa bergulir keluar. */}
              {Array.from({ length: steps + 2 }, (_, k) => (
                <span key={k} className="block h-[1em]">
                  {k === steps + 1 ? '' : k % 10}
                </span>
              ))}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
