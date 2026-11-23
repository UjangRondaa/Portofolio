// Logo untuk setiap alat di bagian Keahlian.
// Logo merek diambil dari paket simple-icons (disimpan lokal, tanpa CDN).
// Untuk konsep yang tidak punya logo resmi, dipakai ikon Lucide sebagai pengganti.
import {
  siExpress,
  siFigma,
  siGit,
  siGithub,
  siGsap,
  siJsonwebtokens,
  siJupyter,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons';
import { Network, Pickaxe, Scissors, SquareCode, TreePine, Webhook, type LucideIcon } from 'lucide-react';

const BRANDS: Record<string, SimpleIcon> = {
  'Node.js': siNodedotjs,
  Express: siExpress,
  NestJS: siNestjs,
  MySQL: siMysql,
  JWT: siJsonwebtokens,
  'Next.js': siNextdotjs,
  React: siReact,
  TypeScript: siTypescript,
  'Tailwind CSS': siTailwindcss,
  GSAP: siGsap,
  Python: siPython,
  Jupyter: siJupyter,
  Git: siGit,
  GitHub: siGithub,
  npm: siNpm,
  Figma: siFigma,
};

// Logo VS Code dan CapCut tidak ada di simple-icons, jadi pakai ikon pengganti.
const FALLBACKS: Record<string, { icon: LucideIcon; color: string }> = {
  CapCut: { icon: Scissors, color: '#fff1f6' },
  'REST API': { icon: Webhook, color: '#2ee6d6' },
  'VS Code': { icon: SquareCode, color: '#3ea6f5' },
  'Random Forest': { icon: TreePine, color: '#4ade80' },
  CNN: { icon: Network, color: '#9b5cff' },
  'Data Mining': { icon: Pickaxe, color: '#ffa53d' },
};

// Logo yang warnanya terlalu gelap (Express, Next.js, GitHub, JWT) tidak kelihatan
// di latar gelap, jadi warnanya diganti mengikuti warna teks.
function isTooDark(hex: string) {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
}

export function ToolIcon({ name, className = 'h-3.5 w-3.5' }: { name: string; className?: string }) {
  // Logo Adobe juga tidak ada di simple-icons, jadi dibuat badge "Pr" ala Premiere Pro.
  if (name === 'Premiere Pro') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#00005b" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#9999ff">
          Pr
        </text>
      </svg>
    );
  }
  const brand = BRANDS[name];
  if (brand) {
    const color = isTooDark(brand.hex) ? 'currentColor' : `#${brand.hex}`;
    return (
      <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <path d={brand.path} />
      </svg>
    );
  }
  const fallback = FALLBACKS[name];
  if (fallback) {
    const Icon = fallback.icon;
    return <Icon className={className} style={{ color: fallback.color }} strokeWidth={2} aria-hidden="true" />;
  }
  return null;
}
