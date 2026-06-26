import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Wrench, Clock, ShieldCheck, AlertTriangle, FileText, Settings, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AssemblyPage() {
  const { setActivePage } = useApp();

  const steps = [
    {
      num: "01",
      title: "Unpack & Inventory",
      lead: "Prepare a clean, flat working space on a soft surface (like a rug or cardboard) to avoid scratches.",
      details: [
        "Carefully slide the pre-assembled mainframe, fork, handlebars, and accessories toolbox out of the delivery carton.",
        "Remove all protective foam wraps, binding clips, and bubble bags safely.",
        "Verify you have all components: 1x Mainframe (with rear wheel mounted), 1x Front Fork, 1x Handlebars, 1x Quick-Release Seat clamp, and the custom Allen mounting key."
      ]
    },
    {
      num: "02",
      title: "Fork & Neck Insertion",
      lead: "Correct alignment of the fork assembly is vital for responsive steering safety.",
      details: [
        "Insert the front fork stem up through the frame steering collar neck.",
        "Ensure the fork curves forward. The curvature of the fork should point away from the seat post, not backward toward the frame body.",
        "Verify that the pre-installed ball bearings fit flat, flush, and wobble-free inside the upper and lower collar shells."
      ]
    },
    {
      num: "03",
      title: "Handlebar Mounting & Secure Clamp",
      lead: "Lock the steering axis to guarantee safe toddler maneuvering.",
      details: [
        "Slide the handlebar collar tube onto the protruding fork stem sleeve.",
        "Adjust the handlebars horizontally so they are perfectly perpendicular to the front wheel track line.",
        "Use the provided tool to tighten the seat / neck collar hex screws uniformly. Check that the bars do not twitch, rotate, or slide under pressure."
      ]
    },
    {
      num: "04",
      title: "Seat & Saddle Adjustments",
      lead: "Find the ergonomically ideal riding posture as your explorer grows taller.",
      details: [
        "Insert the saddle post into the frame main seat tube. Keep the safety insertion line hidden inside the frame.",
        "Position the saddle height so that your toddler is able to plant both feet firmly flat on the floor with knees slightly bent (~15 degrees).",
        "Hand-clasp the child-safe quick-release seat post clamp shut firmly. If it rotates easily, tighten the tool-free clamp dial first."
      ]
    }
  ];

  const safetyChecks = [
    "Always perform a firm handlebar shake test to ensure there is no steering play or loose rattling.",
    "Inspect the quick-release Seat clamp lever to ensure it is fully pressed down flat against the frame tube.",
    "Verify that the tires have proper friction traction, and rotate smoothly without dragging on frame parts.",
    "Equip your child with a certified kids safety helmet at all times, even during low-speed hallway trials!"
  ];

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] font-sans pb-24 text-left select-none animate-fade-in">
      
      {/* Title Header Block */}
      <div className="bg-slate-900 text-white pt-16 pb-24 relative overflow-hidden px-4 md:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-5xl relative z-10">
          
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

          <span className="text-[10px] font-black tracking-widest uppercase text-[#A7E22E] block mb-1">
            Assembly & Maintenance
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.95] max-w-2xl">
            Assembly Instructions
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold max-w-xl mt-3 leading-relaxed">
            A comprehensive, step-by-step master text manual to assemble, tune, and safety-verify your Balanza Balance Bike in under five minutes.
          </p>
        </div>
      </div>

      {/* Main Column */}
      <div className="mx-auto max-w-4xl px-4 md:px-8 -mt-8 relative z-20">
        
        {/* Core Quick Summary panel */}
        <div className="bg-[#A7E22E] text-slate-950 rounded-3xl p-6 sm:p-8 shadow-xl border border-[#A7E22E]/40 mb-10 select-text">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:border-r sm:border-slate-900/10 last:border-none pr-4">
              <Wrench className="h-8 w-8 text-slate-900 shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase text-slate-900/60 tracking-wider">REQUIRED TOOLS</p>
                <p className="text-xs font-black uppercase tracking-wide">Included in box</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:border-r sm:border-slate-900/10 last:border-none pr-4">
              <Clock className="h-8 w-8 text-slate-900 shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase text-slate-900/60 tracking-wider">AVERAGE SETUP</p>
                <p className="text-xs font-black uppercase tracking-wide">3 - 5 Minutes</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-slate-900 shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase text-slate-900/60 tracking-wider">COMPLIANCE TESTED</p>
                <p className="text-xs font-black uppercase tracking-wide">Sovereign Safe Certification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Text Steps Sequence (Clean layout) */}
        <div className="space-y-8 select-text">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-slate-950" />
            <h2 className="font-display text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
              Step-by-Step Assembly Protocol
            </h2>
          </div>
          <div className="h-[2px] w-12 bg-[#A7E22E] -mt-6 mb-8" />

          <div className="space-y-6">
            {steps.map((s, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                  {/* Step Num indicator */}
                  <span className="font-mono text-xs sm:text-sm font-black text-slate-950 bg-[#A7E22E] hover:bg-slate-900 hover:text-[#A7E22E] h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-slate-950/10 select-none">
                    {s.num}
                  </span>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                      {s.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 font-semibold mt-1">
                      {s.lead}
                    </p>
                  </div>
                </div>

                {/* Sub-steps of specific instructions */}
                <div className="pl-0 sm:pl-16 space-y-3">
                  <div className="h-px bg-slate-100 my-3" />
                  <ul className="space-y-2.5">
                    {s.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-3 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                        <CheckCircle2 className="h-4 w-4 text-[#A7E22E] mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Safety & Pre-Ride checks panel */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 mt-12">
            <div className="flex items-center gap-2 mb-4 select-none">
              <AlertTriangle className="h-5.5 w-5.5 text-amber-600 shrink-0" />
              <h3 className="font-display text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider">
                Critical Safety Audit Checklist
              </h3>
            </div>
            
            <ul className="space-y-3">
              {safetyChecks.map((check, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-amber-900/80 leading-relaxed font-semibold">
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Extra Help / Support section */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h4 className="font-display text-xs font-black text-slate-950 uppercase tracking-widest mb-1">
                Need Professional Assistance?
              </h4>
              <p className="font-sans text-xs text-slate-500 font-semibold">
                Our support lines are open daily from 9:00 AM to 6:00 PM IST to guide you.
              </p>
            </div>
            
            <button
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-xl shadow transition-all cursor-pointer select-none"
            >
              Contact Support
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
