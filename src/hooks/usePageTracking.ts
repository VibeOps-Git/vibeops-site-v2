import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Tracks page views for Google Tag Manager.
 * Pushes a page_view event to dataLayer on every route change.
 *
 * Usage: Call this hook once inside BrowserRouter context.
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
}
