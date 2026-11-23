-- Jalankan di Supabase: Dashboard → SQL Editor → New query → tempel → Run.
-- Aman dijalankan ulang, termasuk kalau versi lama file ini sudah pernah dijalankan.

-- Tabel pesan ------------------------------------------------------------------
create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 1 and 40),
  message text not null check (char_length(trim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.guestbook add column if not exists avatar_url text;
-- Pesan yang disematkan tampil paling atas. Ubah lewat Table Editor.
alter table public.guestbook add column if not exists is_pinned boolean not null default false;

-- Foto profil hanya boleh berasal dari bucket buku tamu di project ini.
alter table public.guestbook drop constraint if exists guestbook_avatar_url_check;
alter table public.guestbook add constraint guestbook_avatar_url_check
  check (avatar_url is null or avatar_url like '%/storage/v1/object/public/guestbook-avatars/%');

alter table public.guestbook enable row level security;

-- Pengunjung boleh membaca semua pesan dan menulis pesan baru,
-- tapi tidak bisa mengubah, menghapus, atau menyematkan pesan.
drop policy if exists "Pesan bisa dibaca semua orang" on public.guestbook;
create policy "Pesan bisa dibaca semua orang" on public.guestbook
  for select to anon using (true);
drop policy if exists "Pengunjung bisa menulis pesan" on public.guestbook;
create policy "Pengunjung bisa menulis pesan" on public.guestbook
  for insert to anon with check (true);

revoke insert, update, delete on public.guestbook from anon;
grant select on public.guestbook to anon;
grant insert (name, message, avatar_url) on public.guestbook to anon;

-- Penyimpanan foto profil ------------------------------------------------------
-- Bucket publik, maksimal 1MB per file, hanya gambar.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guestbook-avatars', 'guestbook-avatars', true, 1048576, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- Pengunjung hanya boleh mengunggah foto baru, tidak bisa menimpa atau menghapus.
drop policy if exists "Pengunjung bisa mengunggah foto profil" on storage.objects;
create policy "Pengunjung bisa mengunggah foto profil" on storage.objects
  for insert to anon with check (bucket_id = 'guestbook-avatars');
