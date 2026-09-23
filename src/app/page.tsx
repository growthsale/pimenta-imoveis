import Hero from "@/components/hero/Hero";
import PropertyShowcase from "@/components/sections/PropertyShowcase";
import FamilyBusiness from "@/components/sections/FamilyBusiness";
import Stats from "@/components/sections/Stats";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <PropertyShowcase />
      <FamilyBusiness />
      <Stats />
      <Newsletter />
    </>
  );
}
