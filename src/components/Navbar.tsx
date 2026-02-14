import { ShoppingBag, User } from "lucide-react";
import infinityLogo from "@/assets/infinity-logo.jpg";

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
      <button onClick={() => onNavigate("ground-zero")} className="flex-shrink-0">
        <img src={infinityLogo} alt="Infinity" className="h-7 w-auto" />
      </button>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
              activeSection === item.id
                ? "bg-border text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {/* Gradient border for active state */}
            {activeSection === item.id && (
              <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-infinity-cyan to-infinity-purple -z-10">
                <span className="block w-full h-full rounded-full bg-muted" />
              </span>
            )}
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
