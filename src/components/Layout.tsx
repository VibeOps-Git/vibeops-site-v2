// src/components/Layout.tsx

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Linkedin, Twitter, Instagram, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { JOBS } from "@/data/jobs";
import Lenis from "lenis";

// ─── Scroll progress bar ──────────────────────────────────────────────────────
// A thin line at the very top of the viewport that fills as the user scrolls.
// Driven by a scroll event → rAF pattern, never causes layout recalc.

function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number | null = null;
    const update = () => {
      const el  = barRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      el.style.width = `${pct}%`;
      raf = null;
    };
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 h-[1.5px] z-[100]"
      style={{ width: '100%', background: 'transparent' }}
    >
      <div
        ref={barRef}
        className="h-full bg-primary"
        style={{ width: '0%', transition: 'width 0.05s linear' }}
      />
    </div>
  );
}

interface NavLink {
  path: string;
  label: string;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

// The dropdown is the spine of the site: six problems in the firm's own words,
// not a menu of what we sell. Sourced from src/data/jobs.ts so the nav can
// never drift out of sync with the pages.
const navGroups: NavGroup[] = [
  {
    label: "What We Solve",
    links: JOBS.map((j) => ({ path: `/what-we-solve/${j.id}`, label: j.navLabel })),
  },
  {
    label: "Company",
    links: [
      { path: "/team", label: "Team" },
      { path: "/blog", label: "Blog" },
      { path: "/security", label: "Security" },
    ],
  },
];

const topLevelLinks: NavLink[] = [
  { path: "/", label: "Home" },
  { path: "/how-we-work", label: "How We Work" },
  { path: "/proof", label: "Our Work" },
  { path: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedGroups, setMobileExpandedGroups] = useState<string[]>([]);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafCb: ((time: number) => void) | null = null;
    let mounted = true;

    async function init() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (!mounted) return;
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      rafCb = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(rafCb);
      gsap.ticker.lagSmoothing(0);
    }

    void init();

    return () => {
      mounted = false;
      lenis?.destroy();
      lenis = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      import('gsap').then(({ gsap }) => { if (rafCb) gsap.ticker.remove(rafCb); });
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => { ScrollTrigger.getAll().forEach((t) => t.kill()); });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpandedGroups([]);
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
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      {/* Scroll progress bar - fills as user reads down the page */}
      <ScrollProgressBar />

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-background/80 backdrop-blur-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto pb-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] max-w-[min(94vw,2560px)]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo-wht-hrzntl.png"
                alt="VibeOps Logo"
                className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-80 invert dark:invert-0"
              />
              <span className="hidden sm:inline-flex text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
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
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Home
              </Link>

              {/* Dropdown groups, split so the nav reads in journey order:
                  What We Solve → How We Work → Our Work → Company */}
              {navGroups.filter((g) => g.label === "What We Solve").map((group) => (
                <div key={group.label} className="relative group">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === group.label ? null : group.label)}
                    onMouseEnter={() => setActiveDropdown(group.label)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                      group.links.some(link => isActive(link.path))
                        ? "text-primary bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {group.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === group.label && (
                    <div
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="p-2 space-y-1">
                        {group.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                              isActive(link.path)
                                ? "text-primary bg-secondary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            {link.label}
                            {link.badge && (
                              <span className="px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
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

              {/* How We Work */}
              <Link
                to="/how-we-work"
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive("/how-we-work")
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                How We Work
              </Link>

              {/* Our Work */}
              <Link
                to="/proof"
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive("/proof")
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Our Work
              </Link>

              {navGroups.filter((g) => g.label === "Company").map((group) => (
                <div key={group.label} className="relative group">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === group.label ? null : group.label)}
                    onMouseEnter={() => setActiveDropdown(group.label)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                      group.links.some(link => isActive(link.path))
                        ? "text-primary bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {group.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === group.label && (
                    <div
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="p-2 space-y-1">
                        {group.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                              isActive(link.path)
                                ? "text-primary bg-secondary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            {link.label}
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
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Contact
              </Link>

              <ThemeToggle className="ml-2" />

              <Link
                to="/contact"
                className="ml-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:bg-primary/90"
              >
                Book a Call
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full border border-border bg-secondary transition-colors hover:bg-muted"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-1 border-t border-border pt-4">
              {/* Home */}
              <Link
                to="/"
                className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm transition-colors ${
                  isActive("/")
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Home
              </Link>

              {/* Mobile groups, same journey order */}
              {navGroups.filter((g) => g.label === "What We Solve").map((group) => (
                <div key={group.label} className="space-y-1">
                  <button
                    onClick={() => toggleMobileGroup(group.label)}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
                              ? "text-primary bg-secondary"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {link.label}
                          {link.badge && (
                            <span className="px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* How We Work */}
              <Link
                to="/how-we-work"
                className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm transition-colors ${
                  isActive("/how-we-work")
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                How We Work
              </Link>

              {/* Our Work */}
              <Link
                to="/proof"
                className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm transition-colors ${
                  isActive("/proof")
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Our Work
              </Link>

              {navGroups.filter((g) => g.label === "Company").map((group) => (
                <div key={group.label} className="space-y-1">
                  <button
                    onClick={() => toggleMobileGroup(group.label)}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
                              ? "text-primary bg-secondary"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {link.label}
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
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Contact
              </Link>

              {/* Theme toggle row */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl text-sm text-muted-foreground">
                <span>Theme</span>
                <ThemeToggle />
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="block w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center"
                >
                  Book a Call
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-background">
        <div className="container mx-auto pb-[max(4rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-16 max-w-[min(94vw,2560px)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <img
                src="/logo-wht-hrzntl.png"
                alt="VibeOps Logo"
                className="h-8 w-auto object-contain mb-4 invert dark:invert-0"
              />
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                The AI engineering team for architecture and engineering firms. Civil
                engineers who write software, embedded in your projects, building the
                AI, the integrations and the internal tools nobody sells you.
              </p>
            </div>

            {/* What we solve */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">What We Solve</h4>
              <div className="space-y-3 text-sm">
                {JOBS.map((j) => (
                  <Link
                    key={j.id}
                    to={`/what-we-solve/${j.id}`}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {j.navLabel}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
              <div className="space-y-3 text-sm">
                <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/team" className="block text-muted-foreground hover:text-primary transition-colors">
                  Team
                </Link>
                <Link to="/how-we-work" className="block text-muted-foreground hover:text-primary transition-colors">
                  How We Work
                </Link>
                <Link to="/proof" className="block text-muted-foreground hover:text-primary transition-colors">
                  Our Work
                </Link>
                <Link to="/security" className="block text-muted-foreground hover:text-primary transition-colors">
                  Security &amp; Data Handling
                </Link>
                <Link to="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold text-foreground mb-4">Get Started</h4>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Book a 30-minute call. Bring the workflow that costs your firm the most.
              </p>
              <Link
                to="/contact"
                className="inline-block px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-all hover:bg-primary/90"
              >
                Book a Call
              </Link>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
            <p className="shrink-0">© {new Date().getFullYear()} VibeOps Technologies Inc.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <a href="https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">UBC Investor Showcase</a>
              <a href="https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Venture Cohort</a>
            </div>
            <div className="flex items-center gap-4" data-testid="social-links">
              <a
                href="https://www.linkedin.com/company/vibeops"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/vibeops_ca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/vibeops"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
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
