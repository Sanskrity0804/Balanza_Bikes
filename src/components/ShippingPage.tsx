import React from 'react';
import { ArrowLeft, Truck, Package, Clock, ShieldCheck, Mail, Phone, MapPin, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ShippingPage() {
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
            <Truck className="h-4.5 w-4.5 text-[#A7E22E]" />
            <span className="text-[10px] font-black tracking-widest uppercase text-[#A7E22E] block font-mono">
              Balanza Bikes — Shipping Hub
            </span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.95] max-w-2xl">
            Shipping &amp; Delivery
          </h1>
          
          <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold max-w-xl mt-3 leading-relaxed">
            At Balanza Bikes, we work hard to get your little rider’s bike delivered quickly and safely.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 md:px-8 -mt-8 relative z-20">
        
        {/* Intro Highlight Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 mb-10 select-text">
          <p className="font-sans text-xs sm:text-[14px] text-slate-700 leading-relaxed font-semibold">
            We understand how eagerly parents and toddlers anticipate their very first balance bike. Every package is sealed in high-density customized cardboard blocks and reinforced at the hubs to protect your purchase in transit.
          </p>
        </div>

        {/* Editorial Body layout */}
        <div className="space-y-12 select-text px-2 sm:px-4">
          
          {/* Section: Delivery Timelines */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">1</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Delivery Timelines
              </h2>
            </div>
            <div className="pl-8 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
                  <div className="h-8 w-8 rounded-full bg-[#E1F3BD]/60 flex items-center justify-center text-[#2E4A15] mb-2">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">Processing Window</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Orders are processed &amp; packaged carefully within <strong className="text-slate-800 font-bold">1-2 business days</strong> of payment.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
                  <div className="h-8 w-8 rounded-full bg-[#E1F3BD]/60 flex items-center justify-center text-[#2E4A15] mb-2">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">Transit Window</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Delivery usually takes <strong className="text-slate-800 font-bold">3-7 business days</strong> across mainstream India pins.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
                  <div className="h-8 w-8 rounded-full bg-[#E1F3BD]/60 flex items-center justify-center text-[#2E4A15] mb-2">
                    <Compass className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">Remote Locations</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Isolated territories or remote regions may require some additional transit time.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Section: Shipping Charges */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">2</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Shipping Charges
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 font-medium">
                  <span className="text-[#A7E22E] font-bold">✓</span>
                  <span><strong className="text-slate-900 font-bold">Free shipping</strong> applied on all prepaid orders across the nation.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 font-medium">
                  <span className="text-[#A7E22E] font-bold">✓</span>
                  <span>Additional transit or convenience charges (if any) will be calculated transparently at checkout.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Order Tracking */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">3</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Order Tracking
              </h2>
            </div>
            <div className="pl-8 space-y-3 text-xs sm:text-[13px] text-slate-605 font-medium leading-relaxed">
              <p>Once your order has been carefully packaged and dispatched from our logistics center, you will immediately receive:</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 mt-2 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#88B826] rounded-full" />
                  Your unique <strong className="text-slate-900">Tracking ID</strong> sent securely via Email, SMS, or WhatsApp.
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#88B826] rounded-full" />
                  A real-time tracking link to monitor your cargo as it advances to your doorstep.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Delivery Partners */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">4</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Delivery Partners
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-semibold">
              We work with trusted courier partners to ensure safe and timely delivery. Each step is logged securely in our cloud logs to maintain dynamic status correctness.
            </div>
          </section>

          {/* Help Contact */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">5</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Need Help?
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <p className="text-xs text-slate-600 font-medium">Our dispatch help desk is available for all logistical inquiries:</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white rounded-2xl max-w-xs cursor-pointer select-all hover:bg-slate-800 transition-colors">
                  <Mail className="h-4.5 w-4.5 text-[#A7E22E] shrink-0" />
                  <div>
                    <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400">Direct Support Email</span>
                    <span className="text-xs font-bold font-mono">hello@balanzabikes.com</span>
                  </div>
                </div>

                <a href="tel:+919888963663" className="flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white rounded-2xl max-w-xs cursor-pointer hover:bg-slate-800 transition-colors">
                  <Phone className="h-4.5 w-4.5 text-[#A7E22E] shrink-0" />
                  <div>
                    <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400">Logistics Helpline</span>
                    <span className="text-xs font-bold font-mono">+91 9888-963-663</span>
                  </div>
                </a>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
