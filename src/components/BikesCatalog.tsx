// import React, { useState } from 'react';
// import { Heart, ShoppingBag, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import { BikeProduct, BikeColor } from '../types';

// export default function BikesCatalog() {
//   const { bikes, addToCart, wishlist, toggleWishlist, setSelectedQuickView, setCartOpen } = useApp();
  
//   // Track selected image index for each product card
//   const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

//   // Track adding operation for feedback animation
//   const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

//   const handlePrevImage = (productId: string, imagesCount: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setActiveImageIndices((prev) => {
//       const current = prev[productId] ?? 0;
//       const nextIdx = (current - 1 + imagesCount) % imagesCount;
//       return { ...prev, [productId]: nextIdx };
//     });
//   };

//   const handleNextImage = (productId: string, imagesCount: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setActiveImageIndices((prev) => {
//       const current = prev[productId] ?? 0;
//       const nextIdx = (current + 1) % imagesCount;
//       return { ...prev, [productId]: nextIdx };
//     });
//   };

//   const handleDotClick = (productId: string, idx: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setActiveImageIndices((prev) => ({
//       ...prev,
//       [productId]: idx
//     }));
//   };

//   const handleAddToCartClick = (product: BikeProduct, color: BikeColor) => {
//     addToCart(product, color);
    
//     // Quick feedback animation
//     const feedbackKey = product.id;
//     setAddedItemFeedback(feedbackKey);
//     setTimeout(() => {
//       setAddedItemFeedback(null);
//     }, 2000);
//   };

//   const handleBuyNowClick = (product: BikeProduct, color: BikeColor) => {
//     addToCart(product, color);
//     setCartOpen(true);
//   };

//   const formatPrice = (amount: number) => {
//     return `₹ ${amount}`;
//   };

//   return (
//     <section id="our-bikes" className="relative bg-transparent pt-8 pb-8 md:pt-12 md:pb-12 select-none">
//       <div className="mx-auto max-w-7xl px-4 md:px-8">
        
//         {/* Section Header */}
//         <div className="relative border-b border-gray-100 pb-4 mb-8 flex items-center justify-center">
//           <div className="text-center">
//             <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
//               Our Bikes
//             </h2>
//             <div className="mt-2 h-1 w-12 bg-[#BFEC53] mx-auto"></div>
//           </div>
//         </div>

//         {/* 2-Box Product Grid (Centered beautifully with Max-Width) */}
//         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
//           {bikes && bikes.length > 0 ? (
//             bikes.map((product) => {
//               // Defaulting fallback values if images array is empty
//               const images = product.images && product.images.length > 0 
//                 ? product.images 
//                 : (product.colors && product.colors.length > 0 ? [product.colors[0].imageUrl] : ['']);
              
//               const activeImgIdx = activeImageIndices[product.id] ?? 0;
//               const activeImageUrl = images[activeImgIdx] || 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80';
//               const activeColor = product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Default', value: '#A7E22E', imageUrl: activeImageUrl };
              
//               const isLiked = wishlist.includes(product.id);
//               const isJustAdded = addedItemFeedback === product.id;

//               return (
//                 <div 
//                   key={product.id}
//                   className="group relative flex flex-col items-start bg-white p-5 sm:p-7 pb-6 sm:pb-8 rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
//                 >
//                   {/* Wishlist Heart */}
//                   <button
//                     onClick={() => toggleWishlist(product.id)}
//                     className={`absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
//                       isLiked ? 'text-rose-500 border border-slate-100' : 'text-slate-400 hover:text-rose-400 border border-slate-100'
//                     }`}
//                     aria-label="Add to Wishlist"
//                   >
//                     <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : 'stroke-[1.75]'}`} />
//                   </button>

//                   {/* Main Product Canvas / Multiple Images Showcase */}
//                   <div className="relative w-full overflow-visible py-4 sm:py-8 mb-4 flex flex-col items-center justify-center transition-all min-h-[260px] sm:min-h-[340px]">
//                     <img
//                       src={activeImageUrl}
//                       alt={`${product.name} - View ${activeImgIdx + 1}`}
//                       referrerPolicy="no-referrer"
//                       className="w-full h-auto max-h-[340px] sm:max-h-[420px] md:max-h-[460px] object-contain transition-transform duration-700 ease-out group-hover:scale-110 select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
//                     />
                    
//                     {/* Image Navigation Arrows (Chevron Left / Right) */}
//                     {images.length > 1 && (
//                       <>
//                         <button
//                           onClick={(e) => handlePrevImage(product.id, images.length, e)}
//                           className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300 md:scale-100 active:scale-90"
//                           title="Previous Image"
//                         >
//                           <ChevronLeft className="h-4.5 w-4.5" />
//                         </button>
//                         <button
//                           onClick={(e) => handleNextImage(product.id, images.length, e)}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300 md:scale-100 active:scale-90"
//                           title="Next Image"
//                         >
//                           <ChevronRight className="h-4.5 w-4.5" />
//                         </button>
//                       </>
//                     )}

