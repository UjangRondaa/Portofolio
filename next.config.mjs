import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Folder ini berdiri sendiri; cegah Next menebak root dari lockfile di folder induk.
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default nextConfig;
