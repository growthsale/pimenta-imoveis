import Link from "next/link";
import HeroVideo from "./HeroVideo";
import HeroSearch from "./HeroSearch";
import { asset } from "@/lib/asset";

/**
 * Hero do Jardins & Co (.header-container + .header-title + .header-button)
 * com video em loop no lugar do carrossel de banners.
 *
 * O padding superior compensa a altura do header fixo (64px / 80px), para que
 * o conteudo fique centrado no espaco que sobra e nao por baixo da barra.
 */
export default function Hero() {
  return (
    <section className="ds-hero">
      <HeroVideo src={asset("/video/hero-motion.mp4")} />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 pt-16 pb-[max(20px,env(safe-area-inset-bottom))] md:pt-20">
        <h1 className="hero-title max-w-[18ch]">
          {"Onde você imagina\nmorar"}
        </h1>

        <Link
          href="/busca"
          className="mt-6 block text-[14px] font-medium text-white decoration-brand decoration-2 underline-offset-8 transition hover:underline md:mt-[30px]"
        >
          Saiba mais
        </Link>

        <div className="mt-8 flex w-full justify-center md:mt-14">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