//                     {/* Circle Indicator Index Dots at bottom of canvas */}
//                     {images.length > 1 && (
//                       <div className="absolute bottom-1 flex gap-1.5 justify-center z-10 bg-slate-950/5 rounded-full px-2.5 py-1 backdrop-blur-xs border border-slate-200/20">
//                         {images.map((_, dotIdx) => (
//                           <button
//                             key={dotIdx}
//                             onClick={(e) => handleDotClick(product.id, dotIdx, e)}
//                             className={`h-1.5 rounded-full transition-all duration-300 ${
//                               activeImgIdx === dotIdx ? 'w-4 bg-slate-800' : 'w-1.5 bg-slate-400 hover:bg-slate-600'
//                             }`}
//                             aria-label={`Go to slide ${dotIdx + 1}`}
//                           />
//                         ))}
//                       </div>
//                     )}

//                     {/* Subtle Quick View Icon hover link */}
//                     <div className="absolute top-4 left-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
//                       <button
//                         onClick={() => setSelectedQuickView(product)}
//                         className="rounded-full bg-white h-9 w-9 shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white transition-all cursor-pointer active:scale-90"
//                         title="Quick View Details"
//                       >
//                         <Eye className="h-4.5 w-4.5" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Details Section */}
//                   <div className="w-full mb-6">
//                     <div className="flex justify-between items-start mb-2.5">
//                       <h3 className="font-display text-lg font-extrabold text-slate-900 select-text leading-tight max-w-[70%]">
//                         {product.name}
//                       </h3>
//                       <div className="text-right">
//                         <span className="font-display text-xl font-black block select-text" style={{ color: '#A7E22E' }}>
//                           {formatPrice(product.basePrice)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {/* Clean Age Group & Tag Line */}
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
//                         {product.ageYears}
//                       </span>
//                     </div>
                    
//                     <p className="font-sans text-xs text-slate-500 leading-relaxed font-normal">
//                       {product.description}
//                     </p>
//                   </div>

//                   {/* Action Buttons: Stacked for pristine mobile/desktop balance */}
//                   <div className="w-full flex flex-col gap-2.5 mt-auto pt-4 border-t border-slate-100">
//                     {/* "Buy Now" Neon Green Button */}
//                     <button
//                       onClick={() => handleBuyNowClick(product, activeColor)}
//                       className="w-full text-center rounded-xl bg-[#A7E22E] hover:bg-[#99cf28] text-slate-950 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
//                     >
//                       Buy Now
//                     </button>

//                     {/* "Add to Cart" Black Button */}
//                     <button
//                       onClick={() => handleAddToCartClick(product, activeColor)}
//                       className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
//                         isJustAdded 
//                           ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
//                           : 'bg-zinc-900 text-white hover:bg-black hover:shadow'
//                       }`}
//                     >
//                       {isJustAdded ? (
//                         <>
//                           <Check className="h-4 w-4 stroke-[3]" />
//                           Added to Cart
//                         </>
//                       ) : (
//                         <>
//                           <ShoppingBag className="h-4 w-4" />
//                           Add to Cart
//                         </>
//                       )}
//                     </button>
//                   </div>

//                 </div>
//               );
//             })
//           ) : (
//             <div className="col-span-full text-center py-12 text-slate-500">
//               No bikes available at the moment.
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }



import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BikeProduct, BikeColor } from '../types';

