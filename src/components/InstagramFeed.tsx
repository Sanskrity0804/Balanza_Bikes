import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INSTAGRAM_FEED } from '../data';

export default function InstagramFeed() {
  const { uiSettings } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const openLightbox = (idx: number) => {
    setActiveLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % INSTAGRAM_FEED.length);
    }
  };

  const prevPhoto = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + INSTAGRAM_FEED.length) % INSTAGRAM_FEED.length);
    }
  };

  return (
    <section id="tiny-riders" className="bg-transparent pt-8 pb-8 md:pt-12 md:pb-12 select-none">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header section with Follow handle */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-150 pb-3 mb-6 text-center sm:text-left transition-all">
          <a 
            href="https://www.instagram.com/balanzabikes?igsh=NjB4dnl1eWszcW5o&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            className="group block hover:opacity-85 text-left"
          >
            <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl group-hover:underline">
              {uiSettings?.instagramTitle || "Loved by Parents. Adored by Kids."}
            </h2>
            <p className="font-sans text-[11px] text-slate-500 font-medium mt-1">
              Join thousands of families on their dynamic balance journeys. Follow us at <span className="font-bold text-[#8D9E7D]">@balanzabikes</span>
            </p>
          </a>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a 
              href="https://www.instagram.com/balanzabikes?igsh=NjB4dnl1eWszcW5o&utm_source=qr" 
              target="_blank" 
              rel="noreferrer"
              className="font-display text-[10px] font-bold tracking-widest text-slate-900 hover:text-slate-600 transition-colors uppercase border border-slate-200 px-4 py-2 rounded-full cursor-pointer bg-white shadow-xs"
            >
              FOLLOW US @balanzabikes
            </a>
            
            {/* Nav Arrows */}
            <div className="flex gap-1.5">
              <button 
                onClick={scrollLeft}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xs text-slate-700 hover:border-slate-800 transition-colors hover:bg-slate-50 cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={scrollRight}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xs text-slate-700 hover:border-slate-800 transition-colors hover:bg-slate-50 cursor-pointer"
                title="Next"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel elements row */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-none snap-x snap-mandatory"
        >
          {INSTAGRAM_FEED.map((feed) => (
            <a 
              key={feed.id}
              href="https://www.instagram.com/balanzabikes?igsh=NjB4dnl1eWszcW5o&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="group relative flex-shrink-0 w-64 md:w-72 aspect-square overflow-hidden rounded-xl border border-slate-100/60 bg-white shadow-sm snap-start cursor-pointer block"
            >
              <img
                src={feed.imageUrl}
                alt={feed.alt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Instagram Hover glass */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5 text-white">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Heart className="h-4 w-4 fill-current text-white" />
                  <span>142</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <MessageCircle className="h-4 w-4 fill-current text-white" />
                  <span>12</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>

      {/* Lightbox Overlay */}
      {activeLightboxIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Previous Photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextPhoto}
            className="absolute right-4 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Next Photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="max-w-3xl max-h-[80vh] overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl flex flex-col">
            <img
              src={INSTAGRAM_FEED[activeLightboxIndex].imageUrl}
              alt={INSTAGRAM_FEED[activeLightboxIndex].alt}
              referrerPolicy="no-referrer"
              className="object-contain max-h-[70vh] w-auto mx-auto"
            />
            <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 text-white px-6 py-4 flex items-center justify-between text-xs font-sans">
              <span className="font-display font-bold uppercase tracking-widest text-[#BFEC53]">@BALANZA.BIKES</span>
              <p className="text-gray-300 italic truncate ml-4 mr-4">
                {INSTAGRAM_FEED[activeLightboxIndex].alt}
              </p>
              <span className="font-mono text-[10px] text-gray-400">
                {activeLightboxIndex + 1} / {INSTAGRAM_FEED.length}
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
