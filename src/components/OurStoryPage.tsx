import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Compass, ShieldCheck, Star, Users, Award, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OurStoryPage() {
  const { setActivePage } = useApp();

  const values = [
    {
      icon: Compass,
      title: "Encouraging Exploration",
      description: "We design balance bikes to inspire toddlers and children to step outside, face new terrains, and build strong motor coordination with absolute confidence."
    },
    {
      icon: Heart,
      title: "Parent-First Caring",
      description: "Our bikes are engineered by parents, for parents. This means tool-free assembly, child-safe finishes, puncture-proof wheels, and zero maintenance overhead."
    },
    {
      icon: ShieldCheck,
      title: "Safety is Sovereign",
      description: "Every joint, weld, rounded edge, and paint coating is tested to international child safety regulations. Safe play is non-negotiable for Balanza."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] font-sans pb-20 select-none animate-fade-in text-left">
      
      {/* Editorial Header Hero */}
      <div className="bg-[#A7E22E] text-slate-950 pt-16 pb-24 relative overflow-hidden px-4 md:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-5xl relative z-10">
          {/* Back button navigation */}
          <button 
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-950/70 hover:text-slate-950 transition-all mb-6 bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1.5 rounded-full border border-slate-950/5 cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to main shop
          </button>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight uppercase leading-[0.95] max-w-3xl">
            Our Story
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-950/80 font-semibold max-w-xl mt-3 leading-relaxed">
            Discover the passion, the parent-driven philosophy, and the meticulous engineering behind our lightweight balance bikes.
          </p>
        </div>

        {/* Diagonal Wave Clip */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#FDFDFD]" style={{ clipPath: 'polygon(100% 100%, 0 100%, 0 0, 45% 70%, 75% 30%, 100% 90%)' }}></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-8 -mt-8 relative z-20">
        
        {/* Core Narrative Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Landscape Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 rounded-2xl bg-slate-50 border border-slate-100/50 shadow-inner"></div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-lg aspect-square sm:aspect-video lg:aspect-square">
              <img
                src="/images/camping_story_1779786774831.png"
                alt="Balanza Camping Outdoors Balance Bike Journey"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover shadow transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
            {/* Visual aesthetic badge overlay */}
            <div className="absolute -bottom-4 -right-4 bg-slate-950 text-[#A7E22E] p-4 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800">
              <StarsBadge className="h-6 w-6 stroke-[1.8] animate-spin-slow text-[#A7E22E]" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">DESIGN CONTEXT</p>
                <p className="text-xs font-black uppercase tracking-wide">100% Parent Made</p>
              </div>
            </div>
          </div>

          {/* Letter / Editorial textual block */}
          <div className="lg:col-span-7 space-y-4 text-slate-655 select-text pt-4 lg:pt-0">
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
              HOW IT ALL BEGAN
            </h2>
            <div className="h-[3px] w-12 bg-[#A7E22E] mb-6" />

            <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              Balanza began with a simple moment at home. As parents, we were looking for something that would encourage our little one to move, explore, and grow — without relying on digital screens for entertainment.
            </p>

            <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
              When our youngster first got on a balance bike, he wasn’t riding it. He was dragging it around the house, curious about this new mechanical companion. Day after day, he kept coming back to it.
            </p>

            <blockquote className="font-display font-black text-slate-950 border-l-3 border-[#A7E22E] pl-4 py-1 italic my-4 text-xs sm:text-sm">
              &ldquo;What started as dragging slowly turned into pushing. Pushing turned into gliding. And before we knew it, he was balancing with pure confidence.&rdquo;
            </blockquote>

            <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
              We watched his determination grow. We watched his independence emerge. Most importantly, we watched him discover what he was capable of doing. That experience became the baseline inspiration behind Balanza.
            </p>

            <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
              We believe every child deserves a strong start — one filled with physical movement, muscle memory, curiosity, and outdoor play. Childhood should be spent discovering, not just scrolling.
            </p>
          </div>

        </div>

        {/* Core Belief System / Core Values Grid */}
        <div className="mt-16 text-center">
          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-extrabold text-slate-950 uppercase tracking-tight">
            OUR GUIDING BELIEF SYSTEM
          </h2>
          <div className="h-[3px] w-12 bg-[#A7E22E] mx-auto mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A7E22E]/10 text-slate-900 mb-5 border border-[#A7E22E]/20">
                    <IconComp className="h-6 w-6 stroke-[2]" />
                  </div>
                  <h3 className="font-display text-xs sm:text-sm font-black tracking-wider uppercase text-slate-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed font-semibold">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote Call to Action footer */}
        <div className="mt-16 bg-[#A7E22E]/15 rounded-3xl p-6 sm:p-8 border border-[#A7E22E]/25 text-center">
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 block mb-1">A STATEMENT OF PURPOSE</span>
          <p className="font-display text-base sm:text-lg font-black text-slate-950 uppercase leading-snug max-w-2xl mx-auto">
            &ldquo;The first ride is never just a ride. It is the very first taste of independence. and that is a journey worth celebrating.&rdquo;
          </p>
          
          <button
            onClick={() => {
              setActivePage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-6 bg-slate-950 text-white hover:bg-white hover:text-slate-950 border border-slate-950 font-black text-xs uppercase tracking-widest py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            Get In Touch
          </button>
        </div>

      </div>

    </div>
  );
}

function StarsBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 21l8.982-5.096L21 21l-.813-5.096c-.143-.895.421-1.748 1.303-1.956L24 13.5l-2.51-.448a1.691 1.691 0 011.303-1.956L21 3l-2.018 5.096a1.691 1.691 0 01-1.303 1.956L9 3l.813 5.096c.143.895-.421 1.748-1.303 1.956L6 10.5l2.51.448c.882.158 1.446 1.011 1.303 1.956z"
      />
    </svg>
  );
}
