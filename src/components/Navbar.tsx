import { ShoppingBag, User } from "lucide-react";
import NavInfinityLogo from "@/components/NavInfinityLogo";
import MagneticButton from "@/components/MagneticButton";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "ground-zero", label: "Ground Zero" },
  { id: "the-trinity", label: "The Trinity" },
  { id: "editions", label: "Editions" },
  { id: "encounter", label: "Encounter" },
];

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-background/60 backdrop-blur-xl border-b border-border/30">
      {/* Logo */}
      <MagneticButton onClick={() => onNavigate("ground-zero")} className="flex-shrink-0" strength={0.4}>
        <NavInfinityLogo />
      </MagneticButton>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <MagneticButton key={item.id} className="relative group" strength={0.25}>
              {/* Animated gradient border glow */}
              <div
                className="absolute -inset-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)), hsl(var(--infinity-pink)), hsl(var(--infinity-cyan)))",
                  backgroundSize: "300% 300%",
                  animation: "gradient-shift 3s ease infinite",
                  filter: "blur(3px)",
                  ...(isActive ? { opacity: 1 } : {}),
                }}
              />
              {/* Visible gradient border */}
              <div
                className="absolute -inset-[1px] rounded-full transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)), hsl(var(--infinity-pink)), hsl(var(--infinity-cyan)))",
                  backgroundSize: "300% 300%",
                  animation: "gradient-shift 3s ease infinite",
                  opacity: isActive ? 0.8 : 0.2,
                }}
              />
              <button
                onClick={() => onNavigate(item.id)}
                className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                style={{
                  background: isActive
                    ? "hsl(var(--background) / 0.85)"
                    : "hsl(var(--background) / 0.7)",
                }}
              >
                {item.label}
              </button>
            </MagneticButton>
          );
        })}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <MagneticButton className="text-muted-foreground hover:text-foreground transition-colors" strength={0.4}>
          <ShoppingBag className="w-5 h-5" />
        </MagneticButton>
        <MagneticButton className="text-muted-foreground hover:text-foreground transition-colors" strength={0.4}>
          <User className="w-5 h-5" />
        </MagneticButton>
      </div>
    </nav>
  );
};

export default Navbar;
