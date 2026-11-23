'use client';

import { useState } from 'react';
import { Check, Loader2, Send } from 'lucide-react';
import { profile } from '@/lib/content';

// Pesan dikirim ke email lewat Web3Forms (kunci di .env.local).
// Tanpa kunci, form membuka aplikasi email pengunjung dengan pesan yang sudah terisi.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Kotak centang tersembunyi ini hanya diisi oleh bot spam.
    if (new FormData(e.currentTarget).get('botcheck')) return;

    const subject = `Pesan baru dari ${name} lewat portofolio`;
    if (!WEB3FORMS_KEY) {
      const body = `${message}\n\n${name} (${email})`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: 'Portofolio', name, email, message }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setName('');
      setEmail('');
      setMessage('');
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
    }
  };

  const label = 'mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-muted';
  const field =
    'w-full rounded-2xl border border-line bg-surface px-5 py-4 text-ink placeholder:text-muted/60 transition-colors duration-300 hover:border-white/20 focus:border-accent focus:outline-none';

  return (
    <form onSubmit={submit} className="contact-fade">
      <p className="font-display text-2xl font-semibold">
        Hubungi<span className="text-accent">.</span>
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            Nama anda <span className="text-accent">*</span>
          </label>
          <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoComplete="name" placeholder="Nama lengkap" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>
            Email anda <span className="text-accent">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={120}
            autoComplete="email"
            placeholder="nama@email.com"
            className={field}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-message" className={label}>
          Pesan <span className="text-accent">*</span>
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          required
          maxLength={2000}
          rows={5}
          placeholder="Ceritakan ide atau keperluanmu…"
          className={`${field} resize-none`}
        />
      </div>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <button type="submit" disabled={status === 'sending'} className="btn-accent group mt-6 disabled:opacity-60">
        {status === 'sending' ? 'Mengirim…' : status === 'sent' ? 'Terkirim' : 'Send'}
        {status === 'sending' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === 'sent' ? (
          <Check className="h-4 w-4" />
        ) : (
          <Send className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        )}
      </button>
      <p aria-live="polite" className="mt-3 text-sm text-red-400 empty:mt-0">
        {status === 'error' && 'Pesan gagal terkirim. Coba lagi, atau kirim langsung ke email di samping.'}
      </p>
    </form>
  );
}
