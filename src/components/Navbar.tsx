import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import NavInfinityLogo from "@/components/NavInfinityLogo";
import MagneticButton from "@/components/MagneticButton";
import { useCart } from "@/components/CartContext";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "ground-zero", label: "Ground Zero", route: "/" },
  {
    id: "the-trinity", label: "The Trinity", route: "/the-trinity",
    dropdown: [
      { label: "Nova", route: "/the-trinity/nova" },
      { label: "Live the Moment", route: "/the-trinity/live-the-moment" },
      { label: "X-Force", route: "/the-trinity/x-force" },
    ],
  },
  { id: "define-style", label: "Define Your Style", route: "/editions" },
  { id: "encounter", label: "Encounter", route: "/encounter" },
];

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const isHome = location.pathname === "/";

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredDropdown(null), 150);
  };

  const handleNav = (item: typeof navItems[0]) => {
    setMobileOpen(false);
    if (isHome && (item.id === "ground-zero" || item.id === "the-trinity" || item.id === "define-style")) {
      onNavigate(item.id);
    } else {
      navigate(item.route);
    }
  };

  const isActiveRoute = (route: string) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-4 bg-background/60 backdrop-blur-xl border-b border-border/30">
        {/* Logo */}
        <MagneticButton onClick={() => isHome ? onNavigate("ground-zero") : navigate("/")} className="flex-shrink-0" strength={0.4}>
          <NavInfinityLogo />
        </MagneticButton>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = isHome ? activeSection === item.id : isActiveRoute(item.route);
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.id)}
                onMouseLeave={() => item.dropdown && handleMouseLeave()}
              >
                <MagneticButton className="relative group" strength={0.25}>
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
                    onClick={() => handleNav(item)}
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

                {item.dropdown && hoveredDropdown === item.id && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 min-w-[180px] rounded-xl border border-border/40 bg-background/90 backdrop-blur-xl shadow-2xl overflow-hidden"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.dropdown.map((dd) => (
                      <Link
                        key={dd.route}
                        to={dd.route}
                        onClick={() => setHoveredDropdown(null)}
                        className="block w-full text-left px-5 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors duration-200"
                      >
                        {dd.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <MagneticButton className="relative text-muted-foreground hover:text-foreground transition-colors" strength={0.4}>
            <Link to="/cart" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </MagneticButton>
          <MagneticButton className="text-muted-foreground hover:text-foreground transition-colors" strength={0.4}>
            <Link to="/account" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
          </MagneticButton>
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground transition-colors" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-72 h-full bg-card border-l border-border/30 p-6 flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="self-end mb-8 text-muted-foreground hover:text-foreground" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2">
              {navItems.map(item => (
                <div key={item.id}>
                  <button
                    onClick={() => handleNav(item)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      (isHome ? activeSection === item.id : isActiveRoute(item.route)) ? 'text-foreground bg-muted/50' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                  {item.dropdown && (
                    <div className="ml-4 space-y-1 mt-1">
                      {item.dropdown.map(dd => (
                        <Link
                          key={dd.route}
                          to={dd.route}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {dd.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
