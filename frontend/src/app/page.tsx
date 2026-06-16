import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import Experience from "@/components/sections/Experience";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import { getSiteData } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getSiteData();

  return (
    <SmoothScroll>
      <Navbar name={data.hero.name} />
      <main>
        <Hero hero={data.hero} />
        <About about={data.about} />
        {data.services.length > 0 && <Services services={data.services} />}
        <Works works={data.works} categories={data.categories} />
        {data.experience.length > 0 && <Experience items={data.experience} />}
        <Testimonials items={data.testimonials} />
        <Contact socials={data.socials} />
      </main>
      <Footer name={data.hero.name} socials={data.socials} />
    </SmoothScroll>
  );
}
