import React, { useState } from 'react';
import { ShieldCheck, Bike, Dumbbell, Sparkles, Smile, Play, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WhyBalanza() {
  const { uiSettings, setActivePage } = useApp();
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);

  const benefits = [
    {
      title: 'Builds Balance',
      desc: 'Low-to-ground frames allow children to push with their feet easily, making learning balance second nature.',
      icon: Dumbbell,
    },
    {
      title: 'Improves Coordination',
      desc: 'Synchronizes vision, arm guidance, and leg muscles, prompting swift development of dynamic reflexes.',
      icon: Sparkles,
    },
    {
      title: 'Boosts Confidence',
      desc: 'With feet safely grounded, toddlers learn with zero fear of falling, driving high-speed confidence.',
      icon: ShieldCheck,
    },
    {
      title: 'Easy Transition to Pedal Bike',
      desc: 'Since balance is already mastered, kids transition directly to pedal bikes without needing learning training wheels!',
      icon: Bike,
    },
    {
      title: 'Encourages Active Play',
      desc: 'Installs early love for nature, exploration, physical activity, and wholesome screen-free childhoods.',
      icon: Smile,
    },
  ];

  return (
    <section id="why-balance-bikes" className="bg-white pt-8 pb-8 md:pt-12 md:pb-12 select-none">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="relative border-b border-gray-100 pb-4 mb-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {uiSettings?.whyBalanzaTitle || "Why Balance Bikes?"}
            </h2>
            <div className="mt-2 h-1 w-12 bg-[#BFEC53] mx-auto"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 md:gap-12">
          
          {/* Left Column - Headline, story with interactive video play */}
          <div className="flex flex-col justify-between items-start lg:col-span-5 text-left bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#BFEC53]/10 rounded-full blur-xl"></div>
            
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#8D9E7D] uppercase block mb-3">
                Wholesome Play
              </span>
              <h3 className="font-display text-xl font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
                Build Natural Balance
              </h3>
              
              <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
                Balance bikes help children learn coordination and balance naturally before they move to pedal bikes. By skipping training wheels altogether, kids gain true physical mastery and self-reliance early.
              </p>
            </div>

            <div className="w-full mt-4 space-y-5">
              {/* Play video widget */}
              <button
                onClick={() => setVideoModalOpen(true)}
                className="group flex items-center gap-3.5 w-full bg-slate-55 p-3.5 rounded-xl border border-dashed border-slate-200 hover:border-slate-800 transition-all cursor-pointer text-left"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111] text-white shadow group-hover:bg-[#BFEC53] group-hover:text-black transition-all">
                  <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
                </div>
                <div>
                  <h4 className="font-display text-[11px] font-bold text-slate-800 uppercase tracking-widest">
                    Watch the Tutorial
                  </h4>
                  <p className="font-sans text-[10px] text-slate-500 font-medium">
                    See why 98% of experts recommend balance starters.
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setActivePage('story');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-center rounded border-2 border-slate-200 bg-white py-3.5 text-xs font-bold uppercase tracking-widest text-slate-850 transition-all hover:border-slate-800 hover:bg-slate-50 active:scale-98 cursor-pointer"
              >
                Learn More
              </button>
            </div>

          </div>

          {/* Right Column - Modular Benefits Deck */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            {benefits.map((benefit, index) => {
              const IconComp = benefit.icon;
              return (
                <div 
                  key={index}
                  className="group flex gap-5 bg-white p-5 rounded-xl border border-slate-100 shadow-sm/50 hover:shadow-md transition-all duration-300 hover:translate-x-1"
                >
                  <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-lg bg-[#BFEC53]/15 text-[#8D9E7D] group-hover:bg-[#BFEC53] group-hover:text-slate-900 transition-colors duration-300">
                    <IconComp className="h-5.5 w-5.5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-sm font-bold text-slate-900 tracking-wide uppercase mb-1">
                      {benefit.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-normal">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Embedded video tutorial simulation dialog */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full border border-slate-100 shadow-2xl relative">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            
            <div className="p-6">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2 uppercase tracking-wider">
                Why Balanza is the Best First Rider
              </h3>
              <p className="font-sans text-xs text-slate-500 mb-4">
                Watch how children learn to self-correct balance naturally within an hour.
              </p>
              
              {/* Cinematic Video canvas or actual HTML5 video tag */}
              <div className="relative aspect-video w-full rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center shadow-inner">
                {uiSettings?.whyBalanzaVideoUrl ? (
                  <video 
                    controls 
                    autoPlay 
                    src={uiSettings.whyBalanzaVideoUrl} 
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <>
                    {/* Simulated child learning sunset picture */}
                    <img
                      src="/images/camping_story_1779786774831.png"
                      alt="Video starter frame"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full object-cover opacity-60 filter blur-[1px]"
                    />
                    <div className="z-10 text-center text-white px-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#BFEC53] text-black shadow-lg cursor-pointer transform hover:scale-105 transition-all mb-4">
                        <Play className="h-6 w-6 fill-current ml-1" />
                      </div>
                      <p className="font-display text-xs font-bold uppercase tracking-widest mb-1 shadow-sm">
                        Prepping the Tiny Explorers
                      </p>
                      <p className="font-sans text-[10px] text-gray-200 font-medium">
                        Video tutorial • Play duration 2:40 mins
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
