import { guestbookReady } from './guestbook';

// label: Bahasa Indonesia (footer), labelEn: Bahasa Inggris (menu garis tiga & transisi halaman).
export type NavLink = { href: string; label: string; labelEn: string };

// Halaman yang muncul di menu dan footer.
export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Beranda', labelEn: 'Home' },
  { href: '/tentang', label: 'Tentang', labelEn: 'About' },
  { href: '/proyek', label: 'Proyek', labelEn: 'Projects' },
  { href: '/keahlian', label: 'Keahlian', labelEn: 'Skills' },
  { href: '/pendidikan', label: 'Pendidikan', labelEn: 'Education' },
  { href: '/sertifikat', label: 'Sertifikat', labelEn: 'Certificates' },
  ...(guestbookReady ? [{ href: '/pesan', label: 'Comment', labelEn: 'Comment' }] : []),
  { href: '/kontak', label: 'Kontak', labelEn: 'Contact' },
];

export function labelFor(path: string) {
  return NAV_LINKS.find((l) => l.href === path)?.labelEn ?? '';
}
