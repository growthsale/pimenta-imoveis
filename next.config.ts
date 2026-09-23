import type { NextConfig } from "next";

/**
 * O build normal (npm run dev / npm run build) continua sendo o app Next completo.
 *
 * Com NEXT_PUBLIC_BASE_PATH definido, o build vira um export estatico — usado
 * para publicar a home no GitHub Pages, que serve o site a partir de um
 * subcaminho (/<repo>/) e nao roda o otimizador de imagens do Next.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = basePath
  ? {
      output: "export",
      basePath,
      assetPrefix: basePath,
      images: { unoptimized: true },
      trailingSlash: true,
    }
  : {};

export default nextConfig;
