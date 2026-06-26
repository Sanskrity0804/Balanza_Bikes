import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FeaturesBar() {
  const { uiSettings } = useApp();

  const defaultFeatures = [
    {
      iconName: 'Feather',
      title: 'Lightweight Frame',
      desc: 'Easy to handle',
    },
    {
      iconName: 'ShieldAlert',
      title: 'Child-Safe Design',
      desc: 'Rounded edges & non-toxic paint',
    },
    {
      iconName: 'Wrench',
      title: 'Easy Assembly',
      desc: 'Tool-free setup in minutes',
    },
    {
      iconName: 'Award',
      title: 'Premium Materials',
      desc: 'Built to last, made to care',
    },
    {
      iconName: 'LineChart',
      title: 'Built for Growth',
      desc: 'Supports every step of their journey',
    },
  ];

  const features = uiSettings?.features && uiSettings.features.length > 0
    ? uiSettings.features
    : defaultFeatures;

  return (
    <section className="bg-transparent pb-8 md:pb-12 select-none">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y-0 md:divide-x divide-slate-200">
          {features.map((feat, index) => {
            const iconName = feat.iconName;
            // Lookup icon dynamically from Lucide
            const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Feather;
            return (
              <div 
                key={index} 
                className="group flex flex-col items-center text-center p-3 transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#A7E22E] shadow-sm border border-slate-150 transition-all duration-300 group-hover:scale-110">
                  <IconComponent className="h-8 w-8 stroke-[2]" style={{ color: '#A7E22E' }} />
                </div>
                <h4 className="font-display text-xs font-bold text-slate-800 tracking-wide uppercase mb-0.5">
                  {feat.title}
                </h4>
                <p className="font-sans text-[10px] text-slate-500 font-medium">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
