import type { Metadata } from 'next';
import Projects from '@/components/Projects';

export const metadata: Metadata = { title: 'Proyek' };

export default function Page() {
  // Section proyek dikunci setinggi layar, jadi butuh ruang lebih untuk nama besar di header.
  return (
    <main className="pt-12 sm:pt-24 lg:pt-36">
      <Projects />
    </main>
  );
}
