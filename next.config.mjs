/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reiner statischer Export -> out/ enthaelt nur HTML, CSS, Assets.
  output: "export",

  // /impressum -> /impressum/index.html, /touchpoint-x -> /touchpoint-x/index.html.
  // Damit bleiben die im Buch gedruckten QR-Code-URLs mit abschliessendem
  // Schraegstrich auf jedem Webserver ohne Rewrite-Regeln erreichbar.
  trailingSlash: true,

  // next/image wird nicht genutzt; Bilder werden vorab per scripts/optimize-images.mjs
  // optimiert. Der Export braucht daher keinen Image-Optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
