import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProvenLane from "./pages/ProvenLane";
import Switchboard from "./pages/Switchboard";
import NotFound from "./pages/NotFound";
import { ADMIN_ROUTES, adminPath } from "./admin/adminRoutes";
import { dismissBootLoader } from "./lib/bootLoader";

// Admin pages load on demand, so visitors never download the editor
const AdminPage = lazy(() => import("./pages/AdminPage"));

const queryClient = new QueryClient();

/* Lifts the boot screen once the first page's requests have settled (or after 6s regardless). */
const BOOT_SETTLE_MS = 150;
const BOOT_MAX_MS = 6000;

const BootLoaderDismiss = () => {
  const fetching = useIsFetching();
  useEffect(() => {
    if (fetching > 0) return;
    // Settled for a moment, not just between one request ending and the next starting
    const t = setTimeout(dismissBootLoader, BOOT_SETTLE_MS);
    return () => clearTimeout(t);
  }, [fetching]);
  useEffect(() => {
    const t = setTimeout(dismissBootLoader, BOOT_MAX_MS);
    return () => clearTimeout(t);
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BootLoaderDismiss />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Same Index element on these routes, so the chat survives opening a project */}
          <Route path="/projects" element={<Index />} />
          <Route path="/project/:slug" element={<Index />} />
          <Route path="/project/provenlane" element={<ProvenLane />} />
          <Route path="/project/switchboard" element={<Switchboard />} />
          {/* Private admin pages — the backend enforces the login */}
          {ADMIN_ROUTES.map(({ code, kind }) => (
            <Route
              key={code}
              path={adminPath(code)}
              element={
                <Suspense fallback={null}>
                  <AdminPage kind={kind} />
                </Suspense>
              }
            />
          ))}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
