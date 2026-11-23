import type { Metadata } from 'next';
import About from '@/components/About';

export const metadata: Metadata = { title: 'Tentang' };

export default function Page() {
  return (
    <main className="sm:pt-8 lg:pt-20">
      <About />
    </main>
  );
}
