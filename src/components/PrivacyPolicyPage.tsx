import React from 'react';
import { ArrowLeft, Shield, Lock, FileText, Calendar, Mail, Globe, Users, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PrivacyPolicyPage() {
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
            <Shield className="h-4.5 w-4.5 text-[#A7E22E]" />
            <span className="text-[10px] font-black tracking-widest uppercase text-[#A7E22E] block font-mono">
              Balanza Bikes — Privacy Center
            </span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.95] max-w-2xl">
            Privacy Policy
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
            Welcome to Balanza Bikes. We respect your privacy and are committed to protecting your personal information. This Privacy Policy details how we handle, process, and protect the data you share when navigating our storefront.
          </p>
        </div>

        {/* Editorial Body layout */}
        <div className="space-y-12 select-text px-2 sm:px-4">
          
          {/* Section: Information We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">1</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Information We Collect
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                When you visit our website or place an order, we may collect the following essential transactional and profile details:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                {[
                  "Name & contact descriptors",
                  "Verified email addresses",
                  "Direct operational phone numbers",
                  "Shipping and billing addresses",
                  "Protected payment information (processed via secure gateway partners)",
                  "Historical order registry",
                  "Website use & device analytics logs through cookies"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#88B826]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: How We Use Your Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">2</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                How We Use Your Information
              </h2>
            </div>
            <div className="pl-8 space-y-3.5">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                We employ your data strictly for legitimate business reasons and context fulfillment:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Process, fulfill, and efficiently dispatch orders securely to your doorstep.",
                  "Communicate vital shipping status alerts or technical purchase documentation.",
                  "Deliver responsive support, troubleshooting, and custom guide lookups.",
                  "Continuously optimize the functional navigation performance of our mobile and desktop web experiences.",
                  "Dispatch gentle, periodic brand updates or promotions where explicitly consented."
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-650 font-medium">
                    <span className="text-[#A7E22E] mt-0.5 shrink-0">✓</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section: Payment Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">3</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Payment Security
              </h2>
            </div>
            <div className="pl-8 space-y-3">
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex gap-3.5 items-start">
                <Lock className="h-5 w-5 text-[#88B826] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Guaranteed Financial Encapsulation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    We do not store your complete payment card details. Payments are processed through secure, industry-leading third-party payment gateways conforming to stringent certification protocols.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Cookies */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">4</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Cookies
              </h2>
            </div>
            <div className="pl-8 space-y-3 text-xs sm:text-[13px] text-slate-650 font-medium leading-relaxed">
              <p> Our website may use cookies to improve user experiences, analyze traffic flows accurately, and remember customer settings. </p>
              <p>You may easily disable or customize cookies through your personal browser configuration preferences.</p>
            </div>
          </section>

          {/* Section: Information Sharing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">5</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Information Sharing
              </h2>
            </div>
            <div className="pl-8 space-y-3">
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium font-sans">
                We strictly govern our distribution boundaries: **We do not sell or rent your personal information to third parties.**
              </p>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                We only dispatch information when strictly necessary to these trusted agencies:
              </p>
              <ul className="space-y-2 pl-3">
                <li className="list-disc text-xs text-slate-600 font-semibold">Our integrated logistical delivery partners.</li>
                <li className="list-disc text-xs text-slate-600 font-semibold">Verified digital payment processors.</li>
                <li className="list-disc text-xs text-slate-600 font-semibold">Authorized technology hosting services.</li>
                <li className="list-disc text-xs text-slate-600 font-semibold">Government or regulatory authorities where mandated by law.</li>
              </ul>
            </div>
          </section>

          {/* Section: Data Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">6</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Data Security
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
              We implement industry-standard physical and technical security measures to safeguard your personal parameters against unauthorized breach scenarios. Please note, however, that no online medium offers absolute, perfect protection metrics.
            </div>
          </section>

          {/* Section: Children's Privacy */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">7</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Children's Privacy
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
              Our balance bikes are engineered purely for children, but actual financial web transactions must be made by verified parents or legal adult guardians. We do not knowingly collect personal descriptors directly from children.
            </div>
          </section>

          {/* Section: Your Rights */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">8</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Your Rights
              </h2>
            </div>
            <div className="pl-8 space-y-3 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
              <p>As a valued legal customer, you may prompt the following actions under specific local guidelines:</p>
              <ul className="space-y-2 text-slate-600 font-semibold pl-1.5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#A7E22E] rounded-full" />
                  Request direct access to records of your personal data inside our cloud database.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#A7E22E] rounded-full" />
                  Correct outdated profile parameters.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#A7E22E] rounded-full" />
                  Request complete data deletion where legally permitted.
                </li>
              </ul>
              <p className="pt-2 font-bold text-slate-800">
                To execute any of these inquiries, write to our data protection team:
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-mono select-all">
                <Mail className="h-3.5 w-3.5 text-[#A7E22E]" />
                <span>hello@balanzabikes.com</span>
              </div>
            </div>
          </section>

          {/* Section: Changes to This Policy */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-[#E1F3BD] text-[#2E4A15] flex items-center justify-center font-mono text-xs font-black">9</span>
              <h2 className="font-display text-md sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                Changes to This Policy
              </h2>
            </div>
            <div className="pl-8 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
              We reserves the right to make modifications to this Privacy Policy. Any official optimizations will be posted immediately on this live index.
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
