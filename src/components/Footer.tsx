import React from 'react';
import { Instagram, Facebook, Twitter, Send, Phone, Mail, Clock } from 'lucide-react';
import BalanzaLogo from './BalanzaLogo';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { setAdminOpen, setActivePage, setInfoModalOpen, setInfoModalTab, isAdminAuthorized } = useApp();

  const handleLinkClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setActivePage('home');
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer 
      className="border-t border-slate-900/10 py-16 text-slate-900 select-none"
      style={{ backgroundColor: '#A7E22E' }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Five columns layout */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start text-left">
            <button
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mb-4 focus:outline-none cursor-pointer group text-left"
              title="Back to home"
            >
              <BalanzaLogo className="h-12 md:h-14 w-auto text-slate-950 transition-transform group-hover:scale-105" />
            </button>
            <p className="font-sans text-xs text-slate-900/80 leading-normal mb-5">
              Building balance. Growing confidence. Premium balance bikes crafted meticulously with children&apos;s growth in mind.
            </p>
            
            {/* Social handles */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/share/1EDyePAqdc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm" title="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://x.com/Balanzabikes" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm" title="Twitter / X">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm" title="Telegram">
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="text-left">
            <h4 className="font-display text-xs font-bold text-slate-950 tracking-wider uppercase mb-5">
              Shop
            </h4>
            <ul className="space-y-3 font-sans text-xs font-bold text-slate-900/90">
              <li>
                <a href="#our-bikes" onClick={(e) => handleLinkClick(e, 'our-bikes')} className="hover:text-black hover:underline transition-colors">
                  All Bikes
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="text-left">
            <h4 className="font-display text-xs font-bold text-slate-950 tracking-wider uppercase mb-5">
              Support
            </h4>
            <ul className="space-y-3 font-sans text-xs font-bold text-slate-900/90 flex flex-col items-start">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('faqs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer hover:text-slate-950 hover:underline transition-colors text-left"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('shipping');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer hover:text-slate-950 hover:underline transition-colors text-left"
                >
                  Shipping &amp; Delivery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('returns');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer hover:text-slate-950 hover:underline transition-colors text-left"
                >
                  Returns &amp; Refunds
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-left">
            <h4 className="font-display text-xs font-bold text-slate-950 tracking-wider uppercase mb-5">
              Company
            </h4>
            <ul className="space-y-3 font-sans text-xs font-bold text-slate-900/90">
              <li>
                <button 
                  onClick={() => {
                    setActivePage('story');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-black hover:underline transition-colors cursor-pointer text-left font-sans text-xs font-bold text-slate-900/90"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActivePage('blogs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-black hover:underline transition-colors cursor-pointer text-left font-sans text-xs font-bold text-slate-900/90"
                >
                  Blogs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black hover:underline transition-colors cursor-pointer text-left font-sans text-xs font-bold text-slate-900/90"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact HELP Column */}
          <div className="text-left text-xs font-sans text-slate-900/90 font-bold">
            <h4 className="font-display text-xs font-bold text-slate-950 tracking-wider uppercase mb-5 text-left">
              Need Help?
            </h4>
            <div className="space-y-3.5">
              <a href="tel:+919888963663" className="flex items-center gap-2.5 hover:text-slate-950 transition-colors">
                <Phone className="h-4 w-4 text-slate-950 flex-shrink-0" />
                <span>+91 9888-963-663</span>
              </a>
              
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-950 flex-shrink-0" />
                <span className="hover:text-slate-950 transition-colors truncate">hello@balanzabikes.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal bar */}
        <div className="border-t border-slate-900/15 pt-7 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-900/70 font-semibold gap-4">
          <p>© {currentYear} Balanza Bikes. All Rights Reserved.</p>
          <div className="flex gap-4 items-center">
            <button
              type="button"
              onClick={() => {
                setActivePage('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer hover:text-slate-950 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-slate-900/20">|</span>
            <button
              type="button"
              onClick={() => {
                setActivePage('terms');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer hover:text-slate-950 transition-colors"
            >
              Terms &amp; Conditions
            </button>
            {isAdminAuthorized && (
              <>
                <span className="text-slate-900/20">|</span>
                <button 
                  type="button" 
                  onClick={() => {
                    window.history.pushState({}, '', '/admin');
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="cursor-pointer hover:text-slate-950 transition-colors uppercase font-bold text-[10px] tracking-wider text-[#A7E22E] bg-slate-950 px-2 py-0.5 rounded font-mono"
                >
                  Admin Panel ↗
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
