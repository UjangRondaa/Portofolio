'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ImagePlus, Loader2, MessageCircle, Pin, X } from 'lucide-react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/gsap';
import { MESSAGE_MAX, NAME_MAX, PHOTO_MAX_MB, addEntry, guestbookReady, listEntries, toAvatar, type Entry } from '@/lib/guestbook';
import { SectionLabel } from './ui';

const AVATAR_COLORS = ['#FF4F9A', '#FFA53D', '#9B5CFF', '#2EE6D6', '#FF6A5C'];
const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const relFmt = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });

function timeAgo(iso: string) {
  let value = (Date.now() - new Date(iso).getTime()) / 60_000;
  if (value < 1) return 'baru saja';
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [['minute', 60], ['hour', 24], ['day', 7]];
  for (const [unit, size] of steps) {
    if (value < size) return relFmt.format(-Math.floor(value), unit);
    value /= size;
  }
  return dateFmt.format(new Date(iso));
}

// Foto profil, atau huruf depan nama dengan warna tetap per nama.
function Avatar({ name, src, className }: { name: string; src?: string | null; className: string }) {
  if (src) return <img src={src} alt="" loading="lazy" className={`${className} shrink-0 rounded-full bg-raised object-cover`} />;
  const hash = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return (
    <span
      aria-hidden
      style={{ backgroundColor: AVATAR_COLORS[hash % AVATAR_COLORS.length] }}
      className={`${className} grid shrink-0 place-items-center rounded-full font-display font-semibold text-accent-ink`}
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}

export default function Guestbook() {
  if (!guestbookReady) return null;
  return <GuestbookSection />;
}

function GuestbookSection() {
  const root = useRef<HTMLElement>(null);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [newId, setNewId] = useState<number | null>(null);

  useEffect(() => {
    listEntries()
      .then(setEntries)
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    if (!photo) return setPreview(null);
    const src = URL.createObjectURL(photo);
    setPreview(src);
    return () => URL.revokeObjectURL(src);
  }, [photo]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.gb-heading', { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.gb-heading', start: 'top 85%' } });
        gsap.from('.gb-fade', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.gb-body', start: 'top 85%' } });
      });
    },
    { scope: root },
  );

  // Setelah pesan dimuat, tinggi halaman berubah: kartu masuk bergantian dan posisi animasi lain dihitung ulang.
  const loaded = entries !== null;
  useGSAP(
    () => {
      if (!loaded) return;
      if (window.matchMedia(MOTION_OK).matches) {
        gsap.from('.gb-entry', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.gb-list', start: 'top 85%' } });
      }
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [loaded] },
  );

  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > PHOTO_MAX_MB * 1024 * 1024) {
      setPhotoError(`Ukuran foto maksimal ${PHOTO_MAX_MB}MB.`);
      return;
    }
    setPhotoError('');
    setPhoto(file);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Kolom tersembunyi ini hanya diisi oleh bot spam.
    if (new FormData(e.currentTarget).get('website')) return;
    if (!name.trim() || !message.trim()) return;

    setStatus('sending');
    try {
      const avatar = photo ? await toAvatar(photo) : null;
      const entry = await addEntry(name.trim(), message.trim(), avatar);
      setEntries((prev) => {
        const list = prev ?? [];
        const pinned = list.filter((m) => m.is_pinned);
        return [...pinned, entry, ...list.filter((m) => !m.is_pinned)];
      });
      setNewId(entry.id);
      setMessage('');
      setPhoto(null);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  const label = 'mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-muted';
  const field =
    'w-full rounded-2xl border border-line bg-bg/60 px-5 py-4 text-ink placeholder:text-muted/60 transition-colors duration-300 hover:border-white/20 focus:border-accent focus:outline-none';
  const recent = entries?.slice(0, 5) ?? [];

  return (
    <section ref={root} id="pesan" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-accent/[0.07] blur-[120px]" />

      <SectionLabel>Comment</SectionLabel>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h2 className="line-mask">
          <span className="gb-heading block font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl">
            Tinggalkan <em className="font-light">pesan</em><span className="text-accent">.</span>
          </span>
        </h2>
        {recent.length > 0 && (
          <div className="gb-fade flex items-center gap-4">
            <div className="flex -space-x-3">
              {recent.map((m) => (
                <Avatar key={m.id} name={m.name} src={m.avatar_url} className="h-10 w-10 text-sm ring-2 ring-bg" />
              ))}
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
              <span className="text-ink">{entries!.length}</span> pesan
            </p>
          </div>
        )}
      </div>

      <div className="gb-body relative mt-16 grid gap-10 lg:grid-cols-12 lg:items-start">
        <form
          onSubmit={submit}
          onPointerMove={spotlight}
          className="gb-fade spotlight relative overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-28 lg:col-span-5"
        >
          <h3 className="flex items-center gap-3 font-display text-2xl font-semibold">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-raised text-accent">
              <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
            </span>
            Comment
          </h3>

          <div className="mt-8 flex items-center gap-5">
            <span className="relative">
              {preview ? (
                <img src={preview} alt="Pratinjau foto profil" className="h-20 w-20 rounded-full object-cover ring-2 ring-accent" />
              ) : (
                <span className="grid h-20 w-20 place-items-center rounded-full border border-dashed border-white/20 bg-raised text-muted">
                  {name.trim() ? <Avatar name={name} className="h-full w-full text-3xl" /> : <ImagePlus className="h-6 w-6" strokeWidth={1.5} />}
                </span>
              )}
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  aria-label="Hapus foto"
                  className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-ink text-bg transition-colors hover:bg-accent"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
            <span>
              <label className="btn-ghost cursor-pointer !px-4 !py-2.5 focus-within:border-accent">
                <ImagePlus className="h-4 w-4" />
                {photo ? 'Ganti foto' : 'Pilih foto profil'}
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickPhoto} className="sr-only" />
              </label>
              <span className={`mt-2 block text-xs ${photoError ? 'text-red-400' : 'text-muted'}`}>
                {photoError || `Opsional · JPG, PNG, WEBP · maks ${PHOTO_MAX_MB}MB`}
              </span>
            </span>
          </div>

          <div className="mt-6">
            <label htmlFor="gb-name" className={label}>
              Nama <span className="text-accent">*</span>
            </label>
            <input
              id="gb-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX}
              required
              placeholder="Nama kamu"
              autoComplete="name"
              className={field}
            />
          </div>

          <div className="mt-5">
            <label htmlFor="gb-message" className={label}>
              Pesan <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <textarea
                id="gb-message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                maxLength={MESSAGE_MAX}
                required
                rows={5}
                placeholder="Tulis pesanmu…"
                className={`${field} resize-none pb-10`}
              />
              <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[11px] text-muted tabular-nums">
                {message.length}/{MESSAGE_MAX}
              </span>
            </div>
          </div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <button type="submit" disabled={status === 'sending'} className="btn-accent group mt-6 w-full justify-center py-4 disabled:opacity-60">
            {status === 'sending' ? 'Mengirim…' : 'Kirim pesan'}
            {status === 'sending' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
            )}
          </button>
          <p aria-live="polite" className="mt-3 text-center text-sm text-red-400 empty:mt-0">
            {status === 'error' && 'Pesan gagal terkirim. Coba lagi sebentar lagi.'}
          </p>
        </form>

        <div className="gb-fade lg:col-span-7">
          {loadError ? (
            <EmptyState>Pesan belum bisa dimuat. Coba muat ulang halaman.</EmptyState>
          ) : !entries ? (
            <EmptyState>
              <Loader2 className="h-5 w-5 animate-spin" /> Memuat pesan…
            </EmptyState>
          ) : entries.length === 0 ? (
            <EmptyState>
              <MessageCircle className="h-5 w-5 text-accent" /> Belum ada pesan. Jadilah yang pertama!
            </EmptyState>
          ) : (
            <ul className="gb-list scroll-thin -mr-2 flex max-h-[44rem] flex-col gap-3 overflow-y-auto pr-2">
              {entries.map((m) => (
                <li
                  key={m.id}
                  className={`gb-entry group rounded-[1.5rem] border p-5 transition-colors duration-500 sm:p-6 ${
                    m.is_pinned ? 'border-accent/40 bg-accent/[0.06]' : 'border-line bg-surface/70 hover:border-white/20'
                  } ${m.id === newId ? 'motion-safe:animate-[rise-in_0.9s_cubic-bezier(.16,1,.3,1)]' : ''}`}
                >
                  {m.is_pinned && (
                    <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                      <Pin className="h-3.5 w-3.5" /> Disematkan
                    </p>
                  )}
                  <div className="flex gap-4">
                    <Avatar name={m.name} src={m.avatar_url} className="h-11 w-11 text-base" />
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="font-display text-lg font-semibold">{m.name}</span>
                        <time dateTime={m.created_at} title={dateFmt.format(new Date(m.created_at))} className="font-mono text-[11px] text-muted">
                          {timeAgo(m.created_at)}
                        </time>
                      </p>
                      <p className="mt-2 whitespace-pre-line break-words leading-relaxed text-ink/80">{m.message}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex min-h-48 items-center justify-center gap-3 rounded-[2rem] border border-dashed border-line px-6 text-center text-muted">
      {children}
    </p>
  );
}
