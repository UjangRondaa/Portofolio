import type { Metadata } from 'next';
import Skills from '@/components/Skills';

export const metadata: Metadata = { title: 'Keahlian' };

export default function Page() {
  return (
    <main className="sm:pt-8 lg:pt-20">
      <Skills />
    </main>
  );
}
