import type { Metadata } from 'next';
import Certificates from '@/components/Certificates';

export const metadata: Metadata = { title: 'Sertifikat' };

export default function Page() {
  return (
    <main className="sm:pt-8 lg:pt-20">
      <Certificates />
    </main>
  );
}
