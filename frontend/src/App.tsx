import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import AIReportGenerator from "./pages/demos-removed-for-now/AIReportGenerator";
import ConstructionTracker from "./pages/demos-removed-for-now/ConstructionTracker";
import PipelineEstimator from "./pages/demos-removed-for-now/PipelineEstimator";
import RoofDemo from "./pages/demos-removed-for-now/RoofDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/team" element={<Team />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            {/* Demos - removed for now - add back in any as you'd like
            <Route path="/ai-report-generator" element={<AIReportGenerator />} />
            <Route path="/construction-tracker" element={<ConstructionTracker />} />
            <Route path="/pipeline" element={<PipelineEstimator />} />
            <Route path="/roof-demo" element={<RoofDemo />} />
            */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
// TEST GIT CHANGE
