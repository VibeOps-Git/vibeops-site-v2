// src/components/Layout.tsx

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Linkedin, Twitter, Instagram } from "lucide-react";
import SpaceField from "./SpaceField";


interface NavLink {
  path: string;
  label: string;
  badge?: string;
}

const navLinks: NavLink[] = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/reportly", label: "Reportly", badge: "New" },
  { path: "/team", label: "Team" },
  { path: "/case-studies", label: "Case Studies" },
  { path: "/contact", label: "Contact" },
];

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
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Global animated background */}
      <SpaceField />

      {/* Gradient overlays for depth */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/60" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(10,10,15,0.4)_70%)]" />

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo-wht-hrzntl.png"
                alt="VibeOps Logo"
                className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-80"
              />
              <span className="hidden sm:inline-flex text-[0.6rem] uppercase tracking-[0.2em] text-gray-500">
                Technologies
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-[#00ffcc] bg-[#00ffcc]/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider bg-[#00ffcc] text-black rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                to="/reportly"
                className="ml-4 px-5 py-2 rounded-full bg-[#00ffcc] text-black text-sm font-semibold transition-all duration-200 hover:bg-[#00ffcc]/90 hover:shadow-lg hover:shadow-[#00ffcc]/20"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-1 border-t border-white/5 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm transition-colors ${
                    isActive(link.path)
                      ? "text-[#00ffcc] bg-[#00ffcc]/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider bg-[#00ffcc] text-black rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  to="/reportly"
                  className="block w-full py-3 px-4 rounded-xl bg-[#00ffcc] text-black text-sm font-semibold text-center"
                >
                  Login to Reportly
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="container mx-auto pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 pb-[max(4rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Brand */}
            <div>
              <img
                src="/logo-wht-hrzntl.png"
                alt="VibeOps Logo"
                className="h-8 w-auto object-contain mb-4"
              />
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Engineering automation for civil, construction, and infrastructure teams. Less formatting, more engineering.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <div className="space-y-3 text-sm">
                <Link to="/" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Home
                </Link>
                <Link to="/services" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Services
                </Link>
                <Link to="/team" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Team
                </Link>
                <Link to="/case-studies" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Case Studies
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Get Started</h4>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Book a free 30-minute call to see how we can help.
              </p>
              <Link
                to="/contact"
                className="inline-block px-5 py-2 rounded-full bg-[#00ffcc] text-black text-sm font-semibold transition-all hover:bg-[#00ffcc]/90 hover:shadow-lg hover:shadow-[#00ffcc]/20"
              >
                Book a Vibe Check
              </Link>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} VibeOps Technologies Inc.</p>
            <div className="flex items-center gap-6">
              <Link to="/blog" className="hover:text-[#00ffcc] transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="hover:text-[#00ffcc] transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="hover:text-[#00ffcc] transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-[#00ffcc] transition-colors">
                Terms
              </Link>
            </div>
            <div className="flex items-center gap-4" data-testid="social-links">
              <a
                href="https://www.linkedin.com/company/vibeops"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00ffcc] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/vibeops_ca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00ffcc] transition-colors"
                aria-label="X"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/vibeops"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00ffcc] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
