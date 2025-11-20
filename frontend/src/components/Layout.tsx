// src/components/Layout.tsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Aurora from "./Aurora";

const REPORTLY_LOGIN_URL =
  import.meta.env.VITE_REPORTLY_LOGIN_URL || "http://localhost:5014/reportly";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Force Tailwind "background" tokens to dark so bg-background / bg-card never flash white
  useEffect(() => {
    const root = document.documentElement;

    const prevBackground = root.style.getPropertyValue("--background");
    const prevCard = root.style.getPropertyValue("--card");
    const prevPopover = root.style.getPropertyValue("--popover");
    const prevMuted = root.style.getPropertyValue("--muted");

    // Typical shadcn dark palette values (HSL triplets)
    root.style.setProperty("--background", "222.2 84% 4.9%"); // very dark slate
    root.style.setProperty("--card", "222.2 84% 7%"); // slightly lighter than background
    root.style.setProperty("--popover", "222.2 84% 7%");
    root.style.setProperty("--muted", "217.2 32.6% 17.5%");

    return () => {
      if (prevBackground) root.style.setProperty("--background", prevBackground);
      if (prevCard) root.style.setProperty("--card", prevCard);
      if (prevPopover) root.style.setProperty("--popover", prevPopover);
      if (prevMuted) root.style.setProperty("--muted", prevMuted);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location.pathname]);

  const openReportly = () => {
    window.open(REPORTLY_LOGIN_URL, "_blank", "noopener,noreferrer");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      {/* Persistent global background (stays across page switches) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Aurora wash */}
        <Aurora
          colorStops={["#00ffcc", "#4DD0E1", "#00ffcc"]}
          blend={0.45}
          amplitude={1.0}
          speed={0.6}
        />
        {/* Dark radial vignette to keep everything deep + avoid bright flashes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.85),_rgba(2,6,23,1))]" />
      </div>

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-card/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-b from-[#020617]/95 via-[#020617]/70 to-transparent"
        }`}
      >
        <div className="relative">
          {/* subtle glow line */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60" />
          <nav className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-3">
              {/* Logo + tiny tag */}
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/logo-wht-hrzntl.png"
                  alt="VibeOps Logo"
                  className="h-9 md:h-10 w-auto object-contain"
                />
                <span className="hidden sm:inline-flex text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground/80">
                  Technologies Inc.
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className={`nav-link relative ${
                    isActive("/") ? "text-primary" : ""
                  }`}
                >
                  About
                  {isActive("/") && (
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary/80" />
                  )}
                </Link>
                <Link
                  to="/team"
                  className={`nav-link relative ${
                    isActive("/team") ? "text-primary" : ""
                  }`}
                >
                  Team
                  {isActive("/team") && (
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary/80" />
                  )}
                </Link>
                <Link
                  to="/services"
                  className={`nav-link relative ${
                    isActive("/services") ? "text-primary" : ""
                  }`}
                >
                  Services
                  {isActive("/services") && (
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary/80" />
                  )}
                </Link>
                <Link
                  to="/case-studies"
                  className={`nav-link relative ${
                    isActive("/case-studies") ? "text-primary" : ""
                  }`}
                >
                  Reviews
                  {isActive("/case-studies") && (
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary/80" />
                  )}
                </Link>
                <Link
                  to="/blog"
                  className={`nav-link relative ${
                    isActive("/blog") ? "text-primary" : ""
                  }`}
                >
                  Blog
                  {isActive("/blog") && (
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary/80" />
                  )}
                </Link>

                <Link
                  to="/contact"
                  className={`nav-link relative ${
                    isActive("/contact") ? "text-primary" : ""
                  }`}
                >
                  Contact
                  {isActive("/contact") && (
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary/80" />
                  )}
                </Link>

                {/* Login / Reportly */}
                <button
                  type="button"
                  onClick={openReportly}
                  className="btn-primary flex items-center gap-1 text-sm"
                >
                  Login
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-full border border-border/60 bg-background/70 shadow-sm"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden mt-3 pb-4 space-y-1 -mx-4 px-4 bg-card/95 backdrop-blur-sm border-t border-border/70 pt-3">
                <Link
                  to="/"
                  className="block py-2.5 px-4 rounded-lg hover:bg-accent/10 text-sm"
                >
                  About
                </Link>
                <Link
                  to="/services"
                  className="block py-2.5 px-4 rounded-lg hover:bg-accent/10 text-sm"
                >
                  Services
                </Link>
                <Link
                  to="/case-studies"
                  className="block py-2.5 px-4 rounded-lg hover:bg-accent/10 text-sm"
                >
                  Case Studies
                </Link>
                <Link
                  to="/contact"
                  className="block py-2.5 px-4 rounded-lg hover:bg-accent/10 text-sm"
                >
                  Contact
                </Link>
                <Link
                  to="/team"
                  className="block py-2.5 px-4 rounded-lg hover:bg-accent/10 text-sm"
                >
                  Team
                </Link>
                <Link
                  to="/blog"
                  className="block py-2.5 px-4 rounded-lg hover:bg-accent/10 text-sm"
                >
                  Blog
                </Link>

                <div className="border-t border-border my-3" />

                {/* Mobile Login / Reportly */}
                <button
                  onClick={openReportly}
                  className="block w-full text-left py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90"
                >
                  Login / Reportly
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 relative z-10">{children}</main>

      {/* Footer */}
      <footer className="bg-card/90 border-t border-border mt-20 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img
                src="/logo-wht-hrzntl.png"
                alt="VibeOps Logo"
                className="h-9 md:h-10 w-auto object-contain mb-3"
              />
              <p className="text-muted-foreground text-sm">
                Built by Engineers – For Engineers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link
                  to="/"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
                <Link
                  to="/services"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Services
                </Link>
                <Link
                  to="/case-studies"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Case Studies
                </Link>
                <Link
                  to="/contact"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
                <Link
                  to="/blog"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Book Your Free Vibe Check
              </p>
              <Link to="/contact" className="btn-primary inline-block">
                Get Started
              </Link>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} VibeOps Technologies Inc. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
