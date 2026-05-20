import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position synchronously before anything mounts
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Do NOT call ScrollTrigger.killAll() - it destroys triggers on the
    // incoming page before they have a chance to mount, causing 6s blank
    // screens. Each component manages its own triggers via gsap.context.
    //
    // Double-deferred refresh so new page's DOM and layout are settled:
    // rAF1 = React has committed new DOM
    // rAF2 = browser has done layout pass
    // setTimeout(250) = backup for slow-mounting components (video, images)
    let t2: ReturnType<typeof setTimeout>;
    const t1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        t2 = setTimeout(() => ScrollTrigger.refresh(), 250);
      });
    });

    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
