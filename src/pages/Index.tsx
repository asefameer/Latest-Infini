import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomepageBanner from "@/components/HomepageBanner";
import TrinitySection from "@/components/TrinitySection";
import DefineStyleSection from "@/components/DefineStyleSection";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState("ground-zero");

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["ground-zero", "the-trinity", "define-style"];
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
    <div className="min-h-screen">
      <SplashScreen isVisible={showSplash} />
      {!showSplash && (
        <>
          <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
          <HeroSection onNavigate={handleNavigate} />
          <HomepageBanner />
          <div
            className="transition-colors duration-1000"
            style={{ background: "hsl(var(--section-mid))" }}
          >
            <TrinitySection />
          </div>
          <DefineStyleSection />
        </>
      )}
    </div>
  );
};

export default Index;
