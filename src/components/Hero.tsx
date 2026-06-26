import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

const FALLBACK_HERO_IMAGES = [
  '/images/bike_explorer_olive_1779786711803.png',
  '/images/bike_vintage_lilac_1779792037270.png',
  '/images/bike_neo_black_1779786755416.png'
];

export default function Hero() {
  const { uiSettings, setActivePage } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = uiSettings?.heroImages && uiSettings.heroImages.length > 0
    ? uiSettings.heroImages
    : FALLBACK_HERO_IMAGES;

  useEffect(() => {
    if (heroImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages]);

  const handleShopBikesClick = () => {
    const catalogElement = document.getElementById('our-bikes');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreStoryClick = () => {
    setActivePage('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-transparent pt-8 pb-8 md:pt-12 md:pb-12 select-none">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 md:gap-16">
          
          {/* Right Image element: 7-cols - Animated Slideshow of Bikes (COMES FIRST ON MOBILE - order-1 lg:order-2) */}
          <div className="relative flex flex-col items-center justify-center lg:col-span-7 w-full order-1 lg:order-2">
            
            <div className="relative w-full flex items-center justify-center overflow-visible py-4 md:py-8">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex]}
                  alt={`Balanza Premium Bike Style ${currentImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 0.94, y: 10 }}
                  animate={{ opacity: 1, scale: 1.12, y: 0 }}
                  exit={{ opacity: 0, scale: 1.12, y: -10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full h-auto max-h-[340px] sm:max-h-[460px] md:max-h-[540px] lg:max-h-[620px] object-contain select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.08)]"
                />
              </AnimatePresence>
            </div>

            {/* Elegant unboxed Dot Indicators placed just below the image */}
            <div className="mt-2 flex gap-2 z-20 bg-slate-900/5 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200/40">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === idx ? 'w-6 bg-slate-800' : 'w-2 bg-slate-350 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Left Text content: 5-cols (order-2 lg:order-1) */}
          <div className="flex flex-col items-start text-left lg:col-span-5 order-2 lg:order-1 -mt-1 md:-mt-4">
            <span className="text-xs sm:text-sm font-black tracking-[0.18em] text-[#8D9E7D] uppercase mb-2">
              A Gift of Confidence
            </span>
            
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-5xl leading-[1.1] mb-4">
              {uiSettings?.heroTitle || "Built for Little Explorers"}
            </h1>
            
            <p className="font-sans text-sm text-slate-600 leading-relaxed md:text-base mb-6 max-w-lg">
              {uiSettings?.heroSubtitle || "Premium balance bikes designed to help children develop balance, coordination, and confidence naturally."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* SHOP BIKES */}
              <button
                id="hero-shop-bikes-btn"
                onClick={handleShopBikesClick}
                className="w-full sm:w-auto text-center rounded bg-zinc-900 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-black hover:shadow-md active:scale-98 cursor-pointer"
              >
                Shop Bikes
              </button>
              
              {/* OUR STORY */}
              <button
                id="hero-explore-story-btn"
                onClick={handleExploreStoryClick}
                className="w-full sm:w-auto text-center rounded border-2 border-slate-200 bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-850 transition-all hover:border-slate-800 hover:bg-slate-50 active:scale-98 cursor-pointer"
              >
                Our Story
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
