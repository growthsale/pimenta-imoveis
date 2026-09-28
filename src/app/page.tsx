import Hero from "@/components/hero/Hero";
import PropertyShowcase from "@/components/sections/PropertyShowcase";
import FamilyBusiness from "@/components/sections/FamilyBusiness";
import Stats from "@/components/sections/Stats";
import Newsletter from "@/components/sections/Newsletter";
import { destaques } from "@/lib/search";

export default async function Home() {
  // resolvido no build (export estatico) ou no servidor — a home nao depende do cliente
  const imoveis = await destaques(6);

  return (
    <>
      <Hero />
      <PropertyShowcase imoveis={imoveis} />
      <FamilyBusiness />
      <Stats />
      <Newsletter />
    </>
  );
}
