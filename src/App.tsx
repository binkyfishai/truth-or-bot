import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThreeBackground from "@/components/ThreeBackground";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GroqTestPage from "./app/groq/page";

const queryClient = new QueryClient();

const App = () => {
  // Force dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark">
        <ThreeBackground className="fixed inset-0 -z-10 opacity-20 pointer-events-none" />
        <TooltipProvider>
          <Toaster />
          <Sonner 
            theme="dark"
            toastOptions={{
              style: {
                background: 'hsl(222.2 84% 4.9%)',
                color: 'hsl(210 40% 98%)',
                border: '1px solid hsl(217.2 32.6% 17.5%)'
              }
            }}
          />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/groq" element={<GroqTestPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </div>
    </QueryClientProvider>
  );
};

export default App;
