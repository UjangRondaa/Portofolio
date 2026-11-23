import type { Metadata, Viewport } from 'next';
import { Geist, Inter, Inter_Tight } from 'next/font/google';
import Cursor from '@/components/Cursor';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import Preloader from '@/components/Preloader';
import StayInTouch from '@/components/StayInTouch';
import { profile } from '@/lib/content';
import './globals.css';

// Satu grotesk untuk teks & judul, Geist untuk label (mirip Aeonik di lusion.co).
const sans = Inter_Tight({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-inter-tight' });
// Khusus footer: Inter tipis/regular.
const footerFont = Inter({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-inter-footer' });
const mono = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-label' });

export const metadata: Metadata = {
  title: { default: `${profile.name} | ${profile.role}`, template: `%s | ${profile.name}` },
  description: profile.intro,
  openGraph: {
    title: `${profile.name} | Portofolio`,
    description: profile.intro,
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c0716',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable} ${footerFont.variable}`}>
      <body>
        <Preloader />
        <Cursor />
        <Navbar />
        <PageTransition />
        {/* Isi halaman berada di atas footer; footer tersingkap saat halaman digulir sampai habis. */}
        <div id="page-content" className="relative z-10 bg-bg">
          {children}
          <StayInTouch />
        </div>
        <Footer />
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[80] opacity-[0.05]" />
      </body>
    </html>
  );
}
