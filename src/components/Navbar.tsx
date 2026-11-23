import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '../utils/whatsapp';

interface NavbarProps {
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSearchBtn = () => {
    if (location.pathname !== '/') {
      navigate('/?focusSearch=true');
    } else if (onSearchClick) {
      onSearchClick();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-base/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-xl sm:text-2xl tracking-wide text-stone-100 group-hover:text-accent transition-colors">
                Bibliophile <span className="text-accent italic font-normal">Vibes</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-stone-400 -mt-1">
                Book Rental Library
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
            <button
              onClick={() => handleNavClick('home')}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue')}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Catalogue
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('readers-corner')}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Reader's Corner
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              About
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleSearchBtn}
              className="p-2 sm:p-2.5 rounded-full text-stone-300 hover:text-accent hover:bg-white/5 transition-colors"
              aria-label="Search Catalogue"
              title="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            <Link
              to="/admin"
              className="p-2 sm:p-2.5 rounded-full text-stone-400 hover:text-accent hover:bg-white/5 transition-colors"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-300 hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-deep border-b border-white/10 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 text-base font-medium text-stone-200">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-accent transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-accent transition-colors"
            >
              Catalogue
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-accent transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('readers-corner')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-accent transition-colors"
            >
              Reader's Corner
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-accent transition-colors"
            >
              About
            </button>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 px-3 rounded-lg text-stone-400 hover:text-accent hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> Admin Portal
            </Link>
          </div>

          <div className="pt-2">
            <a
              href={generateGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm bg-[#25D366] text-stone-950 hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
