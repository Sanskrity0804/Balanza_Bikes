import React from 'react';
import { ArrowLeft, BookOpen, FileText, Calendar, Lock, AlertOctagon, Scale, ShieldAlert, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TermsPage() {
  const { setActivePage } = useApp();

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] font-sans pb-24 text-left select-none animate-fade-in text-slate-900">
      
      {/* Premium Header Block */}
      <div className="bg-slate-950 text-white pt-16 pb-24 relative overflow-hidden px-4 md:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-4xl relative z-10">
          
          {/* Back Button */}
          <button 
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-300 hover:text-white transition-all mb-6 bg-white/5 hover:bg-white/10 active:scale-95 px-3.5 py-1.5 rounded-full border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#A7E22E]" />
            Return to Storefront
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4.5 w-4.5 text-[#A7E22E]" />
            <span className="text-[10px] font-black tracking-widest uppercase text-[#A7E22E] block font-mono">
              Balanza Bikes — Site Agreement
            </span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.95] max-w-2xl">
            Terms & Conditions
          </h1>
          
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 font-semibold font-mono">
            <Calendar className="h-4.5 w-4.5 text-slate-500" />
            <span>Last Updated: June 18, 2026</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 md:px-8 -mt-8 relative z-20">
        
        {/* Intro Highlight Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 mb-10 select-text">
          <p className="font-sans text-xs sm:text-[14px] text-slate-700 leading-relaxed font-semibold">
            Welcome to Balanza Bikes. By purchasing from or using our website, you agree to these legal Terms & Conditions. Please read them carefully to understand your customer guidelines.
          </p>
        </div>

        {/* Editorial Body layout */}
        <div className="space-y-12 select-text px-2 sm:px-4">
          
          {/* Section: Use of Website */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">1</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Use of Website
              </h2>
            </div>
            <div className="pl-8 space-y-3.5 text-xs sm:text-[13px] text-slate-650 font-medium leading-relaxed">
              <p>You agree to use this website only for lawful purposes and in accordance with these Terms.</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 space-y-2">
                <p className="font-bold text-slate-900 uppercase tracking-wide text-[10px]">You must not:</p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Use the website for fraudulent purposes or identity manipulation.</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Attempt unauthorized access to our secure servers or database systems.</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Interfere with website functionality, hosting speed, or transactional components.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Product Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">2</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Product Information
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium space-y-3">
              <p>We strive to ensure that all product descriptions, images, and pricing are accurate. However, typographical errors or variations may occasionally occur.</p>
              <p>We reserve the right to correct errors, modify product information, or cancel orders affected by pricing inaccuracies at any point prior to fulfillment.</p>
            </div>
          </section>

          {/* Section: Orders */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">3</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Orders &amp; Processing
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium space-y-3">
              <p>All orders are subject to availability and formal acceptance by the warehouse.</p>
              <p>We reserves the right to refuse or cancel orders, limit quantities purchased per household, or perform security audits to verify customer parameters before processing of the logistics.</p>
            </div>
          </section>

          {/* Section: Pricing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">4</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Pricing &amp; Taxes
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium space-y-2">
              <p>All prices are displayed in Indian Rupees (INR) unless explicitly stated otherwise.</p>
              <p>Applicable taxes and shipping charges will be clearly displayed during checkout prior to final payment processing.</p>
            </div>
          </section>

          {/* Section: Shipping */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">5</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Shipping
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium space-y-3">
              <p>Delivery timelines are estimates and may vary due to regional factors beyond our control.</p>
              <p>Balanza Bikes shall not be held liable for delays caused by third-party courier partners, weather conditions, strikes, or other unforeseen transit contingencies.</p>
            </div>
          </section>

          {/* Section: Returns & Refunds */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">6</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Returns &amp; Refunds
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
              Returns and refunds are strictly governed by our Returns & Refunds Policy, which is accessible via the main footer index.
            </div>
          </section>

          {/* Section: Product Safety */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-mono text-xs font-black">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Product Safety &amp; Responsibility
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                Parents and legal guardians are entirely responsible for:
              </p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-red-500 mt-0.5">■</span>
                  <span>Supervising children during usage at all times.</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-red-500 mt-0.5">■</span>
                  <span>Ensuring the bike is adjusted correctly for the child's age, weight, and size.</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-red-500 mt-0.5">■</span>
                  <span>Wearing suitable protective gear, including quality certified safety helmets.</span>
                </li>
              </ul>
              
              <div className="bg-red-50 border border-red-150 rounded-2xl p-5 mt-2">
                <p className="text-xs font-bold text-red-950/80 uppercase tracking-wider mb-1">
                  Exclusion of Liability
                </p>
                <p className="text-xs text-red-900/60 leading-relaxed font-semibold">
                  Balanza Bikes shall not be liable for any physical injuries or damages resulting from misuse, improper assembly, lack of supervision, or failure to follow safety instructions.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Intellectual Property */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">8</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Intellectual Property
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-650 font-medium leading-relaxed space-y-2">
              <p>All content on this website, including logos, trademarks, descriptive product images, content text, layouts, designs, copy, and icons, is the exclusive property of Balanza Bikes.</p>
              <p>Usage, reproduction, copying, or alteration of these items without certified written request approval is strictly prohibited.</p>
            </div>
          </section>

          {/* Section: Limitation of Liability */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">9</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Limitation of Liability
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
              To the fullest extent permitted by law, Balanza Bikes shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products, customer manuals, or website.
            </div>
          </section>

          {/* Section: Governing Law */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">10</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Governing Law
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium font-sans">
              These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.
            </div>
          </section>

          {/* Section: Contact Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">11</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Contact Information
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-605 font-semibold space-y-3">
              <p>For questions or formal inquiries regarding these legal terms, write to Balanza support:</p>
              
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-2.5 max-w-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Balanza Bikes Support Desk</h4>
                <p className="text-xs text-slate-600 font-medium">Email: <span className="font-mono font-bold text-slate-900">hello@balanzabikes.com</span></p>
                <p className="text-xs text-slate-600 font-medium">Phone: <a href="tel:+919888963663" className="font-mono font-bold text-slate-900 hover:underline">+91 9888-963-663</a></p>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
