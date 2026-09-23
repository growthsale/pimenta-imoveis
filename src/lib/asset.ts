/**
 * Prefixa um arquivo de /public com o basePath do build.
 *
 * O Next aplica o basePath sozinho em <Link> e nos metadados, mas nao em
 * caminhos passados como string para <video src> nem para o next/image quando
 * images.unoptimized esta ligado — que e exatamente o caso do export estatico
 * publicado no GitHub Pages, servido a partir de /<repo>/.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path || !path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
