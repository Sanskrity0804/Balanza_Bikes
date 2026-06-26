import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, MessageSquareCode, MessageCircle, HelpCircle, Star, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  badgeText: string;
  icon: 'bike' | 'star' | 'delivery';
  items: FAQItem[];
}

export default function FAQsPage() {
  const { setActivePage } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Categories and real answers designed based on premium standard balance bike queries
  const faqCategories: FAQCategory[] = [
    {
      title: "Why A Balance Bike",
      badgeText: "Why A Balance Bike",
      icon: 'bike',
      items: [
        {
          id: "what-is-balance",
          q: "What is a balance bike?",
          a: "A balance bike is a pedal-free bike that helps children learn balance naturally using their feet. But it's more than just a bike - it's where little feet find courage, tiny hearts discover independence, and confidence begins to grow.\n\nBy mastering balance first, children learn to ride with confidence and often transition to a pedal bike without ever needing training wheels."
        },
        {
          id: "why-not-training",
          q: "Why not just use training wheels like everyone else?",
          a: "Training wheels create a false sense of balance - children learn to rely on them instead of balancing on their own. When the wheels come off, they must unlearn that habit.\n\nWith a balance bike, kids learn true balance from day one, making the transition to a pedal bike faster, easier, and more confident."
        },
        {
          id: "what-age-start",
          q: "At what age can my child start using Balanza?",
          a: "The Balanza Mini is designed for toddlers from 12 months and above. The key indicator is whether your child can walk independently and place both feet flat on the ground while seated on the bike.\n\nEvery child develops at their own pace -if they can walk, they are likely ready to begin their Balanza journey."
        }
      ]
    },
    {
      title: "About The Balanza Mini",
      badgeText: "About the Balanza Mini",
      icon: 'star',
      items: [
        {
          id: "what-makes-different",
          q: "What makes the Balanza Mini different?",
          a: "The Balanza Mini is thoughtfully designed for toddlers from 12 months onwards -making it the perfect first step into independent movement.\n\nEvery detail is sized for young riders - from its lightweight frame and ultra-low seat height to its easy-grip handlebars and stable design. Little ones can get on and off with confidence, keep both feet firmly on the ground, and explore at their own pace while feeling safe and in control.\n\nMore than just something they play with, the Balanza Mini helps build balance, coordination, confidence, and independence through movement.\n\nThis is not a toy. It's their first vehicle -their first taste of freedom."
        },
        {
          id: "what-colours",
          q: "What colour does it come in?",
          a: "The Balanza Mini comes in two carefully chosen colours — ● Mint Green and ● Lavender. Both are soft, modern, and designed to look as good in your home as they do on an Instagram reel. Choosing will be the hardest part."
        },
        {
          id: "does-need-assembly",
          q: "Does it need Assembly at home?",
          a: "The Balanza Mini needs minimal and very easy assembly. Please refer to the assembly instructions included in the box. The whole process takes under 10 minutes and requires no special tools."
        }
      ]
    },
    {
      title: "Ordering & Delivery",
      badgeText: "Ordering & Delivery",
      icon: 'delivery',
      items: [
        {
          id: "where-deliver",
          q: "Where do you Deliver?",
          a: "We deliver PAN India - so no matter where you are, your little one's first ride is on its way to you."
        },
        {
          id: "what-payment",
          q: "What payment methods do you accept?",
          a: "We accept UPI, credit/debit cards, net banking, and popular wallets. COD is available at select PIN codes -you will see the option at checkout."
        },
        {
          id: "refund-policy",
          q: "What is your refund policy?",
          a: "We offer a 7-day return window from the date of delivery, provided the bike is unused and in its original packaging. Just get in touch with your order details and we will sort it out quickly. Refunds are processed within 5-7 business days of receiving the returned item"
        }
      ]
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-screen bg-[#121212] font-sans pb-24 text-left select-none animate-fade-in text-white">
      
      {/* Editorial Dark Header Area */}
      <div className="mx-auto max-w-4xl px-4 md:px-8 pt-16 pb-8">
        
        {/* Back Button Navigation */}
        <button 
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-white transition-all mb-8 bg-white/5 hover:bg-white/10 active:scale-95 px-3.5 py-1.5 rounded-full border border-white/5 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#A7E22E]" />
          Back to main shop
        </button>

        {/* Brand visual tags */}
        <span className="text-[10px] font-black tracking-widest uppercase text-[#88B826] block mb-2 font-mono">
          BALANZA MINI — FAQS
        </span>
        
        {/* Main Title of FAQs */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-black text-white tracking-tight uppercase leading-[1.05] max-w-2xl">
          Your questions, answered honestly.
        </h1>
        
        {/* Subtitle desc */}
        <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold max-w-xl mt-3 leading-relaxed">
          Everything parents want to know before gifting their toddler their very first ride.
        </p>

        {/* Short Thick Horizontal Green underline */}
        <div className="h-1 w-12 bg-[#A7E22E] rounded mt-4.5" />
      </div>

      {/* Main FAQs Accordeon Section */}
      <div className="mx-auto max-w-4xl px-4 md:px-8 space-y-10">
        
        {faqCategories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-4">
            
            {/* Category Pill-Badge Header */}
            <div className="flex select-none">
              <span className="inline-flex items-center gap-1.5 bg-[#E1F3BD] text-[#2E4A15] font-sans font-black text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-full shadow-sm border border-[#A7E22E]/25">
                {cat.icon === 'bike' && (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="5.5" cy="17.5" r="3.5" />
                    <circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h3" />
                  </svg>
                )}
                {cat.icon === 'star' && <Star className="h-3.5 w-3.5 fill-[#2E4A15]" />}
                {cat.icon === 'delivery' && <Truck className="h-3.5 w-3.5" />}
                {cat.badgeText}
              </span>
            </div>

            {/* Accordion List */}
            <div className="space-y-2.5">
              {cat.items.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className="bg-[#1F1F1F] rounded-2xl border border-slate-800/60 overflow-hidden transition-all duration-300"
                  >
                    {/* Accordion header button */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="w-full px-5 py-4.5 sm:py-5 flex items-center justify-between text-left hover:bg-[#282828] active:bg-[#2c2c2c] transition-all duration-200 cursor-pointer"
                    >
                      <span className="font-sans text-xs sm:text-[14px] font-black text-white tracking-wide pr-4">
                        {item.q}
                      </span>
                      <ChevronDown 
                        className={`h-4.5 w-4.5 text-[#88B826] transition-transform duration-300 shrink-0 ${
                          isExpanded ? 'rotate-180 text-[#A7E22E]' : ''
                        }`} 
                      />
                    </button>

                    {/* Accordion body container with smooth height transitions */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-slate-800/30 text-xs sm:text-[13px] text-slate-350 leading-relaxed select-text font-medium font-sans whitespace-pre-line">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        ))}

        {/* Still Not Sure Block conforming strictly to the screenshot layout */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-slate-800/50 mt-12 flex flex-col sm:flex-row items-start gap-4 select-text">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-800/40 border border-[#A7E22E]/20 flex items-center justify-center shrink-0 text-[#A7E22E]">
            <MessageCircle className="h-5.5 w-5.5 stroke-[2]" />
          </div>
          <div>
            <h4 className="font-display text-sm sm:text-base font-black text-white leading-tight mb-1.5 uppercase tracking-wide">
              Still not sure? We are happy to help.
            </h4>
            <p className="font-sans text-xs sm:text-[13px] text-slate-400 leading-relaxed font-semibold">
              Reach out to the Balanza team on{' '}
              <a 
                href="mailto:hello@balanzabikes.com" 
                className="text-white hover:text-[#A7E22E] underline underline-offset-3 font-black transition-colors"
              >
                hello@balanzabikes.com
              </a>{' '}
              — we will answer every question before your little one takes their first ride.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
