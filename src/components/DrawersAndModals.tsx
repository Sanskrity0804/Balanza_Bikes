// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { X, Trash2, Plus, Minus, Search, Sparkles, Check, CheckCircle, ChevronDown, Instagram, Facebook, Send, Twitter } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import BalanzaLogo from './BalanzaLogo';
// import BalanzaBagIcon from './BalanzaBagIcon';

// const CycleCircleIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
//   <div className={`flex items-center justify-center rounded-full bg-[#1D3B28] sm:bg-[#1E293B] text-white ${className} shrink-0 shadow-xs`}>
//     <svg viewBox="0 0 100 100" className="w-[62%] h-[62%]" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <circle cx="30" cy="65" r="13" stroke="currentColor" strokeWidth="6.5" />
//       <circle cx="30" cy="65" r="4" fill="currentColor" />
//       <circle cx="70" cy="65" r="13" stroke="currentColor" strokeWidth="6.5" />
//       <circle cx="70" cy="65" r="4" fill="currentColor" />
//       <path d="M70 65 L61 33 M61 33 L55 33 M61 33 L65 31" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M30 65 C40 45, 50 45, 61 44" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M46 51 L46 38 M40 38 L52 38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   </div>
// );

// export default function DrawersAndModals() {
//   const {
//     cart,
//     removeFromCart,
//     updateCartQuantity,
//     clearCart,
//     isCartOpen,
//     setCartOpen,
//     isMenuOpen,
//     setMenuOpen,
//     isSearchOpen,
//     setSearchOpen,
//     selectedQuickView,
//     setSelectedQuickView,
//     searchQuery,
//     setSearchQuery,
//     addToCart,
//     user,
//     setAccountOpen,
//     placeOrder,
//     bikes,
//     setActivePage
//   } = useApp();

//   const [couponCode, setCouponCode] = useState('');
//   const [discountPercent, setDiscountPercent] = useState(0);
//   const [couponMsg, setCouponMsg] = useState('');
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [checkoutComplete, setCheckoutComplete] = useState(false);
//   const [isLearnExpanded, setIsLearnExpanded] = useState(false);
//   const [checkoutError, setCheckoutError] = useState('');

//   // Payment direct gateway states
//   const [showPaymentGateway, setShowPaymentGateway] = useState(false);
//   const [activePaymentTab, setActivePaymentTab] = useState<'card' | 'upi' | 'netbanking' | 'razorpay'>('razorpay');
//   const [cardholderName, setCardholderName] = useState('');
//   const [cardNumber, setCardNumber] = useState('');
//   const [cardExpiry, setCardExpiry] = useState('');
//   const [cardCvv, setCardCvv] = useState('');
//   const [upiId, setUpiId] = useState('');
//   const [selectedBank, setSelectedBank] = useState('');
//   const [isUpiVerifying, setIsUpiVerifying] = useState(false);
//   const [verifiedUpiName, setVerifiedUpiName] = useState('');
//   const [orderReceipt, setOrderReceipt] = useState<any>(null);

//   // State for active color index in Quick View Dialog
//   const [quickViewColorIdx, setQuickViewColorIdx] = useState(0);

//   React.useEffect(() => {
//     setQuickViewColorIdx(0);
//   }, [selectedQuickView]);

//   // Razorpay dynamic payment handler & sandbox simulator state
//   const [showRazorpaySandbox, setShowRazorpaySandbox] = useState(false);
//   const [razorpaySandboxOrderId, setRazorpaySandboxOrderId] = useState('');
//   const [razorpaySandboxAmount, setRazorpaySandboxAmount] = useState(0);

//   // Helper loader for external Razorpay Checkout SDK script
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if ((window as any).Razorpay) {
//         resolve(true);
//         return;
//       }
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   // Calculate prices
//   const itemsSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const discountAmount = Math.round(itemsSubtotal * (discountPercent / 100));
//   const finalTotal = itemsSubtotal - discountAmount;

//   const handleApplyCoupon = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (couponCode.toUpperCase() === 'BALANZA10') {
//       setDiscountPercent(10);
//       setCouponMsg('BALANZA10 applied: 10% coupon active!');
//     } else if (couponCode.toUpperCase() === 'FIRSTBIKE') {
//       setDiscountPercent(15);
//       setCouponMsg('FIRSTBIKE applied: 15% subscriber code active!');
//     } else {
//       setCouponMsg('Invalid coupon code. Try BALANZA10.');
//     }
//   };

//   const handleStartCheckout = async () => {
//     setCheckoutError('');
//     if (!user) {
//       setCheckoutError('Rider registration required before checkout!');
//       setTimeout(() => {
//         setCartOpen(false);
//         setAccountOpen(true);
//       }, 1000);
//       return;
//     }
//     setShowPaymentGateway(true);
//   };

//   const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let raw = e.target.value.replace(/\D/g, "");
//     if (raw.length > 16) raw = raw.substring(0, 16);
//     const grouped = raw.match(/.{1,4}/g)?.join(" ") || raw;
//     setCardNumber(grouped);
//   };

//   const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let raw = e.target.value.replace(/\D/g, "");
//     if (raw.length > 4) raw = raw.substring(0, 4);
//     if (raw.length >= 3) {
//       setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
//     } else {
//       setCardExpiry(raw);
//     }
//   };

//   const handleVerifyUpi = () => {
//     if (!upiId || !upiId.includes("@")) {
//       setCheckoutError("Please enter a valid format UPI address first to verify.");
//       return;
//     }
//     setCheckoutError('');
//     setIsUpiVerifying(true);
//     setVerifiedUpiName("");
//     setTimeout(() => {
//       setIsUpiVerifying(false);
//       const handle = upiId.split("@")[0].toUpperCase();
//       setVerifiedUpiName(`Verified: ${handle} RIDER`);
//     }, 1200);
//   };

//   // Trigger real-time Razorpay Payment Checkout Flow
//   const handleRazorpayPayment = async () => {
//     try {
//       const response = await fetch('/api/razorpay/create-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: finalTotal }),
//       });

//       const contentType = response.headers.get("content-type");
//       let resData: any = {};
//       if (contentType && contentType.includes("application/json")) {
//         resData = await response.json();
//       } else {
//         const errorText = await response.text();
//         throw new Error(errorText || `API server returned invalid content type. HTTP status: ${response.status}`);
//       }

//       if (!response.ok) {
//         throw new Error(resData.error || 'Failed to initialize system payment pipeline');
//       }

//       const { id: rzpOrderId, amount, mock, keyId } = resData;

//       if (mock) {
//         // Run Sandbox simulator
//         setRazorpaySandboxOrderId(rzpOrderId);
//         setRazorpaySandboxAmount(amount / 100);
//         setShowRazorpaySandbox(true);
//         setIsCheckingOut(false);
//       } else {
//         // Run live official Razorpay gateway integration
//         const loaded = await loadRazorpayScript();
//         if (!loaded) {
//           console.warn('Razorpay SDK failed to load. Falling back gracefully to Sandbox Simulator mode for sandbox testing.');
//           setRazorpaySandboxOrderId(rzpOrderId);
//           setRazorpaySandboxAmount(amount / 100);
//           setShowRazorpaySandbox(true);
//           setIsCheckingOut(false);
//           return;
//         }

//         const options = {
//           key: keyId,
//           amount: amount,
//           currency: 'INR',
//           name: 'Balanza Bikes',
//           description: 'Premium Kid\'s Balance Bike Purchase',
//           order_id: rzpOrderId,
//           handler: async function (paymentRes: any) {
//             setIsCheckingOut(true);
//             try {
//               const verifyResponse = await fetch('/api/razorpay/verify-payment', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   razorpay_order_id: paymentRes.razorpay_order_id,
//                   razorpay_payment_id: paymentRes.razorpay_payment_id,
//                   razorpay_signature: paymentRes.razorpay_signature,
//                   userId: user?.uid,
//                   email: user?.email || '',
//                   items: cart.map((item) => ({
//                     id: item.id,
//                     productName: item.product.name,
//                     productId: item.product.id,
//                     quantity: item.quantity,
//                     price: item.price,
//                     selectedColor: {
//                       name: item.selectedColor.name,
//                       value: item.selectedColor.value,
//                       imageUrl: item.selectedColor.imageUrl
//                     }
//                   })),
//                   itemsSubtotal,
//                   discountAmount,
//                   finalTotal,
//                   isMock: false
//                 }),
//               });

//               const verifyContentType = verifyResponse.headers.get("content-type");
//               let verifyData: any = {};
//               if (verifyContentType && verifyContentType.includes("application/json")) {
//                 verifyData = await verifyResponse.json();
//               } else {
//                 const errorText = await verifyResponse.text();
//                 throw new Error(errorText || `Validation API returned invalid content type. HTTP status: ${verifyResponse.status}`);
//               }

//               if (!verifyResponse.ok) {
//                 throw new Error(verifyData.error || 'Razorpay payment verification rejected');
//               }

//               // Direct client side sync fallback if server didn\'t save in DB
//               if (verifyData.savedInDB === false && verifyData.orderPayload) {
//                 try {
//                   const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
//                   const { db } = await import('../lib/firebase');
//                   const orderDocPayload = {
//                     ...verifyData.orderPayload,
//                     createdAt: serverTimestamp()
//                   };
//                   delete orderDocPayload.savedInDB;
//                   await setDoc(doc(db, 'orders', verifyData.orderId), orderDocPayload);
//                 } catch (ce) {
//                   console.warn('Client direct firestore sync failed:', ce);
//                 }
//               }

//               setOrderReceipt(verifyData);
//               setIsCheckingOut(false);
//               setShowPaymentGateway(false);
//               setCheckoutComplete(true);
//               clearCart();
//             } catch (err: any) {
//               setCheckoutError(err.message || 'Payment signature verification failed.');
//               setIsCheckingOut(false);
//             }
//           },
//           prefill: {
//             name: user?.displayName || user?.email || '',
//             email: user?.email || '',
//           },
//           theme: {
//             color: '#BFEC53',
//           },
//           modal: {
//             ondismiss: function () {
//               setIsCheckingOut(false);
//             }
//           }
//         };

//         const rzp = new (window as any).Razorpay(options);
//         rzp.open();
//       }
//     } catch (err: any) {
//       console.error('[Razorpay payment activation failed]:', err);
//       setCheckoutError(err.message || 'Could not launch Razorpay platform gateway.');
//       setIsCheckingOut(false);
//     }
//   };

//   // Verification pipeline for interactive sandbox testing
//   const handleVerifyMockPay = async () => {
//     setIsCheckingOut(true);
//     setCheckoutError('');
//     try {
//       const mockPaymentId = `pay_mock_${Math.floor(100000 + Math.random() * 900000)}BLZ`;
//       const verifyResponse = await fetch('/api/razorpay/verify-payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           razorpay_order_id: razorpaySandboxOrderId,
//           razorpay_payment_id: mockPaymentId,
//           razorpay_signature: 'sandbox_simulation_signature',
//           userId: user?.uid,
//           email: user?.email || '',
//           items: cart.map((item) => ({
//             id: item.id,
//             productName: item.product.name,
//             productId: item.product.id,
//             quantity: item.quantity,
//             price: item.price,
//             selectedColor: {
//               name: item.selectedColor.name,
//               value: item.selectedColor.value,
//               imageUrl: item.selectedColor.imageUrl
//             }
//           })),
//           itemsSubtotal,
//           discountAmount,
//           finalTotal,
//           isMock: true
//         })
//       });

//       const sandboxVerifyContentType = verifyResponse.headers.get("content-type");
//       let verifyData: any = {};
//       if (sandboxVerifyContentType && sandboxVerifyContentType.includes("application/json")) {
//         verifyData = await verifyResponse.json();
//       } else {
//         const errorText = await verifyResponse.text();
//         throw new Error(errorText || `Mock validation API returned invalid content type. HTTP status: ${verifyResponse.status}`);
//       }

//       if (!verifyResponse.ok) {
//         throw new Error(verifyData.error || 'Mock simulation payment verification refused');
//       }

//       // Sync direct client side Firestore
//       if (verifyData.savedInDB === false && verifyData.orderPayload) {
//         try {
//           const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
//           const { db } = await import('../lib/firebase');
//           const orderDocPayload = {
//             ...verifyData.orderPayload,
//             createdAt: serverTimestamp()
//           };
//           delete orderDocPayload.savedInDB;
//           await setDoc(doc(db, 'orders', verifyData.orderId), orderDocPayload);
//         } catch (ce) {
//           console.warn('Client direct firestore mock sync failed:', ce);
//         }
//       }

//       setOrderReceipt(verifyData);
//       setIsCheckingOut(false);
//       setShowRazorpaySandbox(false);
//       setShowPaymentGateway(false);
//       setCheckoutComplete(true);
//       clearCart();
//     } catch (err: any) {
//       console.error('[Razorpay Sandbox verifier error]:', err);
//       setCheckoutError(err.message || 'Mock razorpay validation error');
//       setIsCheckingOut(false);
//     }
//   };

//   const handleSubmitPayment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setCheckoutError('');
//     setIsCheckingOut(true);

//     if (activePaymentTab === 'razorpay') {
//       await handleRazorpayPayment();
//       return;
//     }

//     try {
//       const serializedItems = cart.map((item) => ({
//         id: item.id,
//         productName: item.product.name,
//         productId: item.product.id,
//         quantity: item.quantity,
//         price: item.price,
//         selectedColor: {
//           name: item.selectedColor.name,
//           value: item.selectedColor.value,
//           imageUrl: item.selectedColor.imageUrl
//         }
//       }));

//       if (user?.isSimulated) {
//         let mockSummary = "";
//         const transId = `TXN-BLZ-${Math.floor(100000 + Math.random() * 900000)}`;
//         if (activePaymentTab === 'card') {
//           if (!cardholderName || cardholderName.trim().length < 3) {
//             throw new Error("Invalid cardholder name. Enter at least 3 characters.");
//           }
//           const cleanNum = cardNumber.replace(/\s/g, "");
//           if (!/^\d{13,19}$/.test(cleanNum)) {
//             throw new Error("Invalid credit card number. Must be between 13 and 19 digits.");
//           }
//           if (!/^\d{3,4}$/.test(cardCvv)) {
//             throw new Error("Invalid CVV code. Must be a 3 or 4-digit number.");
//           }
//           if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
//             throw new Error("Invalid expiry date. Must be in MM/YY format.");
//           }
//           mockSummary = `Visa Card ending in •••• ${cleanNum.slice(-4)}`;
//         } else if (activePaymentTab === 'upi') {
//           if (!upiId || !upiId.includes('@')) {
//             throw new Error("Invalid UPI address format.");
//           }
//           mockSummary = `UPI Transfer via ${upiId.toLowerCase()}`;
//         } else {
//           if (!selectedBank) {
//             throw new Error("Please select a bank for net banking checkout.");
//           }
//           mockSummary = `Netbanking Transfer from ${selectedBank}`;
//         }

//         const placementId = await placeOrder(itemsSubtotal, discountAmount, finalTotal, {
//           paymentMethod: activePaymentTab,
//           transactionId: transId,
//           detailsSummary: mockSummary
//         });

//         setOrderReceipt({
//           orderId: placementId,
//           transactionId: transId,
//           paymentMethod: activePaymentTab,
//           detailsSummary: mockSummary
//         });

//         setIsCheckingOut(false);
//         setShowPaymentGateway(false);
//         setCheckoutComplete(true);
//         clearCart();
//         return;
//       }

//       // Live full-stack secure backend payment POST request
//       const response = await fetch('/api/checkout/pay', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: user.uid,
//           email: user?.email || '',
//           items: serializedItems,
//           itemsSubtotal,
//           discountAmount,
//           finalTotal,
//           paymentMethod: activePaymentTab,
//           cardDetails: activePaymentTab === 'card' ? {
//             cardholderName,
//             cardNumber,
//             expiry: cardExpiry,
//             cvv: cardCvv
//           } : undefined,
//           upiDetails: activePaymentTab === 'upi' ? {
//             upiId
//           } : undefined,
//           netbankingDetails: activePaymentTab === 'netbanking' ? {
//             bankName: selectedBank
//           } : undefined
//         })
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || "Secure billing process failure.");
//       }

