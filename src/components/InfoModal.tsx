import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Truck, RotateCcw, ShieldCheck, FileText, ChevronDown, CheckCircle, Mail, Phone, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InfoModal() {
  const { 
    isInfoModalOpen, 
    setInfoModalOpen, 
    infoModalTab, 
    setInfoModalTab 
  } = useApp();

  if (!isInfoModalOpen) return null;

  // Real copy databases
  const faqs = [
    {
      q: "What age group is Balanza Bikes designed for?",
      a: "Balanza Bikes are meticulously designed for toddlers and children aged 1.5 to 5 years. The low-slung step-through frame, adjustable saddle seat, and premium lightweight steering handle allow little ones to safely master balance and coordination at their own natural pace."
    },
    {
      q: "What makes Balanza better than pedal bikes with training wheels?",
      a: "Training wheels teach children how to pedal but not how to steer or balance, which can delay true bicycling development. A balance bike teaches steering and weight distribution first. This builds core body core strength, coordination, and confidence, enabling an immediate and seamless transition to a pedal bike without training support later on."
    },
    {
      q: "Are the tires puncture-proof or do they require air?",
      a: "Our popular LiteRoll series features tires made of advanced puncture-proof EVA polymer which requires zero maintenance and never needs air. Our Neo Retro series utilizes specialized pneumatic air-filled high-traction tires suited for rough outdoor trail terrains."
    },
    {
      q: "Can the saddle seat and handlebars be adjusted?",
      a: "Yes, absolutely! Both the saddle seat post and the steering handlebars are equipped with child-safe quick-release clamping mechanisms. The seat adjusts vertically from 30cm to 44cm to guarantee comfort as your toddler grows."
    },
    {
      q: "How long does assembly take?",
      a: "Balanza Bikes arrive 85% pre-assembled. Thanks to our quick-clamp, tool-free design, you have them fully functional in under 5 minutes. A clear manual sheet and dynamic video link are packed in every box."
    }
  ];

  const shippingInfo = {
    title: "Shipping & Delivery Surcharges",
    intro: "We provide secure direct-to-door shipping on all balance bikes across India, reaching over 20,000 postal pin codes smoothly.",
    points: [
      {
        title: "100% Free Shipping",
        desc: "There are no hidden shipping fees, freight charges, or dispatch surcharges. Every balance bike, frame accessories kit, and kid helmet is shipped completely free."
      },
      {
        title: "Estimated Timelines",
        desc: "Orders are processed and dispatched within 24 hours. Metro cities enjoy delivery in 2-4 working days, while the rest of India takes 4-7 working days."
      },
      {
        title: "Live Order Tracking",
        desc: "A custom live tracking link (containing active carrier logs) is sent via WhatsApp, SMS, and Email as soon as your parcel leaves our central facility."
      },
      {
        title: "Safety Insured Packaging",
        desc: "Our bikes are shipped in heavy-duty 5-ply corrugated cardboard boxes with pre-molded protective pads inside to protect paint finishes during transit."
      }
    ]
  };

  const returnsInfo = {
    title: "14-Day Hassle-Free Returns & Refunds",
    intro: "We want you and your little explorer to fall in love with Balanza. If for any reason you are not completely happy, we stand behind our products with a robust return framework.",
    points: [
      {
        title: "14-Day Window",
        desc: "You can request a full refund or exchange within 14 calendar days of receiving your package. Simply drop us an email or head to your profile."
      },
      {
        title: "Doorstep Pickup",
        desc: "Once a return case is raised, we schedule a free reverse-pickup courier to collect the box directly from your address within 24 to 48 hours."
      },
      {
        title: "Condition Requirements",
        desc: "The bike must remain in clean, unridden outdoor state, packed safely back inside its original catalog carton, including all clamps, pads, and manuals."
      },
      {
        title: "3-5 Day Refunds",
        desc: "Once the package inspection is finalized, refunds are initiated back to the original source payment (Card, Net Banking, or UPI) inside 3-5 days."
      }
    ]
  };

  const privacyPolicy = {
    title: "Security & Personal Data Privacy",
    intro: "We hold your family's safety and data security to the absolute highest standard. We do not engage in trading, renting, or selling customer records.",
    sections: [
      {
        heading: "1. Information We Gather",
        text: "We collect basic contact parameters exclusively used for order shipping, notification updates, and account creation including full name, delivery address, validation mobile number, and receipt email."
      },
      {
        heading: "2. Transaction Gateways",
        text: "All payment checkouts are managed through secure, fully encrypted industry leaders (Razorpay API frameworks). Your raw credit card details, UPI pins, or bank tokens are never archived on our servers or exposed to third parties."
      },
      {
        heading: "3. Direct Communications",
        text: "We send promotional emails, newsletters, and delivery notifications only to subscribers who have requested them. Every transmission carries an instant unsubscribe link."
      }
    ]
  };

  const termsInfo = {
    title: "Terms of Service & Usage Agreements",
    intro: "By purchasing from Balanza Bikes or accessing this ecommerce interface, you accept and agree to follow these core guidelines.",
    sections: [
      {
        heading: "1. Safety & Adult Supervision",
        text: "Balanza Balance Bikes must be ridden under close parent/adult supervision. We strongly encourage and advise wearing certified protective helmets during rides."
      },
      {
        heading: "2. Age & Weight Restrictions",
        text: "Our balance bikes are engineered exclusively for toddlers and children. The structural load capacity supports children weighing up to 30kg. It is not suitable for older children or adult weight standards."
      },
      {
        heading: "3. 1-Year Structural Frame Warranty",
        text: "Every Balanza purchase includes a complimentary 1-Year frame warranty which covers major manufacturing, paint coating, or steel/magnesium jointing defects. Normal wear-and-tear, scratches, or outdoor rust are excluded."
      }
    ]
  };

  // Tab definitions
  const tabs = [
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms', icon: FileText }
  ] as const;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setInfoModalOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white font-sans w-full max-w-4xl max-h-[85vh] md:max-h-[75vh] rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row text-left select-text"
        >
          
          {/* Close button top right */}
          <button
            onClick={() => setInfoModalOpen(false)}
            className="absolute top-5 right-5 z-20 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-950 hover:text-[#A7E22E] flex items-center justify-center text-slate-500 transition-all active:scale-95 cursor-pointer border border-slate-950/5"
            title="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Left Navigation: Tabs List */}
          <div className="w-full md:w-1/4 bg-[#FAFAF9] border-r border-slate-100 p-6 flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-x-visible items-center md:items-stretch scrollbar-none shrink-0 pt-16 md:pt-14 select-none">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = infoModalTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setInfoModalTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-[11px] font-black tracking-wider uppercase transition-all duration-250 cursor-pointer text-left whitespace-nowrap md:whitespace-normal w-auto md:w-full shrink-0 ${
                    isActive
                      ? 'bg-[#A7E22E] text-slate-950 shadow-sm border border-[#A7E22E] scale-[1.02]'
                      : 'text-slate-600 hover:bg-slate-150 hover:text-slate-950 border border-transparent'
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}

            <div className="hidden md:block mt-auto pt-6 text-slate-400 font-sans text-[10px] leading-relaxed border-t border-slate-200/60 font-semibold select-none">
              <p className="text-slate-950 font-bold mb-1">Customer Support</p>
              <p className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer mb-1">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                hello@balanzabikes.com
              </p>
              <a href="tel:+919888963663" className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                +91 9888-963-663
              </a>
            </div>
          </div>

          {/* Right Area: Content Container */}
          <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto max-h-[55vh] md:max-h-full">
            
            {/* Header / Intro section */}
            <div className="mb-8 pr-8 select-none">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Balanza Care Center</span>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                  {infoModalTab === 'faqs' && "Frequently Asked Questions"}
                  {infoModalTab === 'shipping' && shippingInfo.title}
                  {infoModalTab === 'returns' && returnsInfo.title}
                  {infoModalTab === 'privacy' && privacyPolicy.title}
                  {infoModalTab === 'terms' && termsInfo.title}
                </h3>
              </div>
              <div className="h-1 w-12 bg-[#A7E22E] mt-3" />
            </div>

            {/* Content Switch */}
            <div className="space-y-6">
              
              {/* FAQs CONTENT */}
              {infoModalTab === 'faqs' && (
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-slate-50 hover:bg-slate-100/50 p-5 rounded-2xl border border-slate-150 transition-all duration-200">
                      <p className="font-display text-xs sm:text-sm font-black tracking-tight text-slate-950 mb-2 flex items-start gap-2">
                        <span className="bg-[#A7E22E] text-slate-950 text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md mt-0.5 shrink-0">Q</span>
                        {faq.q}
                      </p>
                      <p className="font-sans text-xs text-slate-600 leading-relaxed font-semibold pl-6 border-l-2 border-slate-200">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* SHIPPING CONTENT */}
              {infoModalTab === 'shipping' && (
                <div className="space-y-5">
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed font-bold">
                    {shippingInfo.intro}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {shippingInfo.points.map((p, idx) => (
                      <div key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                        <p className="font-display text-xs font-black uppercase text-slate-950 tracking-wider mb-1.5 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#A7E22E]" />
                          {p.title}
                        </p>
                        <p className="font-sans text-[11px] text-slate-550 leading-relaxed font-semibold">
                          {p.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RETURNS CONTENT */}
              {infoModalTab === 'returns' && (
                <div className="space-y-5">
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed font-bold">
                    {returnsInfo.intro}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {returnsInfo.points.map((p, idx) => (
                      <div key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                        <p className="font-display text-xs font-black uppercase text-slate-950 tracking-wider mb-1.5 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#A7E22E]" />
                          {p.title}
                        </p>
                        <p className="font-sans text-[11px] text-slate-550 leading-relaxed font-semibold">
                          {p.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRIVACY CONTENT */}
              {infoModalTab === 'privacy' && (
                <div className="space-y-5">
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed font-bold">
                    {privacyPolicy.intro}
                  </p>
                  <div className="space-y-4">
                    {privacyPolicy.sections.map((s, idx) => (
                      <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <p className="font-display text-xs font-black uppercase text-slate-950 tracking-wider mb-2">
                          {s.heading}
                        </p>
                        <p className="font-sans text-[11px] text-slate-600 leading-relaxed font-semibold">
                          {s.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TERMS CONTENT */}
              {infoModalTab === 'terms' && (
                <div className="space-y-5">
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed font-bold">
                    {termsInfo.intro}
                  </p>
                  <div className="space-y-4">
                    {termsInfo.sections.map((s, idx) => (
                      <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <p className="font-display text-xs font-black uppercase text-slate-950 tracking-wider mb-2">
                          {s.heading}
                        </p>
                        <p className="font-sans text-[11px] text-slate-600 leading-relaxed font-semibold">
                          {s.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom mini disclaimer bar */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-semibold select-none">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#38BDF8]" />
                Compliance certified sandbox ecommerce channel.
              </span>
              <span>Last updated: June 2026</span>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
