// Semua isi portofolio ada di file ini. Ubah teks di sini, tampilan akan ikut berubah.
import {
  BrainCircuit,
  Clapperboard,
  Dumbbell,
  HeartPulse,
  LayoutTemplate,
  ScanFace,
  Server,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { Brand } from '@/components/BrandIcon';

export const profile = {
  name: 'Ahmad Rizal Dwi Nugraha',
  // Peran di hero dipecah menjadi dua baris.
  roleLines: ['AHMAD RIZAL', 'DWI NUGRAHA'] as const,
  nickname: 'ijal',
  role: 'Backend & Full-stack Developer',
  intro:
    'Mahasiswa Informatika di Universitas AMIKOM Yogyakarta. Saya membangun aplikasi web dari server sampai tampilan, dan sedang mendalami data serta AI Engineering.',
  about:
    'Saya adalah seorang perantau yang sedang menempuh pendidikan di Universitas AMIKOM Yogyakarta. Saya suka mempelajari hal-hal baru, baru baru ini saya sedang mendalami data dan AI Engineering. Saya juga suka membangun web agar mempermudah  pekerjaan sehari-hari. Suka bermain game dan melakukan aktivitas sehat seperti Gym',
  location: 'Yogyakarta, Indonesia',
  timeZone: 'Asia/Jakarta',
  // Isi email supaya tombol kontak membuka email. Jika kosong, tombol mengarah ke GitHub.
  email: 'ahmadrizaldwinugrahaa@gmail.com',
  photo: '/foto-about.jpg',
};

export type Social = { label: string; brand: Brand; handle: string; href: string };

// Kosongkan href untuk menyembunyikan tautan.
export const socials: Social[] = [
  { label: 'GitHub', brand: 'github', handle: '@UjangRondaa', href: 'https://github.com/UjangRondaa' },
  { label: 'LinkedIn', brand: 'linkedin', handle: '', href: '' },
  { label: 'Instagram', brand: 'instagram', handle: '@zallngrii', href: 'https://instagram.com/zallngrii' },
];

export type Project = {
  title: string;
  category: string;
  year: string;
  desc: string;
  tags: string[];
  href: string;
  icon: LucideIcon;
  color: string;
};

export const projects: Project[] = [
  {
    title: 'Klasifikasi Emosi Wajah',
    category: 'Final Project Kecerdasan Buatan',
    year: '2026',
    desc: 'Model Convolutional Neural Network (CNN) yang mengenali emosi seseorang dari gambar wajahnya.',
    tags: ['Deep Learning', 'CNN', 'Computer Vision'],
    href: 'https://github.com/UjangRondaa/Final-Project-AI',
    icon: ScanFace,
    color: '#8B5CF6',
  },
  {
    title: 'Prediksi Status Obesitas',
    category: 'UTS Data Mining',
    year: '2026',
    desc: 'Sistem yang memprediksi status obesitas seseorang menggunakan algoritma Random Forest.',
    tags: ['Machine Learning', 'Random Forest', 'Data Mining'],
    href: 'https://huggingface.co/spaces/ijalkeren/obesityscan',
    icon: HeartPulse,
    color: '#F97316',
  },
  {
    title: 'Gym Data',
    category: 'Proyek pribadi',
    year: '2026',
    desc: 'Mengajarkan tentang menggunakan alat Gym yang baik dan benar,',
    tags: ['Node.js', 'Express', 'MySQL'],
    href: 'https://ujangrondaa.github.io/repdata-gym/',
    icon: Dumbbell,
    color: '#2EE6D6',
  },
  {
    title: 'Dompet Rumah',
    category: 'Proyek pribadi',
    year: '2026',
    desc: 'Aplikasi keuangan rumah tangga untuk mencatat transaksi, mengatur anggaran, dan memantau target tabungan bersama anggota keluarga.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    href: 'https://ujangrondaa.github.io/Money-management/#/overview',
    icon: Wallet,
    color: '#22C55E',
  },
];

export type SkillGroup = {
  title: string;
  desc: string;
  icon: LucideIcon;
  items: string[];
  // Opsional: alat yang masih didalami. Tampil dengan garis putus-putus dan label "belajar".
  learning?: string[];
};

export const skills: SkillGroup[] = [
  {
    title: 'Backend',
    desc: 'Merancang API, autentikasi, dan penyimpanan data.',
    icon: Server,
    items: ['Node.js', 'Express', 'NestJS', 'MySQL', 'REST API', 'JWT'],
  },
  {
    title: 'Frontend',
    desc: 'Membangun antarmuka yang cepat dan responsif.',
    icon: LayoutTemplate,
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP'],
  },
  {
    title: 'Data & AI',
    desc: 'Mengolah data dan melatih model machine learning.',
    icon: BrainCircuit,
    items: ['Python', 'Jupyter', 'Random Forest', 'CNN', 'Data Mining'],
  },
  {
    title: 'Alat kerja',
    desc: 'Yang saya pakai setiap hari.',
    icon: Wrench,
    items: ['Git', 'GitHub', 'VS Code', 'npm'],
  },
  {
    title: 'Editing & Desain',
    desc: 'Mengedit video dan merancang tampilan.',
    icon: Clapperboard,
    items: ['CapCut', 'Premiere Pro', 'Figma'],
    learning: ['Figma'],
  },
];

export type Education = {
  period: string;
  school: string;
  // Opsional: logo sekolah di public/pendidikan, misalnya '/pendidikan/amikom.png'.
  // Kosongkan jika belum ada; akan tampil ikon toga sebagai pengganti.
  logo?: string;
  // Opsional: kosongkan jika tidak ingin ditampilkan.
  degree?: string;
  place: string;
  desc?: string;
  // Opsional: mata kuliah, IPK, organisasi, atau prestasi. Kosongkan jika tidak ada.
  highlights?: string[];
};

// Riwayat pendidikan, urutkan dari yang terbaru.
export const education: Education[] = [
  {
    period: '2023 – Sekarang',
    school: 'Universitas AMIKOM Yogyakarta',
    logo: '/pendidikan/amikom.png',
    degree: 'S1 Informatika',
    place: 'Sleman, Yogyakarta',
    desc: 'Mempelajari pemrograman, rekayasa perangkat lunak, data, dan kecerdasan buatan.',
  },
  {
    period: '2020 – 2023',
    school: 'SMA IT Abu Bakar Boarding School',
    logo: '/pendidikan/abubakar.png',
    place: 'Kulon Progo, Yogyakarta',
  },
];

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  hours?: number;
  credentialId: string;
  image: string;
  href: string;
};