//       // Safe Client-side sync if Direct Server-admin Firestore write failed
//       if (data.savedInDB === false && data.orderPayload) {
//         try {
//           const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
//           const { db } = await import('../lib/firebase');
          
//           const orderDocPayload = {
//             ...data.orderPayload,
//             createdAt: serverTimestamp() // convert to client serverTimestamp for rules schema match
//           };
//           delete orderDocPayload.savedInDB;
          
//           await setDoc(doc(db, 'orders', data.orderId), orderDocPayload);
//           console.log("[Client] Successfully synchronized payment verified order to Firestore from client-side!");
//         } catch (clientWriteErr) {
//           console.warn("[Client] Direct client-side write of payment receipt failed:", clientWriteErr);
//           // Standard custom local storage fallback cache
//           const savedLocalOrders = localStorage.getItem(`balanza_local_orders_${user.uid}`);
//           let localList = [];
//           if (savedLocalOrders) {
//             try { localList = JSON.parse(savedLocalOrders); } catch (e) {}
//           }
//           localList.unshift({
//             ...data.orderPayload,
//             createdAt: { seconds: Math.floor(Date.now() / 1000) }
//           });
//           localStorage.setItem(`balanza_local_orders_${user.uid}`, JSON.stringify(localList));
//         }
//       }

//       setOrderReceipt(data);
//       setIsCheckingOut(false);
//       setShowPaymentGateway(false);
//       setCheckoutComplete(true);
//       clearCart();

//     } catch (err: any) {
//       console.error("[Checkout Payment Exception]:", err);
//       setCheckoutError(err.message || "Failed to finalize billing. Check inputs.");
//       setIsCheckingOut(false);
//     }
//   };

//   const handleMenuLinkClick = (selectorId: string) => {
//     setMenuOpen(false);
//     setActivePage('home');
//     setTimeout(() => {
//       const element = document.getElementById(selectorId);
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth' });
//       } else {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       }
//     }, 150);
//   };

//   // Searching filter logic
//   const filteredBikes = searchQuery.trim() === ''
//     ? []
//     : bikes.filter(bike =>
//         bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (bike.description && bike.description.toLowerCase().includes(searchQuery.toLowerCase()))
//       );

//   const formatPrice = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   return (
//     <>
//       {/* ----------------- 1. LEFT MENU DRAWER ----------------- */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-50 flex select-none">
//           <div 
//             onClick={() => setMenuOpen(false)}
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
//           />
//           <div className="relative flex w-full max-w-[325px] flex-col bg-white shadow-2xl animate-slide-right text-left justify-between h-full">
            
//             {/* Top Logo and Close Circle with Neon Green background */}
//             <div className="bg-[#A7E22E] px-7 py-6 flex items-center justify-between border-b border-slate-950/10">
//               <div className="flex items-center gap-3">
//                 <BalanzaLogo className="h-11 md:h-13 w-auto text-slate-950" />
//               </div>
//               <button 
//                 onClick={() => setMenuOpen(false)}
//                 className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/5 text-slate-900 hover:text-black hover:bg-slate-950/10 hover:scale-105 transition-all cursor-pointer"
//                 aria-label="Close Menu"
//               >
//                 <X className="h-4.5 w-4.5" />
//               </button>
//             </div>

//             <div className="p-7 flex-1 flex flex-col justify-between overflow-y-auto">
//               {/* Navigation Links matched perfectly to screenshot */}
//               <div>
//                 <nav className="flex flex-col space-y-6">
                  
//                   {/* Our Bikes Option */}
//                   <button 
//                     onClick={() => handleMenuLinkClick('our-bikes')} 
//                     className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
//                   >
//                     Our Bikes
//                   </button>

//                   {/* Learn option (Dropdown) */}
//                   <div className="flex flex-col">
//                     <button 
//                       onClick={() => setIsLearnExpanded(!isLearnExpanded)}
//                       className="flex items-center justify-between text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
//                     >
//                       <span>Learn</span>
//                       <ChevronDown className={`h-4.5 w-4.5 text-slate-405 transition-transform duration-300 ${isLearnExpanded ? 'rotate-180' : ''}`} />
//                     </button>
                    
//                     <AnimatePresence initial={false}>
//                       {isLearnExpanded && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: 'auto', opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//                           className="overflow-hidden"
//                         >
//                           <div className="mt-4 pl-4 flex flex-col space-y-4 border-l-2 border-slate-100">
//                             <button 
//                               onClick={() => handleMenuLinkClick('why-balance-bikes')} 
//                               className="text-left font-display text-[13px] font-bold text-slate-550 hover:text-[#A7E22E] hover:translate-x-0.5 transition-all cursor-pointer"
//                             >
//                               Why Balance Bikes
//                             </button>
//                             <button 
//                               onClick={() => {
//                                 setMenuOpen(false);
//                                 setActivePage('assembly');
//                                 window.scrollTo({ top: 0, behavior: 'smooth' });
//                               }} 
//                               className="text-left font-display text-[13px] font-bold text-slate-550 hover:text-[#A7E22E] hover:translate-x-0.5 transition-all cursor-pointer"
//                             >
//                               Assembly Instructions
//                             </button>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>

//                   {/* Our Story Option */}
//                   <button 
//                     onClick={() => {
//                       setMenuOpen(false);
//                       setActivePage('story');
//                       window.scrollTo({ top: 0, behavior: 'smooth' });
//                     }} 
//                     className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
//                   >
//                     Our Story
//                   </button>

//                   {/* Blogs Option */}
//                   <button 
//                     onClick={() => {
//                       setMenuOpen(false);
//                       setActivePage('blogs');
//                     }} 
//                     className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
//                   >
//                     Blogs
//                   </button>

//                   {/* Contact Option */}
//                   <button 
//                     onClick={() => {
//                       setMenuOpen(false);
//                       setActivePage('contact');
//                       window.scrollTo({ top: 0, behavior: 'smooth' });
//                     }} 
//                     className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
//                   >
//                     Contact Us
//                   </button>

//                 </nav>
//               </div>

//               {/* Bottom Section: Grey Social circles matching screenshot */}
//               <div className="flex items-center gap-3.5 pt-6 border-t border-slate-50 mt-8">
//                 <a 
//                   href="https://instagram.com" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
//                   title="Instagram"
//                 >
//                   <Instagram className="h-5 w-5" />
//                 </a>
//                 <a 
//                   href="https://www.facebook.com/share/1EDyePAqdc/?mibextid=wwXIfr" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
//                   title="Facebook"
//                 >
//                   <Facebook className="h-5 w-5" />
//                 </a>
//                 <a 
//                   href="https://x.com/Balanzabikes" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
//                   title="Twitter / X"
//                 >
//                   <Twitter className="h-5 w-5" />
//                 </a>
//                 <a 
//                   href="https://telegram.org" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
//                   title="Telegram"
//                 >
//                   <Send className="h-4.5 w-4.5" />
//                 </a>
//               </div>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* ----------------- 2. RIGHT CART DRAWER ----------------- */}
//       {isCartOpen && (
//         <div className="fixed inset-0 z-50 flex justify-end select-none">
//           <div 
//             onClick={() => setCartOpen(false)}
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
//           />
          
