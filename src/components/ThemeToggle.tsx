import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Theme toggle with a circular "wipe" reveal.
 *
 * On click the next theme is painted in as an expanding circle radiating from
 * the button, using the View Transitions API. Falls back to an instant swap on
 * browsers without it (or when the user prefers reduced motion).
 *
 * The icon is a single sun/moon that morphs: rays retract and a crescent
 * carves out of the disc as it goes dark.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Avoid hydration/SSR mismatch — render a stable placeholder until mounted.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  // Show the target state so it's clear the theme can be switched:
  // moon while in light mode, sun while in dark mode.
  const showMoon = !isDark;

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!btnRef.current || !doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    const rect = btnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => setTheme(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`group relative grid h-9 w-9 place-items-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-secondary ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Icon shows the TARGET state: moon in light mode (click to go dark),
            sun in dark mode (click to go light). */}
        {/* Disc + crescent mask. The mask circle slides in to carve a moon. */}
        <mask id="theme-toggle-moon">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle
            cx={showMoon ? 17 : 26}
            cy={showMoon ? 7 : 2}
            r="8"
            fill="black"
            className="transition-all duration-500 ease-in-out"
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r={showMoon ? 8 : 5}
          fill="currentColor"
          stroke="none"
          mask="url(#theme-toggle-moon)"
          className="transition-all duration-500 ease-in-out"
        />
        {/* Sun rays — visible only when showing the sun (i.e. in dark mode). */}
        <g
          className="origin-center transition-all duration-500 ease-in-out"
          style={{
            opacity: showMoon ? 0 : 1,
            transform: showMoon ? "scale(0.4) rotate(-40deg)" : "scale(1) rotate(0deg)",
          }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
          <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
          <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
        </g>
      </svg>
    </button>
  );
}
