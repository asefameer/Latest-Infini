import { ShoppingBag, User } from "lucide-react";
import logoVideo from "@/assets/infinity-logo-video.mp4";

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
      <button onClick={() => onNavigate("ground-zero")} className="flex-shrink-0 h-9 w-16 overflow-hidden rounded">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
        >
          <source src={logoVideo} type="video/mp4" />
        </video>
      </button>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full border ${
              activeSection === item.id
                ? "text-foreground border-[hsl(var(--infinity-cyan)/0.35)]"
                : "text-muted-foreground hover:text-foreground border-[hsl(var(--infinity-cyan)/0.12)] hover:border-[hsl(var(--infinity-cyan)/0.25)]"
            }`}
            style={
              activeSection === item.id
                ? {
                    background: "linear-gradient(135deg, hsl(var(--infinity-cyan) / 0.1), hsl(var(--infinity-purple) / 0.06))",
                    boxShadow: "0 0 14px hsl(var(--infinity-cyan) / 0.15), inset 0 0 10px hsl(var(--infinity-cyan) / 0.05)",
                  }
                : {
                    background: "hsl(var(--infinity-cyan) / 0.03)",
                  }
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingBag className="w-5 h-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
