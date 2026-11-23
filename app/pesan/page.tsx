import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Guestbook from '@/components/Guestbook';
import { guestbookReady } from '@/lib/guestbook';

export const metadata: Metadata = { title: 'Comment' };

export default function Page() {
  if (!guestbookReady) notFound();
  return (
    <main className="sm:pt-8 lg:pt-20">
      <Guestbook />
    </main>
  );
}
