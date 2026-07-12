import Hero from "@/components/Hero";
import Treatments from "@/components/Treatments";
import Pricing from "@/components/Pricing";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Treatments />
      <Pricing />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
