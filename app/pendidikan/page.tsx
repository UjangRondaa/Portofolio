import type { Metadata } from 'next';
import Education from '@/components/Education';

export const metadata: Metadata = { title: 'Pendidikan' };

export default function Page() {
  return (
    <main className="pt-6 sm:pt-16 lg:pt-32">
      <Education />
    </main>
  );
}
