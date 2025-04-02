
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import ItemsPage from "./pages/ItemsPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ReportItemPage from "./pages/ReportItemPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lost-items" element={<ItemsPage />} />
              <Route path="/found-items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/report" element={
                <ProtectedRoute>
                  <ReportItemPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
