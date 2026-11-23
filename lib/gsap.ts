'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(pointer: fine)';

// Animasi pembuka hero menunggu preloader selesai. Preloader memanggil finishIntro(),
// komponen lain mendaftar lewat onIntro().
const INTRO_EVENT = 'intro:done';
let introDone = false;

export function finishIntro() {
  introDone = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
}

export function onIntro(cb: () => void): () => void {
  if (introDone) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}
