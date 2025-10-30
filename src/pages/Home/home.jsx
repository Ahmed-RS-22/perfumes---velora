import { AboutSection } from "@/components/home/About";
import { ContactSection } from "@/components/home/Contacts";
import { FeaturesSection } from "@/components/home/features";
import { HeroSection } from "@/components/home/Hero";
export const Home = () => {
  return (
    <section className="page">
        {/* hero section */}
      <HeroSection />
      {/* features section */}
        <FeaturesSection/>
      {/* about section */}
        <AboutSection/>
      {/* Contact section */}
        <ContactSection/>
    </section>
  );
};
