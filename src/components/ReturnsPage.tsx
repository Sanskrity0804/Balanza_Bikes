import React from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, HelpCircle, Mail, Phone, ShoppingBag, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ReturnsPage() {
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
            <RefreshCw className="h-4.5 w-4.5 text-[#A7E22E] animate-spin-slow" />
            <span className="text-[10px] font-black tracking-widest uppercase text-[#A7E22E] block font-mono">
              Balanza Bikes — Customer Support
            </span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.95] max-w-2xl">
            Returns &amp; Refunds
          </h1>
          
          <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold max-w-xl mt-3 leading-relaxed">
            We want you and your child to love your Balanza Bike. Read our guidelines below.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 md:px-8 -mt-8 relative z-20">
        
        {/* Intro Highlight Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-150 mb-10 select-text">
          <p className="font-sans text-xs sm:text-[14px] text-slate-700 leading-relaxed font-semibold">
            Balanza products are designed from scratch using premium materials to ensure high durability and toddler satisfaction. If for any reason things do not proceed as planned, our support architecture is designed to resolve your case quickly.
          </p>
        </div>

        {/* Editorial Body layout */}
        <div className="space-y-12 select-text px-2 sm:px-4">
          
          {/* Section: Return Eligibility */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">1</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Return Eligibility
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                You may request a return within <strong className="text-slate-900 font-black">7 days of delivery</strong> under the following specific eligibility metrics:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="flex items-start gap-3 text-xs text-slate-600 font-semibold bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <CheckCircle2 className="h-5 w-5 text-[#88B826] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[#2E4A15] uppercase tracking-wide text-[10px] font-black mb-1">Wrong Item Received</span>
                    <p className="text-slate-500 font-medium">The brand dispatched an incorrect variant, color option, or accessory kit from our original registry.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-600 font-semibold bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <CheckCircle2 className="h-5 w-5 text-[#88B826] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[#2E4A15] uppercase tracking-wide text-[10px] font-black mb-1">Manufacturing Defect</span>
                    <p className="text-slate-500 font-medium">The frame, fork, tires, or handlebars arrive with severe structural anomalies that compromise balance or safety.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Non-Returnable Conditions */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-mono text-xs font-black">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Non-Returnable Conditions
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-semibold">
                Returns are strictly refused under the following standard parameters:
              </p>
              <ul className="space-y-2.5">
                {[
                  "The balance bike has been used extensively outdoors, showing tire abrasions, tarmac scratches, or bearing wear.",
                  "The item is damaged directly or indirectly due to customer misuse, improper assembly, drops, or inadequate storage.",
                  "The formal return prompt is registered outside our designated 7-day post-delivery service window."
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-600 font-medium">
                    <span className="text-orange-600 mt-0.5 font-bold">✕</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section: Return Process */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">2</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Return Process
              </h2>
            </div>
            <div className="pl-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-center relative">
                  <span className="text-2xl font-black text-[#88B826] font-mono block mb-1">01</span>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">Email Details</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Write us an email mentioning your unique order ID accompanied by clear photos of the issue.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-center relative">
                  <span className="text-2xl font-black text-[#88B826] font-mono block mb-1">02</span>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">Team Audit</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Our compliance crew will audit your request within 2 working business days.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-center relative">
                  <span className="text-2xl font-black text-[#88B826] font-mono block mb-1">03</span>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mb-1">Pickup Setup</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Once approved, we coordinate a partner pickup from your doorstep or provide clear shipping help.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Refunds */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">3</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Refund Rules
              </h2>
            </div>
            <div className="pl-8 space-y-3.5 text-xs sm:text-[13px] text-slate-650 font-medium leading-relaxed">
              <p>Refunds are initiated only after the returned balance bike arrives back at our warehouse and passes rigorous quality audits to assess original, unused conditions.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <ShoppingBag className="h-4.5 w-4.5 text-[#88B826] shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-600 font-medium">Card/UPI amounts are credited directly to your original payment medium inside <strong className="font-bold text-slate-800">5-7 business days</strong>.</span>
                </div>
                <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <Landmark className="h-4.5 w-4.5 text-[#88B826] shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-600 font-medium">COD (Cash on Delivery) completed invoices will be refunded safely via bank transfer after verifying your IBAN/bank descriptors.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Exchange Policy */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">4</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Exchange Policy
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-semibold">
              If your customized package arrives with damage or features are missing, we will offer a swift, complete replacement at absolutely <strong className="text-slate-900 font-black font-mono">no extra fee</strong>. Our goal is 100% customer coordination.
            </div>
          </section>

          {/* Assistant Help */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">5</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Need Assistance?
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <p className="text-xs text-slate-600 font-medium">Reach our customer assistance desk directly at any point to clear any confusion:</p>
              
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
                    <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400">Direct Helpline</span>
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
