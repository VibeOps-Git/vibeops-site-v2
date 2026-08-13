import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import WhatWeSolve from "./pages/WhatWeSolve";
import JobPage from "./pages/JobPage";
import HowWeWork from "./pages/HowWeWork";
import Security from "./pages/Security";
import Proof from "./pages/Proof";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { usePageTracking } from "./hooks/usePageTracking";

const queryClient = new QueryClient();

function PageTracker() {
  usePageTracking();
  return null;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker />
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/what-we-solve" element={<WhatWeSolve />} />
              <Route path="/what-we-solve/:slug" element={<JobPage />} />
              <Route path="/how-we-work" element={<HowWeWork />} />
              <Route path="/security" element={<Security />} />
              <Route path="/proof" element={<Proof />} />
              {/* Legacy paths — kept so in-flight links and any cached SPA
                  navigation land somewhere sensible. 301s live in vercel.json. */}
              <Route path="/services" element={<Navigate to="/what-we-solve" replace />} />
              <Route path="/case-studies" element={<Navigate to="/proof" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/team" element={<Team />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ThemeProvider>
);

export default App;
