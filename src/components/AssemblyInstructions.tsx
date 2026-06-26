import React, { useState } from 'react';
import { Play, Wrench, CheckCircle, Clock, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export default function AssemblyInstructions() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Modular quick assembly steps
  const steps = [
    {
      step: '01',
      title: 'Unpack & Inspect',
      desc: 'Carefully slide the frame and components out of the box, removing protective padding.',
    },
    {
      step: '02',
      title: 'Insert Fork & Handlebars',
      desc: 'Slide the front fork with front wheel into the frame collar, then insert the handlebars to desired height.',
    },
    {
      step: '03',
      title: 'Tighten Handlebar Clamp',
      desc: 'Align handlebars perpendicular to front wheel. Tighten the collar screw firmly using the supplied Allen key.',
    },
    {
      step: '04',
      title: 'Attach Seat Post',
      desc: 'Slide the saddle stem into the seat tube. Adjust is so feet rest flat on the ground with a slight knee bend.',
    },
  ];

  return (
    <section id="assembly-instructions" className="bg-slate-50 py-10 md:py-14 select-none border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="relative border-b border-gray-200 pb-4 mb-8 flex items-center justify-center">
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-[#8D9E7D] uppercase mb-1 block">
              EASY TOOL-FREE START
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Assembly Instructions
            </h2>
            <div className="mt-2 h-1 w-12 bg-[#BFEC53] mx-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 md:gap-12">
          
          {/* Left Column - Playable Assembly Video Player Block */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl aspect-video w-full flex items-center justify-center">
              
              {!isPlaying ? (
                <>
                  {/* Backdrop Cover Image */}
                  <img
                    src="https://images.unsplash.com/photo-1541689592655-f5f52827a3b4?w=1000&auto=format&fit=crop&q=80"
                    alt="Balanza assembly preview"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover opacity-60 filter"
                  />
                  
                  {/* Play Interface */}
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-white text-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="group flex h-16 w-16 items-center justify-center rounded-full bg-[#BFEC53] text-[#111] shadow-2xl hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer duration-300 mb-4"
                      title="Play Assembly Video"
                    >
                      <Play className="h-6 w-6 fill-current ml-1 text-slate-950" />
                    </button>
                    <h3 className="font-display text-sm md:text-base font-extrabold uppercase tracking-widest text-white drop-shadow-sm">
                      Balanza Quick Assembly Guide
                    </h3>
                    <p className="font-sans text-[11px] text-slate-200 mt-1 max-w-sm drop-shadow-sm font-medium">
                      Watch how to assemble your tiny rider's first companion safely in less than 3 minutes.
                    </p>
                  </div>
                </>
              ) : (
                /* Native YouTube Embedded Iframe to watch a real balance bike assembly tutorial */
                <iframe
                  className="w-full h-full absolute inset-0"
                  src="https://www.youtube.com/embed/v9S_6p20Rks?autoplay=1"
                  title="How to Assemble a Kids Balance Bike"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Safety Badges row */}
            <div className="mt-4 flex flex-wrap gap-4 items-center justify-between text-[11px] font-sans text-slate-500 font-medium px-1">
              <div className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-emerald-600" />
                <span>Tool Included in Box</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>Setup Duration: ~3 Mins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#8D9E7D]" />
                <span>Rigorously Safety Tested</span>
              </div>
            </div>
          </div>

          {/* Right Column - Step-by-Step Interactive Guide Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 text-left">
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-widest text-[#8D9E7D] uppercase block">
                STEP-BY-STEP CHECKLIST
              </span>
              <h3 className="font-display text-lg font-black text-slate-900 uppercase tracking-wide leading-tight">
                No Complex Manuals Required.
              </h3>
              <p className="font-sans text-xs text-slate-600 leading-normal">
                Balanza is built to minimize assembly stress. Your bike arrives 90% pre-assembled, and the rest is incredibly simple.
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((item, index) => (
                <div 
                  key={index}
                  className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs hover:border-slate-850 hover:shadow-sm transition-all duration-300"
                >
                  <span className="text-sm font-mono font-black text-[#8D9E7D] bg-[#BFEC53]/15 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-display text-[12px] font-extrabold text-slate-800 uppercase tracking-wider mb-0.5">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[11px] text-slate-500 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex gap-2 items-center bg-[#BFEC53]/10 p-3 rounded-lg border border-[#BFEC53]/20">
              <AlertCircle className="h-4 w-4 text-slate-800 shrink-0" />
              <p className="font-sans text-[10px] text-slate-700 font-semibold uppercase tracking-wider">
                Tip: Always inspect bolts before the first thrilling ride!
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
