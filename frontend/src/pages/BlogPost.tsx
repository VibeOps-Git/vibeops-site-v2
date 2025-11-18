import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const REPORTLY_LOGIN_URL =
  import.meta.env.VITE_REPORTLY_LOGIN_URL || "http://localhost:5014/reportly";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-card/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-wht-hrzntl.png"
                alt="VibeOps Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="nav-link">
                About
              </Link>
              <Link to="/team" className="nav-link">
                Team
              </Link>
              <Link to="/services" className="nav-link">
                Services
              </Link>
              <Link to="/case-studies" className="nav-link">
                Reviews
              </Link>
              <Link to="/blog" className="nav-link">
                Blog
              </Link>

              {/* Apps Dropdown */}
              <div className="relative group">
                <button className="nav-link" type="button">
                  Demos
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/construction-tracker"
                    className="block px-4 py-2 hover:bg-accent/10 rounded-t-lg"
                  >
                    Construction Tracker
                  </Link>
                  <Link
                    to="/ai-report-generator"
                    className="block px-4 py-2 hover:bg-accent/10"
                  >
                    AI Report Generator
                  </Link>
                  <Link
                    to="/pipeline"
                    className="block px-4 py-2 hover:bg-accent/10"
                  >
                    Pipeline Estimator
                  </Link>
                  <Link
                    to="/roof-demo"
                    className="block px-4 py-2 hover:bg-accent/10 rounded-b-lg"
                  >
                    Roofing Estimator
                  </Link>
                </div>
              </div>

              <Link to="/contact" className="nav-link">
                Contact
              </Link>

              {/* Login dropdown – behaves exactly like Demos */}
              <div className="relative group">
                <button
                  className="btn-primary flex items-center gap-1"
                  type="button"
                >
                  Login
                </button>
                <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    type="button"
                    onClick={openReportly}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent/10 rounded-lg"
                  >
                    Reportly
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 -mx-4 px-4">
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Services
              </Link>
              <Link
                to="/case-studies"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Case Studies
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Contact
              </Link>
              <Link
                to="/team"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Team
              </Link>
              <Link
                to="/blog"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Blog
              </Link>

              <div className="border-t border-border my-2" />

              <Link
                to="/construction-tracker"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Construction Tracker
              </Link>
              <Link
                to="/ai-report-generator"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                AI Report Generator
              </Link>
              <Link
                to="/pipeline"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Pipeline Estimator
              </Link>
              <Link
                to="/roof-demo"
                className="block py-2 px-4 hover:bg-accent/10 rounded"
              >
                Roofing Estimator
              </Link>

              <div className="border-t border-border my-2" />

              {/* Keep internal login if you still have a React /login route */}
              <Link
                to="/login"
                className="block py-2 px-4 bg-primary text-primary-foreground rounded"
              >
                Login
              </Link>

              {/* Mobile Reportly link (opens new tab) */}
              <button
                onClick={openReportly}
                className="block w-full text-left mt-1 py-2 px-4 border border-border rounded hover:bg-accent/10 text-sm"
              >
                Reportly Login
              </button>
            </div>
          )}
        </nav>
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
            <p>&copy; {new Date().getFullYear()} VibeOps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
