import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const REPORTLY_LOGIN_URL =
  import.meta.env.VITE_REPORTLY_LOGIN_URL || "http://localhost:5014/reportly";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDemosOpen, setIsMobileDemosOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu + demos on route change
    setIsMenuOpen(false);
    setIsMobileDemosOpen(false);
  }, [location.pathname]);

  const openReportly = () => {
    window.open(REPORTLY_LOGIN_URL, "_blank", "noopener,noreferrer");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-card/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-b from-background/80 via-background/40 to-transparent"
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

                {/* Apps Dropdown */}
                <div className="relative group">
                  <button
                    className="nav-link flex items-center gap-1"
                    type="button"
                  >
                    Demos
                    <span className="inline-block h-1 w-1 rounded-full bg-primary/70" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-4 py-3 border-b border-border/70 text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
                      Sandbox Tools
                    </div>
                    <Link
                      to="/construction-tracker"
                      className="block px-4 py-2.5 hover:bg-accent/10"
                    >
                      Construction Tracker
                    </Link>
                    <Link
                      to="/ai-report-generator"
                      className="block px-4 py-2.5 hover:bg-accent/10"
                    >
                      Report Generator
                    </Link>
                    <Link
                      to="/pipeline"
                      className="block px-4 py-2.5 hover:bg-accent/10"
                    >
                      Pipeline Estimator
                    </Link>
                    <Link
                      to="/roof-demo"
                      className="block px-4 py-2.5 hover:bg-accent/10 rounded-b-xl"
                    >
                      Roofing Estimator
                    </Link>
                  </div>
                </div>

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

                {/* Login dropdown – behaves like Demos */}
                <div className="relative group">
                  <button
                    className="btn-primary flex items-center gap-1"
                    type="button"
                  >
                    Login
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      type="button"
                      onClick={openReportly}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/10 rounded-xl"
                    >
                      Reportly
                    </button>
                  </div>
                </div>
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
              <div className="md:hidden mt-3 pb-4 space-y-1 -mx-4 px-4">
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

                {/* Mobile Demos dropdown */}
                <div className="border-t border-border my-2 pt-1" />
                <button
                  type="button"
                  onClick={() =>
                    setIsMobileDemosOpen((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between py-2.5 px-4 rounded-lg hover:bg-accent/10 text-sm"
                >
                  <span>Demos</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isMobileDemosOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileDemosOpen && (
                  <div className="ml-4 pl-3 border-l border-border/70 space-y-1">
                    <Link
                      to="/construction-tracker"
                      className="block py-2 px-3 rounded-lg hover:bg-accent/10 text-sm"
                    >
                      Construction Tracker
                    </Link>
                    <Link
                      to="/ai-report-generator"
                      className="block py-2 px-3 rounded-lg hover:bg-accent/10 text-sm"
                    >
                      AI Report Generator
                    </Link>
                    <Link
                      to="/pipeline"
                      className="block py-2 px-3 rounded-lg hover:bg-accent/10 text-sm"
                    >
                      Pipeline Estimator
                    </Link>
                    <Link
                      to="/roof-demo"
                      className="block py-2 px-3 rounded-lg hover:bg-accent/10 text-sm"
                    >
                      Roofing Estimator
                    </Link>
                  </div>
                )}

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
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">VibeOps</h3>
              <p className="text-muted-foreground text-sm">
                AI-powered partner for lean crews, solopreneurs, and local
                heroes.
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
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Demos</h4>
              <div className="space-y-2 text-sm">
                <Link
                  to="/construction-tracker"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Construction Tracker
                </Link>
                <Link
                  to="/ai-report-generator"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  AI Report Generator
                </Link>
                <Link
                  to="/pipeline"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Pipeline Estimator
                </Link>
                <Link
                  to="/roof-demo"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Roofing Estimator
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
            <p>&copy; {new Date().getFullYear()} VibeOps Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