//           <div className="relative flex w-full max-w-md flex-col bg-white p-6 shadow-2xl animate-slide-left text-left h-full">
//             {showPaymentGateway ? (
//               /* SECURE DIRECT Directdirect direct Direct directe Direct-direct Checkout direct Payment Gateway Sub-state Layout */
//               <div className="flex flex-col h-full justify-between animate-fade-in font-sans">
//                 <div>
//                   <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-5">
//                     <div className="flex items-center gap-1.5 text-slate-800">
//                       <span className="text-sm">🔒</span>
//                       <h3 className="font-display text-xs font-black uppercase tracking-widest text-[#1D3B28]">
//                         Balanza Direct Gateway
//                       </h3>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => { setShowPaymentGateway(false); setCheckoutError(''); }}
//                       className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 hover:text-black hover:underline cursor-pointer font-sans"
//                     >
//                       &larr; Back to Bag
//                     </button>
//                   </div>

//                   {/* Summary row */}
//                   <div className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-xl p-3 mb-5 text-xs">
//                     <div>
//                       <span className="font-bold text-slate-800">Direct Pay Amount</span>
//                       <p className="text-[10px] text-slate-500 font-sans">{cart.length} items with free shipping</p>
//                     </div>
//                     <span className="font-mono text-base font-extrabold text-[#5F6D50]">{formatPrice(finalTotal)}</span>
//                   </div>

//                   {/* Payment Tabs Selection */}
//                   <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl mb-5 font-sans">
//                     {(['razorpay', 'card', 'upi', 'netbanking'] as const).map((tab) => (
//                       <button
//                         key={tab}
//                         type="button"
//                         onClick={() => { setActivePaymentTab(tab); setCheckoutError(''); }}
//                         className={`py-2 text-[8px] font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer ${
//                           activePaymentTab === tab
//                             ? 'bg-white text-slate-900 shadow-3xs'
//                             : 'text-slate-505 hover:text-slate-800'
//                         }`}
//                       >
//                         {tab === 'razorpay' ? '⚡ Razor' : tab === 'card' ? '💳 Card' : tab === 'upi' ? '📱 UPI' : '🏦 Bank'}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Checkout Tab Inputs Form Container */}
//                   <form onSubmit={handleSubmitPayment} className="space-y-4">
//                     {activePaymentTab === 'razorpay' && (
//                       <div className="space-y-3.5 animate-fade-in font-sans p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-2xl text-left">
//                         <div className="flex items-center gap-2.5">
//                           <div className="h-8.5 w-8.5 rounded-full bg-slate-950 flex items-center justify-center font-bold text-[#BFEC53] select-none text-[12px] font-mono shrink-0">
//                             R
//                           </div>
//                           <div>
//                             <span className="text-[8px] font-black uppercase text-emerald-800 tracking-wider block">Official Payment Gateway</span>
//                             <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight font-display">Razorpay Real-time Pay</h4>
//                           </div>
//                         </div>
//                         <p className="text-[11px] text-slate-600 leading-normal font-sans">
//                           Pay instantly using the secure Razorpay unified layout. Clicking below will open the payment panel allowing Credit/Debit cards, UPI handles, QR codes, or bank details.
//                         </p>
//                         <div className="border-t border-emerald-100/60 pt-3 flex items-center gap-2 text-[10px] text-emerald-800 font-medium">
//                           <span>🛡️</span>
//                           <span>Fully verified secure transactions.</span>
//                         </div>
//                       </div>
//                     )}

//                     {activePaymentTab === 'card' && (
//                       <div className="space-y-3.5 animate-fade-in font-sans">
//                         <div className="flex flex-col gap-1">
//                           <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
//                             Cardholder Name
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={cardholderName}
//                             onChange={(e) => setCardholderName(e.target.value)}
//                             placeholder="e.g. SANKET GUPTA"
//                             className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350"
//                           />
//                         </div>

//                         <div className="flex flex-col gap-1">
//                           <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
//                             Card Number
//                           </label>
//                           <div className="relative">
//                             <input
//                               type="text"
//                               required
//                               value={cardNumber}
//                               onChange={handleCardNumberChange}
//                               placeholder="4111 2222 3333 4444"
//                               className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-mono font-bold tracking-wider focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350"
//                             />
//                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold uppercase select-none tracking-widest font-sans">
//                               {cardNumber.startsWith('5') ? 'MC' : cardNumber.startsWith('3') ? 'AMEX' : 'VISA'}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-3">
//                           <div className="flex flex-col gap-1">
//                             <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
//                               Expiry Date
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               value={cardExpiry}
//                               onChange={handleExpiryChange}
//                               placeholder="MM/YY"
//                               className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-mono font-bold tracking-wider text-center focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350"
//                             />
//                           </div>

