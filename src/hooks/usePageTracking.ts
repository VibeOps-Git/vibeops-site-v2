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
 *
 * Note: Uses a small delay to allow react-helmet-async to update
 * the document title before tracking.
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    // Small delay to allow react-helmet-async to update document.title
    const timeoutId = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location]);
}