// Gambar sertifikat ada di public/sertifikat. Urutkan dari yang terbaru.
export const certificates: Certificate[] = [
  {
    title: 'Belajar Strategi Pengembangan Diri',
    issuer: 'Dicoding Indonesia',
    date: '28 September 2026',
    credentialId: 'JMZVLD3MOXN9',
    image: '/sertifikat/dicoding-pengembangan-diri.jpg',
    href: 'https://www.dicoding.com/certificates/JMZVLD3MOXN9',
  },
  {
    title: 'Memulai Pemrograman dengan Python',
    issuer: 'Dicoding Indonesia',
    date: '24 September 2026',
    hours: 60,
    credentialId: 'MRZMV8D2LZYQ',
    image: '/sertifikat/dicoding-python.jpg',
    href: 'https://www.dicoding.com/certificates/MRZMV8D2LZYQ',
  },
  {
    title: 'Belajar Dasar AI',
    issuer: 'Dicoding Indonesia',
    date: '13 September 2026',
    hours: 10,
    credentialId: '81P2K3G9QXOY',
    image: '/sertifikat/dicoding-dasar-ai.jpg',
    href: 'https://www.dicoding.com/certificates/81P2K3G9QXOY',
  },
  {
    title: 'Cabor esports Tekken 8',
    issuer: 'Pekan Olahraga Mahasiswa Daerah (POMDA) DIY',
    date: '08 November 2026',
    credentialId: '-',
    image: '/sertifikat/sertifikat-pomda.jpg',
    href: '/sertifikat/sertifikat-pomda.jpg',
  },
];
