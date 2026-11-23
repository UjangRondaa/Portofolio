// Buku tamu disimpan di tabel `guestbook` Supabase (lihat supabase/guestbook.sql).
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Tanpa kunci di .env.local, bagian buku tamu tidak ditampilkan.
const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
export const guestbookReady = supabase !== null;

export const NAME_MAX = 40;
export const MESSAGE_MAX = 500;
export const PHOTO_MAX_MB = 5;
const AVATAR_BUCKET = 'guestbook-avatars';
const AVATAR_SIZE = 256;

export type Entry = {
  id: number;
  name: string;
  message: string;
  avatar_url: string | null;
  is_pinned: boolean;
  created_at: string;
};

export async function listEntries(): Promise<Entry[]> {
  const { data, error } = await supabase!
    .from('guestbook')
    .select('id, name, message, avatar_url, is_pinned, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function addEntry(name: string, message: string, avatar: Blob | null): Promise<Entry> {
  const avatar_url = avatar ? await uploadAvatar(avatar) : null;
  const { data, error } = await supabase!.from('guestbook').insert({ name, message, avatar_url }).select().single();
  if (error) throw error;
  return data;
}

async function uploadAvatar(avatar: Blob): Promise<string> {
  const path = `${crypto.randomUUID()}.${avatar.type.split('/')[1]}`;
  const bucket = supabase!.storage.from(AVATAR_BUCKET);
  const { error } = await bucket.upload(path, avatar, { contentType: avatar.type, cacheControl: '31536000' });
  if (error) throw error;
  return bucket.getPublicUrl(path).data.publicUrl;
}

// Foto dipotong persegi di tengah lalu diperkecil, supaya ringan dan pas di avatar bulat.
export async function toAvatar(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  const side = Math.min(img.width, img.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = AVATAR_SIZE;
  canvas.getContext('2d')!.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
  img.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Foto tidak bisa diproses'))), 'image/webp', 0.85),
  );
}