export default function BikesCatalog() {
  const { bikes, addToCart, wishlist, toggleWishlist, setSelectedQuickView, setCartOpen, setActivePage } = useApp();
  
  // Track selected image index for each product card
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

  // Track adding operation for feedback animation
  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

  const handlePrevImage = (productId: string, imagesCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => {
      const current = prev[productId] ?? 0;
      const nextIdx = (current - 1 + imagesCount) % imagesCount;
      return { ...prev, [productId]: nextIdx };
    });
  };

  const handleNextImage = (productId: string, imagesCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => {
      const current = prev[productId] ?? 0;
      const nextIdx = (current + 1) % imagesCount;
      return { ...prev, [productId]: nextIdx };
    });
  };

  const handleDotClick = (productId: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: idx
    }));
  };

  const handleAddToCartClick = (product: BikeProduct, color: BikeColor) => {
    addToCart(product, color);
    
    // Quick feedback animation
    const feedbackKey = product.id;
    setAddedItemFeedback(feedbackKey);
    setTimeout(() => {
      setAddedItemFeedback(null);
    }, 2000);
  };

  const handleBuyNowClick = (product: BikeProduct, color: BikeColor) => {
    addToCart(product, color);
    setActivePage('checkout');
  };

  const formatPrice = (amount: number) => {
    return `₹ ${amount}`;
  };

  return (
    <section id="our-bikes" className="relative bg-transparent pt-8 pb-8 md:pt-12 md:pb-12 select-none">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="relative border-b border-gray-100 pb-4 mb-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Our Bikes
            </h2>
            <div className="mt-2 h-1 w-12 bg-[#BFEC53] mx-auto"></div>
          </div>
        </div>

        {/* 2-Box Product Grid (Centered beautifully with Max-Width) */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
          {bikes && bikes.length > 0 ? (
            bikes.map((product) => {
              // Defaulting fallback values if images array is empty
              const images = product.images && product.images.length > 0 
                ? product.images 
                : (product.colors && product.colors.length > 0 ? [product.colors[0].imageUrl] : ['']);
              
              const activeImgIdx = activeImageIndices[product.id] ?? 0;
              const activeImageUrl = images[activeImgIdx] || 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80';
              const activeColor = product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Default', value: '#A7E22E', imageUrl: activeImageUrl };
              
              const isLiked = wishlist.includes(product.id);
              const isJustAdded = addedItemFeedback === product.id;

              return (
                <div 
                  key={product.id}
                  className="group relative flex flex-col items-start bg-white p-5 sm:p-7 pb-6 sm:pb-8 rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                      isLiked ? 'text-rose-500 border border-slate-100' : 'text-slate-400 hover:text-rose-400 border border-slate-100'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : 'stroke-[1.75]'}`} />
                  </button>

                  {/* Main Product Canvas / Multiple Images Showcase */}
                  <div className="relative w-full overflow-visible py-4 sm:py-8 mb-4 flex flex-col items-center justify-center transition-all min-h-[260px] sm:min-h-[340px]">
                    <img
                      src={activeImageUrl}
                      alt={`${product.name} - View ${activeImgIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[340px] sm:max-h-[420px] md:max-h-[460px] object-contain transition-transform duration-700 ease-out group-hover:scale-110 select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
                    />
                    
                    {/* Image Navigation Arrows (Chevron Left / Right) */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePrevImage(product.id, images.length, e)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300 md:scale-100 active:scale-90"
                          title="Previous Image"
                        >
                          <ChevronLeft className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={(e) => handleNextImage(product.id, images.length, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300 md:scale-100 active:scale-90"
                          title="Next Image"
                        >
                          <ChevronRight className="h-4.5 w-4.5" />
                        </button>
                      </>
                    )}

                    {/* Circle Indicator Index Dots at bottom of canvas */}
                    {images.length > 1 && (
                      <div className="absolute bottom-1 flex gap-1.5 justify-center z-10 bg-slate-950/5 rounded-full px-2.5 py-1 backdrop-blur-xs border border-slate-200/20">
                        {images.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={(e) => handleDotClick(product.id, dotIdx, e)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              activeImgIdx === dotIdx ? 'w-4 bg-slate-800' : 'w-1.5 bg-slate-400 hover:bg-slate-600'
                            }`}
                            aria-label={`Go to slide ${dotIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Subtle Quick View Icon hover link */}
                    <div className="absolute top-4 left-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setSelectedQuickView(product)}
                        className="rounded-full bg-white h-9 w-9 shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white transition-all cursor-pointer active:scale-90"
                        title="Quick View Details"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="w-full mb-6">
                    <div className="flex justify-between items-start mb-2.5">
                      <h3 className="font-display text-lg font-extrabold text-slate-900 select-text leading-tight max-w-[70%]">
                        {product.name}
                      </h3>
                      <div className="text-right">
                        <span className="font-display text-xl font-black block select-text" style={{ color: '#A7E22E' }}>
                          {formatPrice(product.basePrice)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Clean Age Group & Tag Line */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {product.ageYears}
                      </span>
                    </div>
                    
                    <p className="font-sans text-xs text-slate-500 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>

                  {/* Action Buttons: Stacked for pristine mobile/desktop balance */}
                  <div className="w-full flex flex-col gap-2.5 mt-auto pt-4 border-t border-slate-100">
                    {/* "Buy Now" Neon Green Button */}
                    <button
                      onClick={() => handleBuyNowClick(product, activeColor)}
                      className="w-full text-center rounded-xl bg-[#A7E22E] hover:bg-[#99cf28] text-slate-950 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
                    >
                      Buy Now
                    </button>

                    {/* "Add to Cart" Black Button */}
                    <button
                      onClick={() => handleAddToCartClick(product, activeColor)}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                        isJustAdded 
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                          : 'bg-zinc-900 text-white hover:bg-black hover:shadow'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="h-4 w-4 stroke-[3]" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              No bikes available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
