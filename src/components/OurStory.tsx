import React, { useState } from 'react';
import { ArrowUpRight, X, Sparkles, Heart, HelpCircle } from 'lucide-react';

export default function OurStory() {
  const [isStoryModalOpen, setStoryModalOpen] = useState(false);

  return (
    <section id="our-story" className="relative bg-transparent pt-8 pb-8 md:pt-12 md:pb-12 select-none">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 md:gap-12">
          
          {/* Left Column - Landscape Image */}
          <div className="relative flex justify-center items-center lg:col-span-6">
            <div className="absolute inset-0 rounded-2xl bg-slate-50 border border-slate-100/50 shadow-inner"></div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-xl w-full h-full max-h-[400px]">
              <img
                src="/images/camping_story_1779786774831.png"
                alt="Story camping backdrop with balance bike"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover shadow transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Right Column - Text editorial */}
          <div className="flex flex-col justify-center items-start lg:col-span-6 text-left">
            <span className="text-xs font-bold tracking-widest text-[#8D9E7D] uppercase mb-4 block">
              WHO WE ARE
            </span>
            
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl leading-tight mb-4 uppercase">
              Our Story
            </h2>
            
            <p className="font-sans text-sm text-slate-600 leading-relaxed mb-6">
              Balanza began with a simple moment at home. As parents, we were looking for something that would encourage our little one to move, explore, and grow — without relying on screens for entertainment.
            </p>

            <p className="font-sans text-sm text-slate-650 leading-relaxed mb-8">
              When our child first got on a balance bike, he wasn’t riding it. He was dragging it around the house, curious about this new companion. Day after day, he kept coming back to it, and before we knew it, he was balancing with confidence.
            </p>
            
            <button
              onClick={() => setStoryModalOpen(true)}
              className="group flex items-center gap-2 rounded border-2 border-slate-200 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-800 transition-all hover:border-slate-800 hover:bg-slate-50 cursor-pointer active:scale-98"
            >
              Read Full Story
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Brand Story interactive detailed story popup */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full border border-slate-100 shadow-2xl relative my-8">
            <button
              onClick={() => setStoryModalOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-8">
              <span className="text-[10px] font-bold tracking-widest text-[#8D9E7D] uppercase block mb-1">
                The Heritage of Balanza
              </span>
              <h3 className="font-display text-xl font-extrabold text-slate-950 mb-6 uppercase tracking-wider">
                Our Balanza Journey
              </h3>

              <div className="space-y-4 text-slate-600 text-xs md:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <p className="font-medium text-slate-900 italic">
                  Our Story
                </p>

                <p>
                  Balanza began with a simple moment at home.
                </p>

                <p>
                  As parents, we were looking for something that would encourage our little one to move, explore, and grow — without relying on screens for entertainment.
                </p>

                <p>
                  When our child first got on a balance bike, he wasn’t riding it. He was dragging it around the house, curious about this new little companion. Day after day, he kept coming back to it.
                </p>

                <p className="font-semibold text-slate-900 border-l-2 border-[#BFEC53] pl-3 my-2.5">
                  Then something amazing happened.
                </p>

                <p>
                  What started as dragging slowly turned into pushing. Pushing turned into gliding. And before we knew it, he was balancing with confidence.
                </p>

                <p>
                  We watched his determination grow. We watched his independence emerge. Most importantly, we watched him discover what he was capable of.
                </p>

                <p className="font-medium text-slate-800 bg-[#BFEC53]/10 px-4 py-2 rounded-xl">
                  That experience became the inspiration behind Balanza.
                </p>

                <p>
                  We believe every child deserves a strong start — one filled with movement, confidence, curiosity, and real-world exploration. We believe childhood should be spent discovering, not just scrolling. Learning, not just watching.
                </p>

                <p>
                  That’s why we created Balanza: to help little explorers build balance, coordination, courage, and confidence through play.
                </p>

                <p className="font-bold text-slate-950 pt-2 text-sm leading-snug">
                  Because the first ride is never just a ride.
                </p>

                <p className="font-semibold text-[#8D9E7D]">
                  It’s often the first step towards independence.
                </p>

                <p className="font-bold text-slate-950">
                  And that’s a journey worth celebrating.
                </p>

                <div className="pt-6 border-t border-slate-100 text-center mt-6">
                  <p className="font-display text-xs font-black uppercase tracking-widest bg-slate-950 text-[#BFEC53] py-3 px-5 rounded-xl">
                    Balanza - A Gift of Confidence for Every Little Explorer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
