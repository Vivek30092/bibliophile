import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CataloguePage } from './pages/CataloguePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from './utils/whatsapp';

// Scroll to top on route change (except when back button restores position)
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top on path changes, not hash anchor jumps
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

// Public Layout
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Sticky WhatsApp Floating Button for Mobile */}
      <a
        href={generateGeneralWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 sm:hidden w-14 h-14 rounded-full bg-[#25D366] text-stone-950 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <CataloguePage />
            </PublicLayout>
          }
        />
        <Route
          path="/books/:id"
          element={
            <PublicLayout>
              <BookDetailPage />
            </PublicLayout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