//                           <div className="flex flex-col gap-1">
//                             <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-405 font-sans">
//                               CVV / CVC
//                             </label>
//                             <input
//                               type="password"
//                               required
//                               maxLength={4}
//                               value={cardCvv}
//                               onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
//                               placeholder="•••"
//                               className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-mono font-bold tracking-widest text-center focus:ring-1 focus:ring-slate-950 focus:outline-none focus:border-slate-800 placeholder-slate-350"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {activePaymentTab === 'upi' && (
//                       <div className="space-y-4 animate-fade-in font-sans">
//                         <div className="flex flex-col gap-1">
//                           <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
//                             Unified Payments Interface Address (VPA)
//                           </label>
//                           <div className="flex gap-1.5">
//                             <input
//                               type="text"
//                               required
//                               value={upiId}
//                               onChange={(e) => {
//                                 setUpiId(e.target.value);
//                                 setVerifiedUpiName("");
//                               }}
//                               placeholder="e.g. sgupta@okaxis"
//                               className="flex-1 px-3 py-2 border border-slate-205 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350 font-mono"
//                             />
//                             <button
//                               type="button"
//                               onClick={handleVerifyUpi}
//                               disabled={isUpiVerifying}
//                               className="bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider select-none shrink-0 transition-all cursor-pointer font-sans"
//                             >
//                               {isUpiVerifying ? 'Wait...' : 'Verify ID'}
//                             </button>
//                           </div>
//                           {verifiedUpiName ? (
//                             <p className="text-[9px] font-black text-emerald-600 flex items-center gap-1 mt-1 font-sans">
//                               <span>✓</span> {verifiedUpiName}
//                             </p>
//                           ) : (
//                             <p className="text-[9px] text-slate-400 leading-normal font-sans">
//                               Payments clear securely in real-time from your UPI application (GPay, PhonePe, Paytm).
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {activePaymentTab === 'netbanking' && (
//                       <div className="space-y-4 animate-fade-in font-sans">
//                         <div className="flex flex-col gap-1">
//                           <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
//                             Select Popular Bank Asset
//                           </label>
//                           <select
//                             required
//                             value={selectedBank}
//                             onChange={(e) => setSelectedBank(e.target.value)}
//                             className="w-full px-3 py-2 border border-slate-205 bg-white rounded-lg text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800"
//                           >
//                             <option value="">-- Click to choose bank --</option>
//                             <option value="HDFC Bank">HDFC Bank</option>
//                             <option value="ICICI Bank">ICICI Bank</option>
//                             <option value="State Bank of India">State Bank of India</option>
//                             <option value="Axis Bank">Axis Bank</option>
//                             <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
//                           </select>
//                           <p className="text-[9px] text-slate-400 leading-normal font-sans mt-1">
//                             You will be redirected securely to your bank dashboard to authorize the credit receipt.
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {checkoutError && (
//                       <p className="text-[10px] font-bold text-rose-500 text-center animate-pulse pt-2 leading-relaxed">
//                         {checkoutError}
//                       </p>
//                     )}

//                     {/* Pay trigger Button */}
//                     <div className="pt-4 border-t border-slate-150 mt-5">
//                       <button
//                         type="submit"
//                         disabled={isCheckingOut || (activePaymentTab === 'upi' && upiId && !verifiedUpiName)}
//                         className={`w-full rounded py-4 text-center text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
//                           isCheckingOut || (activePaymentTab === 'upi' && upiId && !verifiedUpiName)
//                             ? 'bg-zinc-900 text-white'
//                             : 'bg-[#BFEC53] text-[#111] hover:bg-[#a9d146]'
//                         } ${
//                           activePaymentTab === 'upi' && upiId && !verifiedUpiName ? 'opacity-80 cursor-not-allowed' : ''
//                         }`}
//                       >
//                         {isCheckingOut ? (
//                           <>
//                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                             AUTHORIZING FUND TRANSFER...
//                           </>
//                         ) : (
//                           `Pay ${formatPrice(finalTotal)} Securely`
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>

//                 {/* Secure certificate and logos footer */}
//                 <div className="text-center pt-5 select-none font-sans">
//                   <div className="flex justify-center items-center gap-1 text-slate-400 mb-1">
//                     <span className="text-[10px]">🛡️</span>
//                     <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-sans">
//                       Secure SSL Checkout
//                     </p>
//                   </div>
//                   <p className="text-[9px] text-slate-400 leading-relaxed font-sans font-medium">
//                     Fully PCI DSS Level 1 Accredited. Balanza protects your payment details using top-tier encryption algorithms.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-850">
//                       Shopping Cart
//                     </h3>
//                     <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
//                       {cart.length}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {cart.length > 0 && (
//                       <button 
//                         onClick={clearCart}
//                         className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
//                         title="Clear All Cart"
//                       >
//                         <Trash2 className="h-4.5 w-4.5" />
//                       </button>
//                     )}
//                     <button 
//                       onClick={() => setCartOpen(false)}
//                       className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-505 hover:bg-slate-100 cursor-pointer"
//                       title="Close Cart"
//                     >
//                       <X className="h-4.5 w-4.5" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Cart body */}
//                 <div className="flex-1 overflow-y-auto pr-1">
//                   {cart.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center text-center h-full py-12 px-6">
//                       <BalanzaBagIcon className="w-36 h-36 md:w-44 md:h-44 mb-6 drop-shadow-sm" />
//                       <h4 className="font-display text-sm md:text-base font-black uppercase tracking-widest text-slate-900 mb-6 max-w-[280px] leading-snug">
//                         YOUR CART IS WAITING FOR ADVENTURE.
//                       </h4>
//                       <button
//                         onClick={() => {
//                           setCartOpen(false);
//                           const el = document.getElementById('our-bikes');
//                           if (el) el.scrollIntoView({ behavior: 'smooth' });
//                         }}
//                         className="rounded bg-zinc-900 px-8 py-4 text-xs md:text-sm font-black uppercase tracking-widest text-white hover:bg-black transition-all cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md duration-200"
//                       >
//                         START SHOPPING
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {cart.map((item) => (
//                         <div 
//                           key={item.id}
//                           className="flex gap-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100"
//                         >
//                           <div className="aspect-square w-16 md:w-20 rounded-lg bg-white p-1.5 flex items-center justify-center border border-slate-100">
//                             <img
//                               src={item.selectedColor.imageUrl}
//                               alt={item.product.name}
//                               className="max-h-full object-contain"
//                             />
//                           </div>
                          
//                           <div className="flex-1 flex flex-col justify-between text-xs">
//                             <div>
//                               <div className="flex items-start justify-between">
//                                 <h4 className="font-display font-bold text-slate-850 truncate max-w-[180px]">
//                                   {item.product.name}
//                                 </h4>
//                                 <button 
//                                   onClick={() => removeFromCart(item.id)}
//                                   className="text-slate-400 hover:text-rose-500 cursor-pointer pl-2"
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </button>
//                               </div>
                              
//                               <div className="flex items-center gap-1.5 mt-1">
//                                 <span 
//                                   className="h-2.5 w-2.5 rounded-full" 
//                                   style={{ backgroundColor: item.selectedColor.value }} 
//                                 />
//                                 <span className="text-[10px] text-slate-500 font-medium font-sans">
//                                   {item.selectedColor.name} • {item.product.ageYears}
//                                 </span>
//                               </div>
//                             </div>

//                             {/* Quantity controls & dynamic subtotal */}
//                             <div className="flex items-center justify-between mt-2.5 border-t border-slate-100/80 pt-2">
//                               <div className="flex items-center border border-slate-200 bg-white rounded">
//                                 <button
//                                   onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
//                                   className="px-2 py-1 text-slate-500 hover:bg-slate-50 cursor-pointer"
//                                 >
//                                   <Minus className="h-3 w-3" />
//                                 </button>
//                                 <span className="px-2.5 font-mono font-bold text-slate-800">
//                                   {item.quantity}
//                                 </span>
//                                 <button
//                                   onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
//                                   className="px-2 py-1 text-slate-505 hover:bg-slate-50 cursor-pointer"
//                                 >
//                                   <Plus className="h-3 w-3" />
//                                 </button>
//                               </div>
//                               <span className="font-mono font-extrabold text-[#5F6D50]">
//                                 {formatPrice(item.price * item.quantity)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Cart footer totals */}
//                 {cart.length > 0 && (
//                   <div className="border-t border-gray-150 pt-5 mt-4 space-y-4">
                    
//                     {/* Subtotals */}
//                     <div className="space-y-2 text-xs text-slate-500 border-b border-gray-100 pb-3 font-medium font-sans">
//                       <div className="flex justify-between">
//                         <span>Subtotal</span>
//                         <span className="font-mono">{formatPrice(itemsSubtotal)}</span>
//                       </div>
//                       {discountPercent > 0 && (
//                         <div className="flex justify-between text-emerald-600">
//                           <span>Discount ({discountPercent}%)</span>
//                           <span className="font-mono">-{formatPrice(discountAmount)}</span>
//                         </div>
//                       )}
//                       <div className="flex justify-between">
//                         <span>Shipping</span>
//                         <span className="text-emerald-600 font-bold uppercase">FREE</span>
//                       </div>
//                     </div>

//                     <div className="flex justify-between items-baseline pt-1">
//                       <span className="font-display text-sm font-bold uppercase tracking-widest text-slate-800">Total</span>
//                       <span className="font-mono text-xl font-extrabold text-[#5F6D50]">{formatPrice(finalTotal)}</span>
//                     </div>

//                     {checkoutError && (
//                       <p className="text-[11px] font-bold text-rose-500 text-center animate-pulse">
//                         {checkoutError}
//                       </p>
//                     )}

//                     <button
//                       onClick={handleStartCheckout}
//                       disabled={isCheckingOut}
//                       className="w-full rounded bg-zinc-900 text-white hover:bg-[#BFEC53] hover:text-[#111] py-4 text-center text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:bg-zinc-900 disabled:text-white"
//                     >
//                       {isCheckingOut ? (
//                         <>
//                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                           PROCESSING SECURE HARNESS...
//                         </>
//                       ) : (
//                         'PROCEED TO SECURE CHECKOUT'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ----------------- 3. FULL SCREEN SEARCH OVERLAY ----------------- */}
//       {isSearchOpen && (
//         <div className="fixed inset-0 bg-slate-950/95 z-55 flex flex-col justify-start items-center p-6 select-none md:p-12 animate-fade-in overflow-y-auto">
          
//           <button
//             onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
//             className="fixed top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white hover:scale-105 transition-all cursor-pointer border border-slate-800 z-50"
//             title="Close Search"
//           >
//             <X className="h-5 w-5" />
//           </button>

//           <div className="max-w-2xl w-full flex flex-col items-center mt-16 md:mt-24">
//             <span className="text-[10px] font-bold tracking-widest text-[#BFEC53] uppercase mb-3">
//               Explore the Balanza Fleet
//             </span>
            
//             {/* Real responsive Input field */}
//             <div className="relative w-full border-b-2 border-slate-800 focus-within:border-[#BFEC53] transition-colors pb-2">
//               <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
//               <input
//                 type="text"
//                 autoFocus
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search our collection... (e.g., explorer, black, pink)"
//                 className="w-full bg-transparent pl-9 pr-4 text-xl md:text-2xl text-white focus:outline-none placeholder-slate-500 font-display font-medium"
//               />
//             </div>

//             {/* Quick Suggestions tags */}
//             <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
//               <span className="text-[10px] text-slate-500 uppercase font-bold">Try searching:</span>
//               {['Explorer', 'Mini Rider', 'Neo Series', 'Olive', 'Black'].map((suggest) => (
//                 <button
//                   key={suggest}
//                   onClick={() => setSearchQuery(suggest)}
//                   className="rounded-full border border-slate-800 px-3 py-1 text-[10px] text-slate-300 hover:border-[#BFEC53] hover:text-white transition-all cursor-pointer"
//                 >
//                   {suggest}
//                 </button>
//               ))}
//             </div>

//             {/* Simulated Live Filtering queries */}
//             <div className="w-full mt-10 overflow-y-auto max-h-[50vh] pr-2">
//               {filteredBikes.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {filteredBikes.map(bike => (
//                     <div 
//                       key={bike.id}
//                       className="bg-zinc-900 rounded-xl p-4 flex gap-4 border border-slate-800/80 hover:border-slate-700 hover:scale-[1.01] transition-all text-left"
//                     >
//                       <div className="aspect-square w-16 bg-white rounded p-1.5 flex items-center justify-center border border-slate-800 flex-shrink-0">
//                         <img
//                           src={bike.colors[0].imageUrl}
//                           alt={bike.name}
//                           className="max-h-full object-contain"
//                         />
//                       </div>
//                       <div className="text-xs">
//                         <h4 className="font-display font-bold text-white uppercase tracking-wider">{bike.name}</h4>
//                         <p className="text-[#BFEC53] font-bold font-mono mt-0.5">{formatPrice(bike.basePrice)}</p>
//                         <p className="text-slate-400 mt-1 line-clamp-1 truncate font-sans">{bike.description}</p>
                        
//                         <div className="flex gap-2.5 mt-3">
//                           <button
//                             onClick={() => {
//                               addToCart(bike, bike.colors[0]);
//                               setSearchOpen(false);
//                             }}
//                             className="bg-white text-black px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-gray-100 transition-colors cursor-pointer"
//                           >
//                             Buy Original
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedQuickView(bike);
//                               setSearchOpen(false);
//                             }}
//                             className="text-[#BFEC53] hover:underline text-[9px] font-bold uppercase tracking-widest"
//                           >
//                             Details
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : searchQuery.trim() !== '' ? (
//                 <div className="text-center text-slate-500 py-10">
//                   <p className="text-xs">We couldn&apos;t find any balance models matching &ldquo;{searchQuery}&rdquo;.</p>
//                   <p className="text-[10px] hover:underline text-slate-400 mt-1 cursor-pointer" onClick={() => setSearchQuery('')}>Clear Query</p>
//                 </div>
//               ) : null}
//             </div>

//           </div>
//         </div>
//       )}

//       {/* ----------------- 4. PRODUCT QUICK VIEW DIALOG ----------------- */}
//       {selectedQuickView && (
//         <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-55 flex items-center justify-center p-4 select-none">
//           <div className="bg-white rounded-3xl overflow-y-auto max-h-[95vh] max-w-2xl w-full border border-slate-100 shadow-2xl relative animate-scale-up text-left">
//             <button
//               onClick={() => setSelectedQuickView(null)}
//               className="absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer shadow-sm active:scale-90"
//               title="Close View"
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-2">
              
//               {/* Left image holder block */}
//               <div className="bg-slate-50/70 p-6 flex flex-col items-center justify-center min-h-[280px]">
//                 <img
//                   src={selectedQuickView.colors[quickViewColorIdx]?.imageUrl || selectedQuickView.colors[0]?.imageUrl}
//                   alt={`${selectedQuickView.name} - ${selectedQuickView.colors[quickViewColorIdx]?.name || ''}`}
//                   className="max-h-[220px] object-contain transition-transform duration-300"
//                 />
                
//                 <div className="flex items-center gap-1.5 mt-4 bg-white/80 border border-slate-100 rounded-full px-4 py-1.5 shadow-sm">
//                   <span className="h-2 w-2 rounded-full bg-emerald-500 block animate-pulse"></span>
//                   <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
//                     In Stock • Ready to Ship
//                   </span>
//                 </div>
//               </div>

//               {/* Right text layout */}
//               <div className="p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100">
//                 <div>
//                   <span className="text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-55/70 px-2 py-0.5 rounded uppercase inline-block mb-2">
//                     {selectedQuickView.ageYears}
//                   </span>
                  
//                   <h3 className="font-display text-xl md:text-2xl font-black text-slate-950 uppercase tracking-wide leading-tight">
//                     {selectedQuickView.name}
//                   </h3>
                  
//                   <p className="text-xl font-extrabold tracking-tight mt-1.5 mb-4" style={{ color: '#111' }}>
//                     {formatPrice(selectedQuickView.basePrice)}
//                   </p>
                  
//                   <p className="font-sans text-xs text-slate-500 leading-relaxed mb-5">
//                     {selectedQuickView.description}
//                   </p>

//                   {/* Attributes details list */}
//                   <div className="space-y-2 mb-5 font-sans text-[11px] text-slate-600 font-medium">
//                     <div className="flex border-b border-slate-100 pb-1.5">
//                       <span className="w-28 text-slate-400 font-semibold">Net Weight</span>
//                       <span className="text-slate-800">1.9 Kg</span>
//                     </div>
//                     <div className="flex border-b border-slate-100 pb-1.5">
//                       <span className="w-28 text-slate-400 font-semibold">Frame</span>
//                       <span className="text-slate-800">Carbon Steel</span>
//                     </div>
//                     <div className="flex border-b border-slate-100 pb-1.5">
//                       <span className="w-28 text-slate-400 font-semibold">Wheels</span>
//                       <span className="text-slate-800">Anti Skid Wheels</span>
//                     </div>
//                     <div className="flex border-b border-slate-100 pb-1.5">
//                       <span className="w-28 text-slate-400 font-semibold">Other Features</span>
//                       <div className="flex flex-col gap-0.5 text-slate-800 font-medium">
//                         <span>Non-slip handlebar</span>
//                         <span>Soft Cushioned Seat</span>
//                         <span>135° Steering Limit</span>
//                       </div>
//                     </div>
//                     <div className="flex flex-col gap-2 pt-1">
//                       <div className="flex items-center">
//                         <span className="w-28 text-slate-400 font-semibold">Select Color:</span>
//                         <span className="text-slate-900 font-bold capitalize text-xs bg-slate-100 px-2 py-0.5 rounded">
//                           {selectedQuickView.colors[quickViewColorIdx]?.name || ''}
//                         </span>
//                       </div>
//                       <div className="flex gap-2.5 flex-wrap pl-0 mt-1">
//                         {selectedQuickView.colors.map((c, idx) => (
//                           <button
//                             key={c.name}
//                             type="button"
//                             onClick={() => setQuickViewColorIdx(idx)}
//                             className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
//                               quickViewColorIdx === idx 
//                                 ? 'border-slate-900 scale-110 shadow-md ring-2 ring-slate-950/20' 
//                                 : 'border-slate-200 hover:border-slate-400 hover:scale-105'
//                             }`}
//                             style={{ backgroundColor: c.value }}
//                             title={c.name}
//                           >
//                             {quickViewColorIdx === idx && (
//                               <span className="h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2.5 pt-4 border-t border-slate-100">
//                   {/* "Buy Now" Neon Green Button */}
//                   <button
//                     onClick={() => {
//                       const color = selectedQuickView.colors[quickViewColorIdx] || selectedQuickView.colors[0];
//                       addToCart(selectedQuickView, color);
//                       setSelectedQuickView(null);
//                       setCartOpen(true);
//                     }}
//                     className="w-full text-center rounded-xl bg-[#A7E22E] hover:bg-[#99cf28] text-slate-950 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
//                   >
//                     Buy Now
//                   </button>

//                   {/* "Add to Cart" Black Button */}
//                   <button
//                     onClick={() => {
//                       const color = selectedQuickView.colors[quickViewColorIdx] || selectedQuickView.colors[0];
//                       addToCart(selectedQuickView, color);
//                       setSelectedQuickView(null);
//                     }}
//                     className="w-full text-center rounded-xl bg-zinc-900 hover:bg-black text-white py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer active:scale-98"
//                   >
//                     Add to Cart
//                   </button>
//                 </div>

//               </div>

//             </div>
//           </div>
//         </div>
//       )}

//       {/* ----------------- 5. CHECKOUT COMPLETION SUCCESS MODAL ----------------- */}
//       {checkoutComplete && (
//         <div className="fixed inset-0 bg-slate-950/80 z-60 flex items-center justify-center p-4 select-none">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 animate-scale-up">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-5 relative">
//               <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
//               <CheckCircle className="h-9 w-9" />
//             </div>

//             <span className="text-[10px] font-bold tracking-widest text-[#B4D33C] uppercase block mb-1">
//               Thank You Explorer
//             </span>
//             <h3 className="font-display text-lg font-bold text-slate-900 mb-3 uppercase tracking-wider">
//               Order Placed Successfully!
//             </h3>
            
//             {orderReceipt && (
//               <div className="my-5 p-4 bg-slate-50 border border-slate-150 rounded-xl text-left space-y-2 font-mono text-[10px] text-slate-750">
//                 <p className="font-sans font-bold text-slate-500 uppercase tracking-wider text-[9px] mb-2 text-center pb-1.5 border-b border-slate-200">
//                   Transaction Receipt
//                 </p>
//                 <div className="flex justify-between">
//                   <span className="text-slate-400 font-sans">Order ID:</span>
//                   <span className="font-bold text-slate-800">{orderReceipt.orderId}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-400 font-sans">Transaction:</span>
//                   <span className="text-slate-800 truncate max-w-[150px] font-semibold">{orderReceipt.transactionId}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-400 font-sans">Payment Mode:</span>
//                   <span className="font-semibold text-slate-800 uppercase text-[9px]">{orderReceipt.paymentMethod}</span>
//                 </div>
//                 {orderReceipt.detailsSummary && (
//                   <div className="flex justify-between">
//                     <span className="text-slate-400 font-sans">Summary:</span>
//                     <span className="text-slate-800 text-right font-medium">{orderReceipt.detailsSummary}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between pt-1.5 border-t border-dashed border-slate-200 text-slate-800 font-bold">
//                   <span className="font-sans">Receipt Amount:</span>
//                   <span className="text-emerald-700 font-semibold text-[11px]">{formatPrice(finalTotal || itemsSubtotal)}</span>
//                 </div>
//               </div>
//             )}

//             <p className="font-sans text-xs text-slate-500 leading-normal mb-6">
//               Balanza is wrapping up your little explorer&apos;s cycle right now. A real-time GPS tracking link and payment verification has been processed under your profile dashboard!
//             </p>

//             <button
//               onClick={() => setCheckoutComplete(false)}
//               className="w-full rounded bg-zinc-950 py-3 text-center text-xs font-bold uppercase tracking-widest text-white hover:bg-black transition-all cursor-pointer"
//             >
//               Continue Exploring
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ----------------- RAZORPAY SANDBOX SIMULATION MODAL ----------------- */}
//       {showRazorpaySandbox && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs select-none p-4">
//           <div className="relative w-full max-w-sm overflow-hidden bg-[#1E2638] text-white rounded-3xl shadow-2xl border border-slate-700 p-6 animate-fade-in text-left font-sans">
//             {/* Header */}
//             <div className="flex items-[#1E2638] justify-between border-b border-sidebar-700/60 pb-3.5 mb-4 max-w-full">
//               <div className="flex items-center gap-2">
//                 <div className="h-7 w-7 rounded-xl bg-[#BFEC53] flex items-center justify-center font-bold text-slate-950 font-mono text-sm leading-none shrink-0 select-none">
//                   R
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-black tracking-widest text-[#BFEC53] uppercase font-mono leading-none">RAZORPAY SECURE</h3>
//                   <p className="text-[8px] tracking-wide text-amber-400 font-bold uppercase font-sans mt-0.5">Sandbox Test-Mode Simulation</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setShowRazorpaySandbox(false)}
//                 className="text-slate-400 hover:text-white text-[10px] font-extrabold uppercase tracking-widest cursor-pointer"
//               >
//                 ✕ Close
//               </button>
//             </div>

//             {/* Amount bar */}
//             <div className="bg-[#242F48] p-3.5 rounded-xl mb-4 border border-slate-700 flex justify-between items-center text-xs">
//               <div>
//                 <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Balanza Rides Secure Order</span>
//                 <span className="text-[10px] text-slate-350 font-medium font-mono">{razorpaySandboxOrderId}</span>
//               </div>
//               <span className="font-mono text-sm font-black text-[#BFEC53]">{formatPrice(razorpaySandboxAmount)}</span>
//             </div>

//             {/* Simulator info */}
//             <p className="text-[10px] text-[#A2AEBB] leading-relaxed mb-4">
//               Since no custom <span className="text-yellow-300 font-bold bg-[#141b29] px-1 py-0.5 rounded font-mono">RAZORPAY_KEY_ID</span> credentials are configured in your Secrets panel yet, this immersive sandbox simulates the entire official payload callback in real-time.
//             </p>

//             {/* Simulated options */}
//             <div className="space-y-3.5 mb-5">
//               <div className="flex flex-col gap-1">
//                 <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Simulated Buyer Details</span>
//                 <input 
//                   type="text" 
//                   disabled
//                   value={`${user?.displayName || user?.email || "Sanket Rider"} (${user?.email || "anonymous"})`} 
//                   className="bg-[#242F48] border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-300 pointer-events-none select-none overflow-hidden text-ellipsis"
//                 />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Auto-Selected Simulator Gate</span>
//                 <div className="bg-[#242F48] p-2 rounded-lg border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-[10px] font-bold">
//                   <span>🟢 Razorpay Test Server Connection</span>
//                   <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded-md">Verifying</span>
//                 </div>
//               </div>
//             </div>

//             {/* Simulator action buttons */}
//             <div className="space-y-1.5 pt-4 border-t border-slate-700/60 font-sans">
//               <button
//                 onClick={handleVerifyMockPay}
//                 disabled={isCheckingOut}
//                 className="w-full bg-[#10C37A] hover:bg-[#0EA868] text-slate-950 rounded-lg py-2.5 text-center text-xs font-black uppercase tracking-wider select-none shrink-0 cursor-pointer transition-all flex items-center justify-center gap-1.5"
//               >
//                 {isCheckingOut ? (
//                   <>
//                     <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
//                     VERIFYING CALLBACK...
//                   </>
//                 ) : (
//                   "✓ Authorize & Verify Callback"
//                 )}
//               </button>
              
//               <button
//                 onClick={() => {
//                   setCheckoutError("Razorpay Simulator Declined: Transaction cancelled by client gateway authorization request.");
//                   setShowRazorpaySandbox(false);
//                 }}
//                 disabled={isCheckingOut}
//                 className="w-full bg-slate-800 hover:bg-slate-700 text-[#ff7171] border border-slate-700 rounded-lg py-2 text-center text-[9px] font-black uppercase tracking-wider select-none shrink-0 cursor-pointer transition-all"
//               >
//                 ✕ Cancel / Simulate Failure
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </>
//   );
// }


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, Search, Sparkles, Check, CheckCircle, ChevronDown, Instagram, Facebook, Send, Twitter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BalanzaLogo from './BalanzaLogo';
import BalanzaBagIcon from './BalanzaBagIcon';

const CycleCircleIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <div className={`flex items-center justify-center rounded-full bg-[#1D3B28] sm:bg-[#1E293B] text-white ${className} shrink-0 shadow-xs`}>
    <svg viewBox="0 0 100 100" className="w-[62%] h-[62%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="65" r="13" stroke="currentColor" strokeWidth="6.5" />
      <circle cx="30" cy="65" r="4" fill="currentColor" />
      <circle cx="70" cy="65" r="13" stroke="currentColor" strokeWidth="6.5" />
      <circle cx="70" cy="65" r="4" fill="currentColor" />
      <path d="M70 65 L61 33 M61 33 L55 33 M61 33 L65 31" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 65 C40 45, 50 45, 61 44" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 51 L46 38 M40 38 L52 38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export default function DrawersAndModals() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartOpen,
    setCartOpen,
    isMenuOpen,
    setMenuOpen,
    isSearchOpen,
    setSearchOpen,
    selectedQuickView,
    setSelectedQuickView,
    searchQuery,
    setSearchQuery,
    addToCart,
    user,
    setAccountOpen,
    placeOrder,
    bikes,
    setActivePage
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [isLearnExpanded, setIsLearnExpanded] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Payment direct gateway states
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<'card' | 'upi' | 'netbanking' | 'razorpay'>('razorpay');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isUpiVerifying, setIsUpiVerifying] = useState(false);
  const [verifiedUpiName, setVerifiedUpiName] = useState('');
  const [orderReceipt, setOrderReceipt] = useState<any>(null);

  // State for active color index in Quick View Dialog
  const [quickViewColorIdx, setQuickViewColorIdx] = useState(0);

  React.useEffect(() => {
    setQuickViewColorIdx(0);
  }, [selectedQuickView]);

  // Razorpay dynamic payment handler & sandbox simulator state
  const [showRazorpaySandbox, setShowRazorpaySandbox] = useState(false);
  const [razorpaySandboxOrderId, setRazorpaySandboxOrderId] = useState('');
  const [razorpaySandboxAmount, setRazorpaySandboxAmount] = useState(0);

  // Helper loader for external Razorpay Checkout SDK script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Calculate prices
  const itemsSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(itemsSubtotal * (discountPercent / 100));
  const finalTotal = itemsSubtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'BALANZA10') {
      setDiscountPercent(10);
      setCouponMsg('BALANZA10 applied: 10% coupon active!');
    } else if (couponCode.toUpperCase() === 'FIRSTBIKE') {
      setDiscountPercent(15);
      setCouponMsg('FIRSTBIKE applied: 15% subscriber code active!');
    } else {
      setCouponMsg('Invalid coupon code. Try BALANZA10.');
    }
  };

  const handleStartCheckout = async () => {
    setCheckoutError('');
    if (!user) {
      setCheckoutError('Rider registration required before checkout!');
      setTimeout(() => {
        setCartOpen(false);
        setAccountOpen(true);
      }, 1000);
      return;
    }
    setShowPaymentGateway(true);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 16) raw = raw.substring(0, 16);
    const grouped = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(grouped);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 4) raw = raw.substring(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleVerifyUpi = () => {
    if (!upiId || !upiId.includes("@")) {
      setCheckoutError("Please enter a valid format UPI address first to verify.");
      return;
    }
    setCheckoutError('');
    setIsUpiVerifying(true);
    setVerifiedUpiName("");
    setTimeout(() => {
      setIsUpiVerifying(false);
      const handle = upiId.split("@")[0].toUpperCase();
      setVerifiedUpiName(`Verified: ${handle} RIDER`);
    }, 1200);
  };

  // Trigger real-time Razorpay Payment Checkout Flow
  const handleRazorpayPayment = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const contentType = response.headers.get("content-type");
      let resData: any = {};
      if (contentType && contentType.includes("application/json")) {
        resData = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `API server returned invalid content type. HTTP status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to initialize system payment pipeline');
      }

      const { id: rzpOrderId, amount, mock, keyId } = resData;

      if (mock) {
        // Run Sandbox simulator
        setRazorpaySandboxOrderId(rzpOrderId);
        setRazorpaySandboxAmount(amount / 100);
        setShowRazorpaySandbox(true);
        setIsCheckingOut(false);
      } else {
        // Run live official Razorpay gateway integration
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          console.warn('Razorpay SDK failed to load. Falling back gracefully to Sandbox Simulator mode for sandbox testing.');
          setRazorpaySandboxOrderId(rzpOrderId);
          setRazorpaySandboxAmount(amount / 100);
          setShowRazorpaySandbox(true);
          setIsCheckingOut(false);
          return;
        }

        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'Balanza Bikes',
          description: 'Premium Kid\'s Balance Bike Purchase',
          order_id: rzpOrderId,
          handler: async function (paymentRes: any) {
            setIsCheckingOut(true);
            try {
              const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentRes.razorpay_order_id,
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  razorpay_signature: paymentRes.razorpay_signature,
                  userId: user?.uid,
                  email: user?.email || '',
                  items: cart.map((item) => ({
                    id: item.id,
                    productName: item.product.name,
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.price,
                    selectedColor: {
                      name: item.selectedColor.name,
                      value: item.selectedColor.value,
                      imageUrl: item.selectedColor.imageUrl
                    }
                  })),
                  itemsSubtotal,
                  discountAmount,
                  finalTotal,
                  isMock: false
                }),
              });

              const verifyContentType = verifyResponse.headers.get("content-type");
              let verifyData: any = {};
              if (verifyContentType && verifyContentType.includes("application/json")) {
                verifyData = await verifyResponse.json();
              } else {
                const errorText = await verifyResponse.text();
                throw new Error(errorText || `Validation API returned invalid content type. HTTP status: ${verifyResponse.status}`);
              }

              if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Razorpay payment verification rejected');
              }

              // Direct client side sync fallback if server didn\'t save in DB
              if (verifyData.savedInDB === false && verifyData.orderPayload) {
                try {
                  const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
                  const { db } = await import('../lib/firebase');
                  const orderDocPayload = {
                    ...verifyData.orderPayload,
                    createdAt: serverTimestamp()
                  };
                  delete orderDocPayload.savedInDB;
                  await setDoc(doc(db, 'orders', verifyData.orderId), orderDocPayload);
                } catch (ce) {
                  console.warn('Client direct firestore sync failed:', ce);
                }
              }

              setOrderReceipt(verifyData);
              setIsCheckingOut(false);
              setShowPaymentGateway(false);
              setCheckoutComplete(true);
              clearCart();
            } catch (err: any) {
              setCheckoutError(err.message || 'Payment signature verification failed.');
              setIsCheckingOut(false);
            }
          },
          prefill: {
            name: user?.displayName || user?.email || '',
            email: user?.email || '',
          },
          theme: {
            color: '#BFEC53',
          },
          modal: {
            ondismiss: function () {
              setIsCheckingOut(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      console.error('[Razorpay payment activation failed]:', err);
      setCheckoutError(err.message || 'Could not launch Razorpay platform gateway.');
      setIsCheckingOut(false);
    }
  };

  // Verification pipeline for interactive sandbox testing
  const handleVerifyMockPay = async () => {
    setIsCheckingOut(true);
    setCheckoutError('');
    try {
      const mockPaymentId = `pay_mock_${Math.floor(100000 + Math.random() * 900000)}BLZ`;
      const verifyResponse = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: razorpaySandboxOrderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: 'sandbox_simulation_signature',
          userId: user?.uid,
          email: user?.email || '',
          items: cart.map((item) => ({
            id: item.id,
            productName: item.product.name,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
            selectedColor: {
              name: item.selectedColor.name,
              value: item.selectedColor.value,
              imageUrl: item.selectedColor.imageUrl
            }
          })),
          itemsSubtotal,
          discountAmount,
          finalTotal,
          isMock: true
        })
      });

      const sandboxVerifyContentType = verifyResponse.headers.get("content-type");
      let verifyData: any = {};
      if (sandboxVerifyContentType && sandboxVerifyContentType.includes("application/json")) {
        verifyData = await verifyResponse.json();
      } else {
        const errorText = await verifyResponse.text();
        throw new Error(errorText || `Mock validation API returned invalid content type. HTTP status: ${verifyResponse.status}`);
      }

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Mock simulation payment verification refused');
      }

      // Sync direct client side Firestore
      if (verifyData.savedInDB === false && verifyData.orderPayload) {
        try {
          const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const orderDocPayload = {
            ...verifyData.orderPayload,
            createdAt: serverTimestamp()
          };
          delete orderDocPayload.savedInDB;
          await setDoc(doc(db, 'orders', verifyData.orderId), orderDocPayload);
        } catch (ce) {
          console.warn('Client direct firestore mock sync failed:', ce);
        }
      }

      setOrderReceipt(verifyData);
      setIsCheckingOut(false);
      setShowRazorpaySandbox(false);
      setShowPaymentGateway(false);
      setCheckoutComplete(true);
      clearCart();
    } catch (err: any) {
      console.error('[Razorpay Sandbox verifier error]:', err);
      setCheckoutError(err.message || 'Mock razorpay validation error');
      setIsCheckingOut(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    setIsCheckingOut(true);

    if (activePaymentTab === 'razorpay') {
      await handleRazorpayPayment();
      return;
    }

    try {
      const serializedItems = cart.map((item) => ({
        id: item.id,
        productName: item.product.name,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
        selectedColor: {
          name: item.selectedColor.name,
          value: item.selectedColor.value,
          imageUrl: item.selectedColor.imageUrl
        }
      }));

      if (user?.isSimulated) {
        let mockSummary = "";
        const transId = `TXN-BLZ-${Math.floor(100000 + Math.random() * 900000)}`;
        if (activePaymentTab === 'card') {
          if (!cardholderName || cardholderName.trim().length < 3) {
            throw new Error("Invalid cardholder name. Enter at least 3 characters.");
          }
          const cleanNum = cardNumber.replace(/\s/g, "");
          if (!/^\d{13,19}$/.test(cleanNum)) {
            throw new Error("Invalid credit card number. Must be between 13 and 19 digits.");
          }
          if (!/^\d{3,4}$/.test(cardCvv)) {
            throw new Error("Invalid CVV code. Must be a 3 or 4-digit number.");
          }
          if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            throw new Error("Invalid expiry date. Must be in MM/YY format.");
          }
          mockSummary = `Visa Card ending in •••• ${cleanNum.slice(-4)}`;
        } else if (activePaymentTab === 'upi') {
          if (!upiId || !upiId.includes('@')) {
            throw new Error("Invalid UPI address format.");
          }
          mockSummary = `UPI Transfer via ${upiId.toLowerCase()}`;
        } else {
          if (!selectedBank) {
            throw new Error("Please select a bank for net banking checkout.");
          }
          mockSummary = `Netbanking Transfer from ${selectedBank}`;
        }

        const placementId = await placeOrder(itemsSubtotal, discountAmount, finalTotal, {
          paymentMethod: activePaymentTab,
          transactionId: transId,
          detailsSummary: mockSummary
        });

        setOrderReceipt({
          orderId: placementId,
          transactionId: transId,
          paymentMethod: activePaymentTab,
          detailsSummary: mockSummary
        });

        setIsCheckingOut(false);
        setShowPaymentGateway(false);
        setCheckoutComplete(true);
        clearCart();
        return;
      }

      // Live full-stack secure backend payment POST request
      const response = await fetch('/api/checkout/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user?.email || '',
          items: serializedItems,
          itemsSubtotal,
          discountAmount,
          finalTotal,
          paymentMethod: activePaymentTab,
          cardDetails: activePaymentTab === 'card' ? {
            cardholderName,
            cardNumber,
            expiry: cardExpiry,
            cvv: cardCvv
          } : undefined,
          upiDetails: activePaymentTab === 'upi' ? {
            upiId
          } : undefined,
          netbankingDetails: activePaymentTab === 'netbanking' ? {
            bankName: selectedBank
          } : undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Secure billing process failure.");
      }

      // Safe Client-side sync if Direct Server-admin Firestore write failed
      if (data.savedInDB === false && data.orderPayload) {
        try {
          const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          
          const orderDocPayload = {
            ...data.orderPayload,
            createdAt: serverTimestamp() // convert to client serverTimestamp for rules schema match
          };
          delete orderDocPayload.savedInDB;
          
          await setDoc(doc(db, 'orders', data.orderId), orderDocPayload);
          console.log("[Client] Successfully synchronized payment verified order to Firestore from client-side!");
        } catch (clientWriteErr) {
          console.warn("[Client] Direct client-side write of payment receipt failed:", clientWriteErr);
          // Standard custom local storage fallback cache
          const savedLocalOrders = localStorage.getItem(`balanza_local_orders_${user.uid}`);
          let localList = [];
          if (savedLocalOrders) {
            try { localList = JSON.parse(savedLocalOrders); } catch (e) {}
          }
          localList.unshift({
            ...data.orderPayload,
            createdAt: { seconds: Math.floor(Date.now() / 1000) }
          });
          localStorage.setItem(`balanza_local_orders_${user.uid}`, JSON.stringify(localList));
        }
      }

      setOrderReceipt(data);
      setIsCheckingOut(false);
      setShowPaymentGateway(false);
      setCheckoutComplete(true);
      clearCart();

    } catch (err: any) {
      console.error("[Checkout Payment Exception]:", err);
      setCheckoutError(err.message || "Failed to finalize billing. Check inputs.");
      setIsCheckingOut(false);
    }
  };

  const handleMenuLinkClick = (selectorId: string) => {
    setMenuOpen(false);
    setActivePage('home');
    setTimeout(() => {
      const element = document.getElementById(selectorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  // Searching filter logic
  const filteredBikes = searchQuery.trim() === ''
    ? []
    : bikes.filter(bike =>
        bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bike.description && bike.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {/* ----------------- 1. LEFT MENU DRAWER ----------------- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex select-none">
          <div 
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative flex w-full max-w-[325px] flex-col bg-white shadow-2xl animate-slide-right text-left justify-between h-full">
            
            {/* Top Logo and Close Circle with Neon Green background */}
            <div className="bg-[#A7E22E] px-7 py-6 flex items-center justify-between border-b border-slate-950/10">
              <div className="flex items-center gap-3">
                <BalanzaLogo className="h-11 md:h-13 w-auto text-slate-950" />
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/5 text-slate-900 hover:text-black hover:bg-slate-950/10 hover:scale-105 transition-all cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-7 flex-1 flex flex-col justify-between overflow-y-auto">
              {/* Navigation Links matched perfectly to screenshot */}
              <div>
                <nav className="flex flex-col space-y-6">
                  
                  {/* Our Bikes Option */}
                  <button 
                    onClick={() => handleMenuLinkClick('our-bikes')} 
                    className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
                  >
                    Our Bikes
                  </button>

                  {/* Learn option (Dropdown) */}
                  <div className="flex flex-col">
                    <button 
                      onClick={() => setIsLearnExpanded(!isLearnExpanded)}
                      className="flex items-center justify-between text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
                    >
                      <span>Learn</span>
                      <ChevronDown className={`h-4.5 w-4.5 text-slate-405 transition-transform duration-300 ${isLearnExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isLearnExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pl-4 flex flex-col space-y-4 border-l-2 border-slate-100">
                            <button 
                              onClick={() => handleMenuLinkClick('why-balance-bikes')} 
                              className="text-left font-display text-[13px] font-bold text-slate-550 hover:text-[#A7E22E] hover:translate-x-0.5 transition-all cursor-pointer"
                            >
                              Why Balance Bikes
                            </button>
                            <button 
                              onClick={() => {
                                setMenuOpen(false);
                                setActivePage('assembly');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }} 
                              className="text-left font-display text-[13px] font-bold text-slate-550 hover:text-[#A7E22E] hover:translate-x-0.5 transition-all cursor-pointer"
                            >
                              Assembly Instructions
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Our Story Option */}
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      setActivePage('story');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
                  >
                    Our Story
                  </button>

                  {/* Blogs Option */}
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      setActivePage('blogs');
                    }} 
                    className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
                  >
                    Blogs
                  </button>

                  {/* Contact Option */}
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      setActivePage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="text-left font-display text-[15px] font-black tracking-wide text-slate-900 hover:text-[#A7E22E] transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>

                </nav>
              </div>

              {/* Bottom Section: Grey Social circles matching screenshot */}
              <div className="flex items-center gap-3.5 pt-6 border-t border-slate-50 mt-8">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.facebook.com/share/1EDyePAqdc/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://x.com/Balanzabikes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
                  title="Twitter / X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://telegram.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-full bg-slate-100 hover:bg-[#BFEC53] text-slate-700 hover:text-[#111] flex items-center justify-center transition-all cursor-pointer"
                  title="Telegram"
                >
                  <Send className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- 2. RIGHT CART DRAWER ----------------- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          <div 
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
          />
          
          <div className="relative flex w-full max-w-md flex-col bg-white p-6 shadow-2xl animate-slide-left text-left h-full">
            {showPaymentGateway ? (
              /* SECURE DIRECT Directdirect direct Direct directe Direct-direct Checkout direct Payment Gateway Sub-state Layout */
              <div className="flex flex-col h-full justify-between animate-fade-in font-sans">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-5">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <span className="text-sm">🔒</span>
                      <h3 className="font-display text-xs font-black uppercase tracking-widest text-[#1D3B28]">
                        Balanza Direct Gateway
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowPaymentGateway(false); setCheckoutError(''); }}
                      className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 hover:text-black hover:underline cursor-pointer font-sans"
                    >
                      &larr; Back to Bag
                    </button>
                  </div>

                  {/* Summary row */}
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-xl p-3 mb-5 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Direct Pay Amount</span>
                      <p className="text-[10px] text-slate-500 font-sans">{cart.length} items with free shipping</p>
                    </div>
                    <span className="font-mono text-base font-extrabold text-[#5F6D50]">{formatPrice(finalTotal)}</span>
                  </div>

                  {/* Payment Tabs Selection */}
                  <div className="grid grid-cols-1 gap-1 bg-slate-100 p-1 rounded-xl mb-5 font-sans">
                    {(['razorpay'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => { setActivePaymentTab(tab); setCheckoutError(''); }}
                        className={`py-2 text-[8px] font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer ${
                          activePaymentTab === tab
                            ? 'bg-white text-slate-900 shadow-3xs'
                            : 'text-slate-550 hover:text-slate-800'
                        }`}
                      >
                        {tab === 'razorpay' ? '⚡ Razor' : tab === 'card' ? '💳 Card' : tab === 'upi' ? '📱 UPI' : '🏦 Bank'}
                      </button>
                    ))}
                  </div>

                  {/* Checkout Tab Inputs Form Container */}
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    {activePaymentTab === 'razorpay' && (
                      <div className="space-y-3.5 animate-fade-in font-sans p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-2xl text-left">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8.5 w-8.5 rounded-full bg-slate-950 flex items-center justify-center font-bold text-[#BFEC53] select-none text-[12px] font-mono shrink-0">
                            R
                          </div>
                          <div>
                            <span className="text-[8px] font-black uppercase text-emerald-800 tracking-wider block">Official Payment Gateway</span>
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight font-display">Razorpay Real-time Pay</h4>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal font-sans">
                          Pay instantly using the secure Razorpay unified layout. Clicking below will open the payment panel allowing Credit/Debit cards, UPI handles, QR codes, or bank details.
                        </p>
                        <div className="border-t border-emerald-100/60 pt-3 flex items-center gap-2 text-[10px] text-emerald-800 font-medium">
                          <span>🛡️</span>
                          <span>Fully verified secure transactions.</span>
                        </div>
                      </div>
                    )}

                    {activePaymentTab === 'card' && (
                      <div className="space-y-3.5 animate-fade-in font-sans">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            required
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="e.g. SANKET GUPTA"
                            className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                            Card Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="4111 2222 3333 4444"
                              className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-mono font-bold tracking-wider focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold uppercase select-none tracking-widest font-sans">
                              {cardNumber.startsWith('5') ? 'MC' : cardNumber.startsWith('3') ? 'AMEX' : 'VISA'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-mono font-bold tracking-wider text-center focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-405 font-sans">
                              CVV / CVC
                            </label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-mono font-bold tracking-widest text-center focus:ring-1 focus:ring-slate-950 focus:outline-none focus:border-slate-800 placeholder-slate-350"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activePaymentTab === 'upi' && (
                      <div className="space-y-4 animate-fade-in font-sans">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                            Unified Payments Interface Address (VPA)
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              required
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                setVerifiedUpiName("");
                              }}
                              placeholder="e.g. sgupta@okaxis"
                              className="flex-1 px-3 py-2 border border-slate-205 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800 placeholder-slate-350 font-mono"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyUpi}
                              disabled={isUpiVerifying}
                              className="bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider select-none shrink-0 transition-all cursor-pointer font-sans"
                            >
                              {isUpiVerifying ? 'Wait...' : 'Verify ID'}
                            </button>
                          </div>
                          {verifiedUpiName ? (
                            <p className="text-[9px] font-black text-emerald-600 flex items-center gap-1 mt-1 font-sans">
                              <span>✓</span> {verifiedUpiName}
                            </p>
                          ) : (
                            <p className="text-[9px] text-slate-400 leading-normal font-sans">
                              Payments clear securely in real-time from your UPI application (GPay, PhonePe, Paytm).
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {activePaymentTab === 'netbanking' && (
                      <div className="space-y-4 animate-fade-in font-sans">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">
                            Select Popular Bank Asset
                          </label>
                          <select
                            required
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-205 bg-white rounded-lg text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-none focus:border-slate-800"
                          >
                            <option value="">-- Click to choose bank --</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="State Bank of India">State Bank of India</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                          </select>
                          <p className="text-[9px] text-slate-400 leading-normal font-sans mt-1">
                            You will be redirected securely to your bank dashboard to authorize the credit receipt.
                          </p>
                        </div>
                      </div>
                    )}

                    {checkoutError && (
                      <p className="text-[10px] font-bold text-rose-500 text-center animate-pulse pt-2 leading-relaxed">
                        {checkoutError}
                      </p>
                    )}

                    {/* Pay trigger Button */}
                    <div className="pt-4 border-t border-slate-150 mt-5">
                      <button
                        type="submit"
                        disabled={isCheckingOut || (activePaymentTab === 'upi' && upiId && !verifiedUpiName)}
                        className={`w-full rounded py-4 text-center text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                          isCheckingOut || (activePaymentTab === 'upi' && upiId && !verifiedUpiName)
                            ? 'bg-zinc-900 text-white'
                            : 'bg-[#BFEC53] text-[#111] hover:bg-[#a9d146]'
                        } ${
                          activePaymentTab === 'upi' && upiId && !verifiedUpiName ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                      >
                        {isCheckingOut ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            AUTHORIZING FUND TRANSFER...
                          </>
                        ) : (
                          `Pay ${formatPrice(finalTotal)} Securely`
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Secure certificate and logos footer */}
                <div className="text-center pt-5 select-none font-sans">
                  <div className="flex justify-center items-center gap-1 text-slate-400 mb-1">
                    <span className="text-[10px]">🛡️</span>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-sans">
                      Secure SSL Checkout
                    </p>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-relaxed font-sans font-medium">
                    Fully PCI DSS Level 1 Accredited. Balanza protects your payment details using top-tier encryption algorithms.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-850">
                      Shopping Cart
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {cart.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                      <button 
                        onClick={clearCart}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Clear All Cart"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-505 hover:bg-slate-100 cursor-pointer"
                      title="Close Cart"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Cart body */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full py-12 px-6">
                      <BalanzaBagIcon className="w-36 h-36 md:w-44 md:h-44 mb-6 drop-shadow-sm" />
                      <h4 className="font-display text-sm md:text-base font-black uppercase tracking-widest text-slate-900 mb-6 max-w-[280px] leading-snug">
                        YOUR CART IS WAITING FOR ADVENTURE.
                      </h4>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          const el = document.getElementById('our-bikes');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="rounded bg-zinc-900 px-8 py-4 text-xs md:text-sm font-black uppercase tracking-widest text-white hover:bg-black transition-all cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md duration-200"
                      >
                        START SHOPPING
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div 
                          key={item.id}
                          className="flex gap-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100"
                        >
                          <div className="aspect-square w-16 md:w-20 rounded-lg bg-white p-1.5 flex items-center justify-center border border-slate-100">
                            <img
                              src={item.selectedColor.imageUrl}
                              alt={item.product.name}
                              className="max-h-full object-contain"
                            />
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between text-xs">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="font-display font-bold text-slate-850 truncate max-w-[180px]">
                                  {item.product.name}
                                </h4>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-slate-400 hover:text-rose-500 cursor-pointer pl-2"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-1.5 mt-1">
                                <span 
                                  className="h-2.5 w-2.5 rounded-full" 
                                  style={{ backgroundColor: item.selectedColor.value }} 
                                />
                                <span className="text-[10px] text-slate-500 font-medium font-sans">
                                  {item.selectedColor.name} • {item.product.ageYears}
                                </span>
                              </div>
                            </div>

                            {/* Quantity controls & dynamic subtotal */}
                            <div className="flex items-center justify-between mt-2.5 border-t border-slate-100/80 pt-2">
                              <div className="flex items-center border border-slate-200 bg-white rounded">
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-1 text-slate-500 hover:bg-slate-50 cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2.5 font-mono font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-slate-505 hover:bg-slate-50 cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="font-mono font-extrabold text-[#5F6D50]">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart footer totals */}
                {cart.length > 0 && (
                  <div className="border-t border-gray-150 pt-5 mt-4 space-y-4">
                    
                    {/* Subtotals */}
                    <div className="space-y-2 text-xs text-slate-500 border-b border-gray-100 pb-3 font-medium font-sans">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatPrice(itemsSubtotal)}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount ({discountPercent}%)</span>
                          <span className="font-mono">-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-emerald-600 font-bold uppercase">FREE</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-display text-sm font-bold uppercase tracking-widest text-slate-800">Total</span>
                      <span className="font-mono text-xl font-extrabold text-[#5F6D50]">{formatPrice(finalTotal)}</span>
                    </div>

                    {checkoutError && (
                      <p className="text-[11px] font-bold text-rose-500 text-center animate-pulse">
                        {checkoutError}
                      </p>
                    )}

                    <button
                      onClick={handleStartCheckout}
                      disabled={isCheckingOut}
                      className="w-full rounded bg-zinc-900 text-white hover:bg-[#BFEC53] hover:text-[#111] py-4 text-center text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:bg-zinc-900 disabled:text-white"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          PROCESSING SECURE HARNESS...
                        </>
                      ) : (
                        'PROCEED TO SECURE CHECKOUT'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ----------------- 3. FULL SCREEN SEARCH OVERLAY ----------------- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-55 flex flex-col justify-start items-center p-6 select-none md:p-12 animate-fade-in overflow-y-auto">
          
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            className="fixed top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white hover:scale-105 transition-all cursor-pointer border border-slate-800 z-50"
            title="Close Search"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="max-w-2xl w-full flex flex-col items-center mt-16 md:mt-24">
            <span className="text-[10px] font-bold tracking-widest text-[#BFEC53] uppercase mb-3">
              Explore the Balanza Fleet
            </span>
            
            {/* Real responsive Input field */}
            <div className="relative w-full border-b-2 border-slate-800 focus-within:border-[#BFEC53] transition-colors pb-2">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our collection... (e.g., explorer, black, pink)"
                className="w-full bg-transparent pl-9 pr-4 text-xl md:text-2xl text-white focus:outline-none placeholder-slate-500 font-display font-medium"
              />
            </div>

            {/* Quick Suggestions tags */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Try searching:</span>
              {['Explorer', 'Mini Rider', 'Neo Series', 'Olive', 'Black'].map((suggest) => (
                <button
                  key={suggest}
                  onClick={() => setSearchQuery(suggest)}
                  className="rounded-full border border-slate-800 px-3 py-1 text-[10px] text-slate-300 hover:border-[#BFEC53] hover:text-white transition-all cursor-pointer"
                >
                  {suggest}
                </button>
              ))}
            </div>

            {/* Simulated Live Filtering queries */}
            <div className="w-full mt-10 overflow-y-auto max-h-[50vh] pr-2">
              {filteredBikes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBikes.map(bike => (
                    <div 
                      key={bike.id}
                      className="bg-zinc-900 rounded-xl p-4 flex gap-4 border border-slate-800/80 hover:border-slate-700 hover:scale-[1.01] transition-all text-left"
                    >
                      <div className="aspect-square w-16 bg-white rounded p-1.5 flex items-center justify-center border border-slate-800 flex-shrink-0">
                        <img
                          src={bike.colors[0].imageUrl}
                          alt={bike.name}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div className="text-xs">
                        <h4 className="font-display font-bold text-white uppercase tracking-wider">{bike.name}</h4>
                        <p className="text-[#BFEC53] font-bold font-mono mt-0.5">{formatPrice(bike.basePrice)}</p>
                        <p className="text-slate-400 mt-1 line-clamp-1 truncate font-sans">{bike.description}</p>
                        
                        <div className="flex gap-2.5 mt-3">
                          <button
                            onClick={() => {
                              addToCart(bike, bike.colors[0]);
                              setSearchOpen(false);
                            }}
                            className="bg-white text-black px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            Buy Original
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQuickView(bike);
                              setSearchOpen(false);
                            }}
                            className="text-[#BFEC53] hover:underline text-[9px] font-bold uppercase tracking-widest"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() !== '' ? (
                <div className="text-center text-slate-500 py-10">
                  <p className="text-xs">We couldn&apos;t find any balance models matching &ldquo;{searchQuery}&rdquo;.</p>
                  <p className="text-[10px] hover:underline text-slate-400 mt-1 cursor-pointer" onClick={() => setSearchQuery('')}>Clear Query</p>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      )}

      {/* ----------------- 4. PRODUCT QUICK VIEW DIALOG ----------------- */}
      {selectedQuickView && (
        <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-55 flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl overflow-y-auto max-h-[95vh] max-w-2xl w-full border border-slate-100 shadow-2xl relative animate-scale-up text-left">
            <button
              onClick={() => setSelectedQuickView(null)}
              className="absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer shadow-sm active:scale-90"
              title="Close View"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Left image holder block */}
              <div className="bg-slate-50/70 p-6 flex flex-col items-center justify-center min-h-[280px]">
                <img
                  src={selectedQuickView.colors[quickViewColorIdx]?.imageUrl || selectedQuickView.colors[0]?.imageUrl}
                  alt={`${selectedQuickView.name} - ${selectedQuickView.colors[quickViewColorIdx]?.name || ''}`}
                  className="max-h-[220px] object-contain transition-transform duration-300"
                />
                
                <div className="flex items-center gap-1.5 mt-4 bg-white/80 border border-slate-100 rounded-full px-4 py-1.5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 block animate-pulse"></span>
                  <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                    In Stock • Ready to Ship
                  </span>
                </div>
              </div>

              {/* Right text layout */}
              <div className="p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-55/70 px-2 py-0.5 rounded uppercase inline-block mb-2">
                    {selectedQuickView.ageYears}
                  </span>
                  
                  <h3 className="font-display text-xl md:text-2xl font-black text-slate-950 uppercase tracking-wide leading-tight">
                    {selectedQuickView.name}
                  </h3>
                  
                  <p className="text-xl font-extrabold tracking-tight mt-1.5 mb-4" style={{ color: '#111' }}>
                    {formatPrice(selectedQuickView.basePrice)}
                  </p>
                  
                  <p className="font-sans text-xs text-slate-500 leading-relaxed mb-5">
                    {selectedQuickView.description}
                  </p>

                  {/* Attributes details list */}
                  <div className="space-y-2 mb-5 font-sans text-[11px] text-slate-600 font-medium">
                    <div className="flex border-b border-slate-100 pb-1.5">
                      <span className="w-28 text-slate-400 font-semibold">Net Weight</span>
                      <span className="text-slate-800">1.9 Kg</span>
                    </div>
                    <div className="flex border-b border-slate-100 pb-1.5">
                      <span className="w-28 text-slate-400 font-semibold">Frame</span>
                      <span className="text-slate-800">Carbon Steel</span>
                    </div>
                    <div className="flex border-b border-slate-100 pb-1.5">
                      <span className="w-28 text-slate-400 font-semibold">Wheels</span>
                      <span className="text-slate-800">Anti Skid Wheels</span>
                    </div>
                    <div className="flex border-b border-slate-100 pb-1.5">
                      <span className="w-28 text-slate-400 font-semibold">Other Features</span>
                      <div className="flex flex-col gap-0.5 text-slate-800 font-medium">
                        <span>Non-slip handlebar</span>
                        <span>Soft Cushioned Seat</span>
                        <span>135° Steering Limit</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center">
                        <span className="w-28 text-slate-400 font-semibold">Select Color:</span>
                        <span className="text-slate-900 font-bold capitalize text-xs bg-slate-100 px-2 py-0.5 rounded">
                          {selectedQuickView.colors[quickViewColorIdx]?.name || ''}
                        </span>
                      </div>
                      <div className="flex gap-2.5 flex-wrap pl-0 mt-1">
                        {selectedQuickView.colors.map((c, idx) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setQuickViewColorIdx(idx)}
                            className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                              quickViewColorIdx === idx 
                                ? 'border-slate-900 scale-110 shadow-md ring-2 ring-slate-950/20' 
                                : 'border-slate-200 hover:border-slate-400 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          >
                            {quickViewColorIdx === idx && (
                              <span className="h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  {/* "Buy Now" Neon Green Button */}
                  <button
                    onClick={() => {
                      const color = selectedQuickView.colors[quickViewColorIdx] || selectedQuickView.colors[0];
                      addToCart(selectedQuickView, color);
                      setSelectedQuickView(null);
                      setCartOpen(true);
                    }}
                    className="w-full text-center rounded-xl bg-[#A7E22E] hover:bg-[#99cf28] text-slate-950 py-3.5 text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
                  >
                    Buy Now
                  </button>

                  {/* "Add to Cart" Black Button */}
                  <button
                    onClick={() => {
                      const color = selectedQuickView.colors[quickViewColorIdx] || selectedQuickView.colors[0];
                      addToCart(selectedQuickView, color);
                      setSelectedQuickView(null);
                    }}
                    className="w-full text-center rounded-xl bg-zinc-900 hover:bg-black text-white py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer active:scale-98"
                  >
                    Add to Cart
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ----------------- 5. CHECKOUT COMPLETION SUCCESS MODAL ----------------- */}
      {checkoutComplete && (
        <div className="fixed inset-0 bg-slate-950/80 z-60 flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 animate-scale-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-5 relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
              <CheckCircle className="h-9 w-9" />
            </div>

            <span className="text-[10px] font-bold tracking-widest text-[#B4D33C] uppercase block mb-1">
              Thank You Explorer
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-3 uppercase tracking-wider">
              Order Placed Successfully!
            </h3>
            
            {orderReceipt && (
              <div className="my-5 p-4 bg-slate-50 border border-slate-150 rounded-xl text-left space-y-2 font-mono text-[10px] text-slate-750">
                <p className="font-sans font-bold text-slate-500 uppercase tracking-wider text-[9px] mb-2 text-center pb-1.5 border-b border-slate-200">
                  Transaction Receipt
                </p>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Order ID:</span>
                  <span className="font-bold text-slate-800">{orderReceipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Transaction:</span>
                  <span className="text-slate-800 truncate max-w-[150px] font-semibold">{orderReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Payment Mode:</span>
                  <span className="font-semibold text-slate-800 uppercase text-[9px]">{orderReceipt.paymentMethod}</span>
                </div>
                {orderReceipt.detailsSummary && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Summary:</span>
                    <span className="text-slate-800 text-right font-medium">{orderReceipt.detailsSummary}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-dashed border-slate-200 text-slate-800 font-bold">
                  <span className="font-sans">Receipt Amount:</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">{formatPrice(finalTotal || itemsSubtotal)}</span>
                </div>
              </div>
            )}

            <p className="font-sans text-xs text-slate-500 leading-normal mb-6">
              Balanza is wrapping up your little explorer&apos;s cycle right now. A real-time GPS tracking link and payment verification has been processed under your profile dashboard!
            </p>

            <button
              onClick={() => setCheckoutComplete(false)}
              className="w-full rounded bg-zinc-950 py-3 text-center text-xs font-bold uppercase tracking-widest text-white hover:bg-black transition-all cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* ----------------- RAZORPAY SANDBOX SIMULATION MODAL ----------------- */}
      {showRazorpaySandbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs select-none p-4">
          <div className="relative w-full max-w-sm overflow-hidden bg-[#1E2638] text-white rounded-3xl shadow-2xl border border-slate-700 p-6 animate-fade-in text-left font-sans">
            {/* Header */}
            <div className="flex items-[#1E2638] justify-between border-b border-sidebar-700/60 pb-3.5 mb-4 max-w-full">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-[#BFEC53] flex items-center justify-center font-bold text-slate-950 font-mono text-sm leading-none shrink-0 select-none">
                  R
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-widest text-[#BFEC53] uppercase font-mono leading-none">RAZORPAY SECURE</h3>
                  <p className="text-[8px] tracking-wide text-amber-400 font-bold uppercase font-sans mt-0.5">Sandbox Test-Mode Simulation</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRazorpaySandbox(false)}
                className="text-slate-400 hover:text-white text-[10px] font-extrabold uppercase tracking-widest cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Amount bar */}
            <div className="bg-[#242F48] p-3.5 rounded-xl mb-4 border border-slate-700 flex justify-between items-center text-xs">
              <div>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Balanza Rides Secure Order</span>
                <span className="text-[10px] text-slate-350 font-medium font-mono">{razorpaySandboxOrderId}</span>
              </div>
              <span className="font-mono text-sm font-black text-[#BFEC53]">{formatPrice(razorpaySandboxAmount)}</span>
            </div>

            {/* Simulator info */}
            <p className="text-[10px] text-[#A2AEBB] leading-relaxed mb-4">
              Since no custom <span className="text-yellow-300 font-bold bg-[#141b29] px-1 py-0.5 rounded font-mono">RAZORPAY_KEY_ID</span> credentials are configured in your Secrets panel yet, this immersive sandbox simulates the entire official payload callback in real-time.
            </p>

            {/* Simulated options */}
            <div className="space-y-3.5 mb-5">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Simulated Buyer Details</span>
                <input 
                  type="text" 
                  disabled
                  value={`${user?.displayName || user?.email || "Sanket Rider"} (${user?.email || "anonymous"})`} 
                  className="bg-[#242F48] border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-300 pointer-events-none select-none overflow-hidden text-ellipsis"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Auto-Selected Simulator Gate</span>
                <div className="bg-[#242F48] p-2 rounded-lg border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-[10px] font-bold">
                  <span>🟢 Razorpay Test Server Connection</span>
                  <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded-md">Verifying</span>
                </div>
              </div>
            </div>

            {/* Simulator action buttons */}
            <div className="space-y-1.5 pt-4 border-t border-slate-700/60 font-sans">
              <button
                onClick={handleVerifyMockPay}
                disabled={isCheckingOut}
                className="w-full bg-[#10C37A] hover:bg-[#0EA868] text-slate-950 rounded-lg py-2.5 text-center text-xs font-black uppercase tracking-wider select-none shrink-0 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                {isCheckingOut ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    VERIFYING CALLBACK...
                  </>
                ) : (
                  "✓ Authorize & Verify Callback"
                )}
              </button>
              
              <button
                onClick={() => {
                  setCheckoutError("Razorpay Simulator Declined: Transaction cancelled by client gateway authorization request.");
                  setShowRazorpaySandbox(false);
                }}
                disabled={isCheckingOut}
                className="w-full bg-slate-800 hover:bg-slate-700 text-[#ff7171] border border-slate-700 rounded-lg py-2 text-center text-[9px] font-black uppercase tracking-wider select-none shrink-0 cursor-pointer transition-all"
              >
                ✕ Cancel / Simulate Failure
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
