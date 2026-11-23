import React from 'react';
import { BookOpen, MessageCircle, Instagram, Star, MapPin, Heart } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-footer border-t border-white/5 text-stone-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-display font-semibold text-xl text-stone-100">
                Bibliophile <span className="text-accent italic font-normal">Vibes</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed font-light">
              A little homegrown library, waiting for your next story. Rent curated books affordably and keep the stories moving.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/_bibliophile.vibes/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#E1306C]/20 border border-white/10 hover:border-[#E1306C]/40 flex items-center justify-center text-stone-300 hover:text-[#E1306C] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/40 flex items-center justify-center text-stone-300 hover:text-[#25D366] transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://g.page/r/CUDLwutQdF0ZEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#FBBC05]/20 border border-white/10 hover:border-[#FBBC05]/40 flex items-center justify-center text-stone-300 hover:text-[#FBBC05] transition-all"
                aria-label="Google Review"
                title="Leave a Google Review"
              >
                <Star className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#home" className="hover:text-accent transition-colors">Home</a>
              </li>
              <li>
                <a href="/#catalogue" className="hover:text-accent transition-colors">Book Catalogue</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-accent transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#rental-rules" className="hover:text-accent transition-colors">Rental Rules</a>
              </li>
              <li>
                <a href="/#readers-corner" className="hover:text-accent transition-colors">Reader's Corner</a>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-200">
              Contact & Pickup
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Sukhliya, Indore, Madhya Pradesh</span>
              </li>
              <li>
                <a
                  href={generateGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>+91 78286 59551</span>
                </a>
              </li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdAVc4bWxAiWONbp7IZZIvFKSpm2dTz0HSecjyYANxJ6XrNgQ/viewform?usp=publish-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Request a Book
                </a>
              </li>
              <li>
                <a
                  href="/Terms%20%26%20Conditions%20_%20Bibliophile.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors underline"
                >
                  Terms & Conditions (PDF)
                </a>
              </li>
            </ul>
          </div>

          {/* Library Hours / Note */}
          <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-accent">
              Indore Home Library
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              We operate as a personal, local community library. Message us on WhatsApp for book availability, pickup timings, or delivery queries!
            </p>
            <div className="pt-2">
              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium"
              >
                Say Hello on WhatsApp &rarr;
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Bibliophile Vibes. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for readers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
