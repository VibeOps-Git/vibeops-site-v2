// src/components/Layout.tsx

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Linkedin, Twitter, Instagram, ChevronDown, LogOut } from "lucide-react";
import SpaceField from "./SpaceField";
import { useAuth } from "@/contexts/AuthContext";
import Lenis from "lenis";

// ─── Cursor canvas effects ────────────────────────────────────────────────────
// Single canvas handles three layered effects, all in brand teal (#00ffcc):
//
// 1. COMET TRAIL - 10-point ring buffer of past cursor positions, each drawn
//    as a tiny teal dot at decreasing opacity. Creates a ghost-comet quality
//    that makes the cursor feel physical without being distracting.
//
// 2. CLICK RIPPLE - on mousedown a single ring expands slowly from click point.
//    Max radius 28px, starting alpha 0.08 - barely a whisper. Rewards every
//    interaction with tactile feedback without visual noise.
//
// 3. SOFT GLOW - a radial gradient under the current cursor position, in brand
//    teal at 0.5% opacity. Separate div so GPU can composite it independently.
//
// Everything runs in a single RAF loop. Zero React re-renders after mount.

const TEAL = '0,255,204'; // #00ffcc - brand primary as RGB components

function AmbientCursorGlow() {
  const glowRef  = useRef<HTMLDivElement>(null);
  const cvRef    = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cv  = cvRef.current!;
    const ctx = cv.getContext('2d')!;

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Current and lerped cursor position
    const cur = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };
    const onMove = (e: MouseEvent) => { cur.x = e.clientX; cur.y = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Trail ring buffer - 10 past positions
    const TRAIL = 10;
    const trail: { x: number; y: number }[] = Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 }));
    let trailIdx = 0;

    // Click ripples
    type Ripple = { x: number; y: number; r: number; a: number };
    const ripples: Ripple[] = [];
    const onDown = (e: MouseEvent) => {
      // Only spawn if not on a text input so form feedback isn't cluttered
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      ripples.push({ x: e.clientX, y: e.clientY, r: 1, a: 0.08 });
    };
    window.addEventListener('mousedown', onDown);

    let raf: number;
    const tick = () => {
      // Lerp toward real cursor - 6% per frame ≈ 200ms lag
      pos.x += (cur.x - pos.x) * 0.06;
      pos.y += (cur.y - pos.y) * 0.06;

      // Update soft glow div
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.x - 30}px,${pos.y - 30}px,0)`;
      }

      // Store trail point every frame
      trail[trailIdx % TRAIL] = { x: pos.x, y: pos.y };
      trailIdx++;

      ctx.clearRect(0, 0, cv.width, cv.height);

      // Draw comet trail - oldest = most transparent
      for (let i = 0; i < TRAIL; i++) {
        const age   = ((trailIdx - i - 1 + TRAIL) % TRAIL); // 0=newest, TRAIL-1=oldest
        const t     = trail[(trailIdx - 1 - i + TRAIL * 2) % TRAIL];
        const alpha = (1 - age / TRAIL) * 0.045; // max ~4.5% at newest point
        const r     = 1.2 - (age / TRAIL) * 0.8;  // shrinks toward tail
        ctx.beginPath();
        ctx.arc(t.x, t.y, Math.max(0.3, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${TEAL},${alpha})`;
        ctx.fill();
      }

      // Draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 0.9;          // slow expand - max ~28px over 30 frames
        rp.a -= 0.003;        // fade over ~27 frames ≈ 450ms
        if (rp.r > 28 || rp.a <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${TEAL},${rp.a})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Soft glow - 60px teal blob, 0.5% opacity, screen blend */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 rounded-full"
        style={{
          width: 60, height: 60,
          zIndex: 15,
          background: `radial-gradient(circle, rgba(${TEAL},0.005) 0%, transparent 100%)`,
          filter: 'blur(4px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
          transform: 'translate3d(-30px,-30px,0)',
        }}
      />
      {/* Trail + ripple canvas */}
      <canvas
        ref={cvRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 16, mixBlendMode: 'screen' }}
      />
    </>
  );
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────
// A 1.5px teal line at the very top of the viewport that fills as the user
// scrolls. One of the highest-ROI addictive effects - users subconsciously
// track it and it creates a "just a bit more" scroll impulse.
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
        className="h-full"
        style={{
          width: '0%',
          background: 'linear-gradient(to right, rgba(0,255,204,0.5), rgba(52,211,153,0.35))',
          boxShadow: '0 0 6px rgba(0,255,204,0.3)',
          transition: 'width 0.05s linear',
        }}
      />
    </div>
  );
}

// ─── Global ambient orbs ──────────────────────────────────────────────────────
// Two slow-drifting gradient orbs rendered as a fixed background layer on
// every page. Uses the same drift-1/2 keyframes defined in index.css.
// WHY FIXED: scroll position doesn't matter - they always fill the viewport,
// creating a consistent atmospheric depth on every page without needing to
// touch individual page components.

function GlobalAmbientOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="ambient-drift-1 absolute rounded-full"
        style={{
          top: '-5%', left: '-5%',
          width: '30%', height: '35%',
          background: 'radial-gradient(ellipse, rgba(52,211,153,0.018) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="ambient-drift-2 absolute rounded-full"
        style={{
          bottom: '-5%', right: '-5%',
          width: '28%', height: '32%',
          background: 'radial-gradient(ellipse, rgba(96,165,250,0.012) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedGroups, setMobileExpandedGroups] = useState<string[]>([]);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, openLogin, logout } = useAuth();

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
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-clip">
      {/* Teal scroll progress bar - fills as user reads down the page */}
      <ScrollProgressBar />

      {/* Slowly drifting gradient orbs - consistent atmosphere on every page */}
      <GlobalAmbientOrbs />

      {/* Cursor trail, soft glow, click ripple - all in brand teal */}
      <AmbientCursorGlow />

      {/* Global animated background */}
      <SpaceField />

      {/* Gradient overlays for depth */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/60" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(10,10,15,0.4)_70%)]" />

      {/* Blueprint drafting grid - subtle global engineering-paper texture */}
      <div className="bp-grid" aria-hidden="true" />

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
            <div className="hidden md:flex items-center gap-1" ref={dropdownRef}>
              {/* Home Link */}
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isActive("/")
                    ? "text-[#00ffcc] bg-[#00ffcc]/10"
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
                        ? "text-[#00ffcc] bg-[#00ffcc]/10"
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
                                ? link.badgeColor ? `text-white bg-white/10` : "text-[#00ffcc] bg-[#00ffcc]/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {link.label}
                            {link.badge && (
                              <span
                                className="px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white rounded-full"
                                style={{ backgroundColor: link.badgeColor || '#00ffcc', color: '#fff' }}
                              >
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
                    ? "text-[#00ffcc] bg-[#00ffcc]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Contact
              </Link>

              {user ? (
                <div className="ml-4 flex items-center gap-2">
                  <span className="text-xs text-gray-400 truncate max-w-[140px]">{user.email}</span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-sm text-gray-400 transition-all duration-200 hover:text-white hover:border-white/20 hover:bg-white/5"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <a
                  href="https://reportly.ca/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-5 py-2 rounded-full bg-[#00ffcc] text-black text-sm font-semibold transition-all duration-200 hover:bg-[#00ffcc]/90 hover:shadow-lg hover:shadow-[#00ffcc]/20"
                >
                  Login
                </a>
              )}
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
                    ? "text-[#00ffcc] bg-[#00ffcc]/10"
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
                              ? link.badgeColor ? "text-white bg-white/10" : "text-[#00ffcc] bg-[#00ffcc]/10"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {link.label}
                          {link.badge && (
                            <span
                              className="px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white rounded-full"
                              style={{ backgroundColor: link.badgeColor || '#00ffcc' }}
                            >
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
                    ? "text-[#00ffcc] bg-[#00ffcc]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Contact
              </Link>

              <div className="pt-2">
                {user ? (
                  <button
                    onClick={logout}
                    className="block w-full py-3 px-4 rounded-xl border border-white/10 text-gray-400 text-sm font-semibold text-center transition-colors hover:text-white hover:bg-white/5"
                  >
                    Sign Out ({user.email})
                  </button>
                ) : (
                  <a
                    href="https://reportly.ca/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 rounded-xl bg-[#00ffcc] text-black text-sm font-semibold text-center"
                  >
                    Login
                  </a>
                )}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <img
                src="/logo-wht-hrzntl.png"
                alt="VibeOps Logo"
                className="h-8 w-auto object-contain mb-4"
              />
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Report automation and building code intelligence for civil, structural, geotechnical, and environmental engineering teams. Less formatting, more engineering.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
              <div className="space-y-3 text-sm">
                <Link to="/reportly" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Reportly
                </Link>
                <Link to="/services" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Custom Software
                </Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <div className="space-y-3 text-sm">
                <Link to="/" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Home
                </Link>
                <Link to="/team" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Team
                </Link>
                <Link to="/case-studies" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Case Studies
                </Link>
                <Link to="/blog" className="block text-gray-400 hover:text-[#00ffcc] transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold text-white mb-4">Get Started</h4>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Book a free 30-minute call. We'll look at the report that costs you the most hours.
              </p>
              <Link
                to="/contact"
                className="inline-block px-5 py-2 rounded-full bg-[#00ffcc] text-black text-sm font-semibold transition-all hover:bg-[#00ffcc]/90 hover:shadow-lg hover:shadow-[#00ffcc]/20"
              >
                Book a Vibe Check
              </Link>
            </div>
          </div>

          {/* Drafting title block - sheet metadata, engineering-deliverable styling */}
          <div className="bp-titleblock mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            <div className="bp-tb-cell col-span-2 sm:col-span-1 lg:col-span-2">
              <div className="bp-tb-key">Project</div>
              <div className="bp-tb-val">VibeOps.ca - Marketing Site</div>
            </div>
            <div className="bp-tb-cell">
              <div className="bp-tb-key">Drawing No.</div>
              <div className="bp-tb-val">VOPS-001</div>
            </div>
            <div className="bp-tb-cell">
              <div className="bp-tb-key">Rev</div>
              <div className="bp-tb-val">C</div>
            </div>
            <div className="bp-tb-cell">
              <div className="bp-tb-key">Date</div>
              <div className="bp-tb-val">{new Date().getFullYear()}</div>
            </div>
            <div className="bp-tb-cell">
              <div className="bp-tb-key">Drawn By</div>
              <div className="bp-tb-val">VibeOps Eng.</div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-8 pt-8 flex flex-col items-center gap-4 text-sm text-gray-500 sm:flex-row sm:justify-between">
            <p className="shrink-0">© {new Date().getFullYear()} VibeOps Technologies Inc.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link to="/blog" className="hover:text-[#00ffcc] transition-colors">Blog</Link>
              <Link to="/contact" className="hover:text-[#00ffcc] transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-[#00ffcc] transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-[#00ffcc] transition-colors">Terms</Link>
              <a href="https://innovation.ubc.ca/news/march-03-2026/meet-12-ubc-ventures-presenting-innovation-ubcs-2026-investor-showcase" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffcc] transition-colors">UBC Investor Showcase</a>
              <a href="https://innovation.ubc.ca/news/february-02-2026/meet-51st-venture-founder-cohort" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffcc] transition-colors">Venture Cohort</a>
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
