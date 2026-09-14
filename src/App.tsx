import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Research from "./pages/Research";

// The article view pulls in the charting library, which is larger than the rest
// of the site put together. Loading it on demand keeps the landing page light
// for the majority of visitors who never open an article.
const Article = lazy(() => import("./pages/Article"));

const queryClient = new QueryClient();

const ArticleRoute = () => (
  <Suspense fallback={<div className="min-h-screen bg-cream" aria-busy="true" />}>
    <Article />
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/research/:category" element={<Research />} />
          <Route path="/research/:category/:slug" element={<ArticleRoute />} />
          <Route path="/research/:category/:slug/:lang" element={<ArticleRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
