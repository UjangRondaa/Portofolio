import type { Metadata } from 'next';
import Contact from '@/components/Contact';

export const metadata: Metadata = { title: 'Kontak' };

export default function Page() {
  return (
    <main className="pt-6 sm:pt-16 lg:pt-32">
      <Contact />
    </main>
  );
}
