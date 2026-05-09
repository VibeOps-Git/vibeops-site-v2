// src/components/Layout.tsx

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Linkedin, Twitter, Instagram, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import SpaceField from "./SpaceField";
import { VibeLinkButton } from "./ui/VibeButton";
import { useNavScroll } from "@/hooks/useNavScroll";

interface NavLink {
  path: string;
  label: string;
  badge?: string;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

const navGroups: NavGroup[] = [
  {
    label: "Solutions",
    links: [
      { path: "/reportly", label: "Reportly", badge: "New" },
      { path: "/services", label: "Consulting" },
    ],
  },
  {
    label: "Company",
    links: [
      { path: "/team", label: "Team" },
      { path: "/case-studies", label: "Testimonials" },
      { path: "/blog", label: "Blog" },
    ],
  },
];

const topLevelLinks: NavLink[] = [
  { path: "/", label: "Home" },
  { path: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedGroups, setMobileExpandedGroups] = useState<string[]>([]);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { hidden, isScrolled, style: navYStyle } = useNavScroll();

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpandedGroups([]);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const toggleMobileGroup = (label: string) => {
    setMobileExpandedGroups(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Global animated background */}
      <SpaceField />

      {/* Gradient overlays for depth */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/60" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(10,10,15,0.4)_70%)]" />

      {/* Navigation (PR02: velocity hide + premium glass elevation) */}
      <motion.header
        style={navYStyle}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled || isMenuOpen
            ? "bg-[#02050a]/92 backdrop-blur-3xl border-b border-white/8"
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
            <div className="hidden md:flex items-center gap-1" ref={dropdownRef}>
              {/* Home Link */}
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive("/")
                    ? "text-[var(--emerald-accent)] bg-[var(--emerald-accent)]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Home
              </Link>

              {/* Dropdown Groups */}
              {navGroups.map((group) => (
                <div key={group.label} className="relative group">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === group.label ? null : group.label)}
                    onMouseEnter={() => setActiveDropdown(group.label)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                      group.links.some(link => isActive(link.path))
                        ? "text-[var(--emerald-accent)] bg-[var(--emerald-accent)]/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {group.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === group.label && (
                    <div 
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-48 bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="p-2 space-y-1">
                        {group.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                              isActive(link.path)
                                ? "text-[var(--emerald-accent)] bg-[var(--emerald-accent)]/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {link.label}
                            {link.badge && (
                              <span className="px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider bg-[var(--emerald-accent)] text-black rounded-full">
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Contact Link */}
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive("/contact")
                    ? "text-[var(--emerald-accent)] bg-[var(--emerald-accent)]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Contact
              </Link>

              <VibeLinkButton href="https://reportly.ca/login" variant="primary" size="md">
                Login
              </VibeLinkButton>
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
              {/* Home */}
              <Link
                to="/"
                className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm transition-colors ${
                  isActive("/")
                    ? "text-[var(--emerald-accent)] bg-[var(--emerald-accent)]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Home
              </Link>

              {/* Mobile Groups */}
              {navGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <button
                    onClick={() => toggleMobileGroup(group.label)}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {group.label}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpandedGroups.includes(group.label) ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {mobileExpandedGroups.includes(group.label) && (
                    <div className="pl-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
                      {group.links.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm transition-colors ${
                            isActive(link.path)
                              ? "text-[var(--emerald-accent)] bg-[var(--emerald-accent)]/10"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {link.label}
                          {link.badge && (
                            <span className="px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider bg-[var(--emerald-accent)] text-black rounded-full">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Contact */}
              <Link
                to="/contact"
                className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm transition-colors ${
                  isActive("/contact")
                    ? "text-[var(--emerald-accent)] bg-[var(--emerald-accent)]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Contact
              </Link>

              <div className="pt-2">
                <VibeLinkButton href="https://reportly.ca/login" variant="primary" size="md" className="w-full justify-center">
                  Login to Reportly
                </VibeLinkButton>
              </div>
            </div>
          )}
        </nav>
      </motion.header>

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
                <Link to="/" className="block text-gray-400 hover:text-[var(--emerald-accent)] transition-colors">
                  Home
                </Link>
                <Link to="/services" className="block text-gray-400 hover:text-[var(--emerald-accent)] transition-colors">
                  Services
                </Link>
                <Link to="/team" className="block text-gray-400 hover:text-[var(--emerald-accent)] transition-colors">
                  Team
                </Link>
                <Link to="/case-studies" className="block text-gray-400 hover:text-[var(--emerald-accent)] transition-colors">
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
              <VibeLinkButton href="/contact" variant="primary" size="md">
                Book a Vibe Check
              </VibeLinkButton>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} VibeOps Technologies Inc.</p>
            <div className="flex items-center gap-6">
              <Link to="/blog" className="hover:text-[var(--emerald-accent)] transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="hover:text-[var(--emerald-accent)] transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="hover:text-[var(--emerald-accent)] transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-[var(--emerald-accent)] transition-colors">
                Terms
              </Link>
              <span className="text-gray-600">|</span>
              <a
                href="https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--emerald-accent)] transition-colors"
              >
                UBC Investor Showcase
              </a>
              <a
                href="https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--emerald-accent)] transition-colors"
              >
                Venture Cohort
              </a>
            </div>
            <div className="flex items-center gap-4" data-testid="social-links">
              <a
                href="https://www.linkedin.com/company/vibeops"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--emerald-accent)] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/vibeops_ca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--emerald-accent)] transition-colors"
                aria-label="X"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/vibeops"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--emerald-accent)] transition-colors"
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
