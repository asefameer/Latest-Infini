import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrinitySection from "@/components/TrinitySection";
import GrainOverlay from "@/components/GrainOverlay";
import SmoothScroll from "@/components/SmoothScroll";
import GlobalSparkles from "@/components/GlobalSparkles";
import ScrollReveal from "@/components/ScrollReveal";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState("ground-zero");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["ground-zero", "the-trinity", "editions", "encounter"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen">
        <SplashScreen isVisible={showSplash} />
        {!showSplash && (
          <>
            <GrainOverlay />
            <GlobalSparkles />
            <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
            <HeroSection onNavigate={handleNavigate} />

            {/* Trinity - slightly lighter bg */}
            <div
              className="transition-colors duration-1000"
              style={{ background: "hsl(var(--section-mid))" }}
            >
              <TrinitySection />
            </div>

            {/* Editions - back to dark */}
            <section
              id="editions"
              className="min-h-screen flex items-center justify-center transition-colors duration-1000"
              style={{ background: "hsl(var(--section-dark))" }}
            >
              <ScrollReveal className="text-center" offsetY={60} blur={10}>
                <h2 className="font-display text-5xl font-bold text-foreground mb-4">Editions</h2>
                <p className="text-muted-foreground">E-commerce store coming soon</p>
              </ScrollReveal>
            </section>

            {/* Encounter - lighter */}
            <section
              id="encounter"
              className="min-h-screen flex items-center justify-center transition-colors duration-1000"
              style={{ background: "hsl(var(--section-light))" }}
            >
              <ScrollReveal className="text-center" offsetY={60} blur={10}>
                <h2 className="font-display text-5xl font-bold text-foreground mb-4">Encounter</h2>
                <p className="text-muted-foreground">Event ticketing coming soon</p>
              </ScrollReveal>
            </section>
          </>
        )}
      </div>
    </SmoothScroll>
  );
};

export default Index;
