import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Clock, Send, ShieldCheck, ChevronDown, CheckCircle, HelpCircle, FileText, Globe, Store, Award, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ContactPage() {
  const { setActivePage } = useApp();

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Dealer Form States
  const [dealerBusinessName, setDealerBusinessName] = useState('');
  const [dealerContactPerson, setDealerContactPerson] = useState('');
  const [dealerEmail, setDealerEmail] = useState('');
  const [dealerPhone, setDealerPhone] = useState('');
  const [dealerCity, setDealerCity] = useState('');
  const [dealerState, setDealerState] = useState('');
  const [dealerWebsite, setDealerWebsite] = useState('');
  const [dealerBusinessType, setDealerBusinessType] = useState('');
  const [dealerYears, setDealerYears] = useState('');
  const [dealerStores, setDealerStores] = useState('');
  const [dealerAbout, setDealerAbout] = useState('');

  // Submit Feedback Toast/overlay states
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [showDealerSuccess, setShowDealerSuccess] = useState(false);
  const [contactErrorMessage, setContactErrorMessage] = useState('');
  const [dealerErrorMessage, setDealerErrorMessage] = useState('');
  const [contactSuccessText, setContactSuccessText] = useState('');
  const [dealerSuccessText, setDealerSuccessText] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingDealer, setIsSubmittingDealer] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactErrorMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject || 'Product Details',
          message: contactMessage,
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setContactSuccessText(result.message || "Thank you! Our support department will reach back shortly.");
        setShowContactSuccess(true);
        // Reset Form Fields
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactErrorMessage(result.error || "Failed to submit form. Please check required fields.");
        setTimeout(() => setContactErrorMessage(''), 5000);
      }
    } catch (err) {
      console.warn("Inquiry fetch failed:", err);
      setContactErrorMessage("An error occurred during submission. Firestore local connection failed.");
      setTimeout(() => setContactErrorMessage(''), 5000);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleDealerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDealer(true);
    setDealerErrorMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'dealer',
          businessName: dealerBusinessName,
          contactPerson: dealerContactPerson,
          email: dealerEmail,
          phone: dealerPhone,
          city: dealerCity,
          state: dealerState,
          website: dealerWebsite,
          businessType: dealerBusinessType || 'Retail Store',
          yearsInBusiness: dealerYears,
          storesCount: dealerStores,
          about: dealerAbout,
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setDealerSuccessText(result.message || "Thank you! Our wholesale team has received your application.");
        setShowDealerSuccess(true);
        // Reset Form Fields
        setDealerBusinessName('');
        setDealerContactPerson('');
        setDealerEmail('');
        setDealerPhone('');
        setDealerCity('');
        setDealerState('');
        setDealerWebsite('');
        setDealerBusinessType('');
        setDealerYears('');
        setDealerStores('');
        setDealerAbout('');
      } else {
        setDealerErrorMessage(result.error || "Failed to submit wholesale inquiry. Please verify all fields.");
        setTimeout(() => setDealerErrorMessage(''), 5000);
      }
    } catch (err) {
      console.warn("Dealer inquiry fetch failed:", err);
      setDealerErrorMessage("Network connectivity issue. Failed to register wholesale application.");
      setTimeout(() => setDealerErrorMessage(''), 5000);
    } finally {
      setIsSubmittingDealer(false);
    }
  };

  // List of standard Indian/Universal States for aesthetic Selection
  const STATES_LIST = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  const BUSINESS_TYPES = [
    'Retail Store', 'Online Store', 'Toy & Gift Boutique', 'Bicycle Dealership', 'Distributor', 'Other'
  ];

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] font-sans pb-16 select-none animate-fade-in">
      
      {/* SUCCESS & ERROR OVERLAY TOASTS */}
      <AnimatePresence>
        {showContactSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md w-[90%] border border-slate-800"
          >
            <div className="bg-[#BFEC53] text-slate-950 p-1.5 rounded-full shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xs font-black tracking-wider uppercase text-[#BFEC53]">Message logged</p>
              <p className="font-sans text-[11px] text-slate-300 mt-0.5">{contactSuccessText || "Thank you! Our support department will reach back shortly."}</p>
            </div>
          </motion.div>
        )}

        {contactErrorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-rose-950 text-rose-100 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md w-[90%] border border-rose-800"
          >
            <div className="bg-rose-500 text-white p-1.5 rounded-full shrink-0">
              <span className="text-xs font-bold font-sans">⚠️</span>
            </div>
            <div>
              <p className="font-display text-xs font-black tracking-wider uppercase text-rose-400">Submission Error</p>
              <p className="font-sans text-[11px] text-rose-200 mt-0.5">{contactErrorMessage}</p>
            </div>
          </motion.div>
        )}

        {showDealerSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md w-[90%] border border-[#BFEC53]/20 animate-slide-up"
          >
            <div className="bg-[#BFEC53] text-slate-950 p-1.5 rounded-full shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xs font-black tracking-wider uppercase text-[#BFEC53]">Application logged</p>
              <p className="font-sans text-[11px] text-slate-200 mt-0.5">{dealerSuccessText || "We have received your wholesale application."}</p>
            </div>
          </motion.div>
        )}

        {dealerErrorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-rose-950 text-rose-100 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md w-[90%] border border-rose-800"
          >
            <div className="bg-rose-500 text-white p-1.5 rounded-full shrink-0">
              <span className="text-xs font-bold font-sans">⚠️</span>
            </div>
            <div>
              <p className="font-display text-xs font-black tracking-wider uppercase text-rose-400">Application Error</p>
              <p className="font-sans text-[11px] text-rose-200 mt-0.5">{dealerErrorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION WITH EXACT BG STYLE FROM PHOTO */}
      <div className="bg-[#AEE426] text-slate-950 pt-16 pb-20 relative overflow-hidden px-4 md:px-8">
        {/* Soft geometric styling vector contours */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-5xl relative z-10 text-left">
          
          {/* Breadcrumb back navigation */}
          <button 
            onClick={() => setActivePage('home')}
            className="group flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-950/70 hover:text-slate-950 transition-all mb-6 bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1.5 rounded-full border border-slate-950/5 cursor-pointer"
          >
            &larr; Back to shop
          </button>

          <h1 className="font-display text-4xl sm:text-5xl md:text-5.5xl font-black text-slate-950 tracking-tight uppercase leading-[0.95]">
            CONTACT US
          </h1>
          <p className="font-sans text-base sm:text-lg font-extrabold text-slate-950 mt-2">
            We&apos;d love to hear from you!
          </p>
          <p className="font-sans text-xs sm:text-sm text-slate-950/80 font-semibold max-w-xl mt-1 leading-relaxed">
            Whether you have a question, need support, or want to partner with us, our team is here to help.
          </p>

          {/* CONTACT DETAIL ELEMENTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* EMAIL */}
            <a 
              href="mailto:hello@balanzabikes.com"
              className="flex items-center gap-4 bg-white/20 hover:bg-white/35 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 transition-all group cursor-pointer hover:shadow-md"
            >
              <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-[#95C222] font-black shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <Mail className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="text-left font-sans">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-950/60">EMAIL</p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-950 group-hover:underline">hello@balanzabikes.com</p>
              </div>
            </a>

            {/* PHONE */}
            <a 
              href="tel:+919888963663"
              className="flex items-center gap-4 bg-white/20 hover:bg-white/35 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 transition-all group cursor-pointer hover:shadow-md"
            >
              <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-[#95C222] font-black shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <Phone className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="text-left font-sans">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-950/60">PHONE</p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-950 group-hover:underline">+91 9888-963-663</p>
              </div>
            </a>

            {/* SUPPORT HOURS */}
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 select-none">
              <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-[#95C222] font-black shrink-0 shadow-sm">
                <Clock className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="text-left font-sans text-slate-950">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-950/60">SUPPORT HOURS</p>
                <p className="text-xs sm:text-sm font-extrabold">Monday – Saturday</p>
                <p className="text-[10px] font-bold text-slate-950/80 mt-0.5">10:00 AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Wave bottom divider matching target aesthetic */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#FDFDFD]" style={{ clipPath: 'polygon(100% 100%, 0 100%, 0 0, 30% 60%, 70% 30%, 100% 90%)' }}></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-8 -mt-6 relative z-20">
        
        {/* TWO COLUMN CARDS FROM PHOTO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Card Left: SEND US A MESSAGE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl select-text text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#AEE426]/12 text-[#95C222] flex items-center justify-center font-bold">
                <HelpCircle className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                  SEND US A MESSAGE
                </h2>
                <div className="h-[3px] w-8 bg-[#AEE426] mt-0.5" />
              </div>
            </div>

            <p className="font-sans text-xs text-slate-550 leading-relaxed font-semibold mb-6">
              Have a question or need help with your order? Fill out the form and we&apos;ll get back to you soon.
            </p>

            <AnimatePresence mode="wait">
              {showContactSuccess ? (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="py-10 px-4 text-center flex flex-col items-center justify-center font-sans"
                >
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5 border border-emerald-100 shadow-[0_4px_16px_rgba(16,185,129,0.08)]">
                    <CheckCircle className="h-8 w-8 stroke-[2.2]" />
                  </div>
                  <h3 className="font-display text-lg font-black text-slate-950 uppercase tracking-tight mb-2.5">
                    MESSAGE SENT SUCCESSFULLY!
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-sm mb-8 text-center">
                    {contactSuccessText || "Thank you! We have received your inquiry. A notification mail was dispatched to hello@balanzabikes.com and our support desk will contact you soon."}
                  </p>
                  <button
                    onClick={() => setShowContactSuccess(false)}
                    className="bg-slate-900 hover:bg-[#AEE426] hover:text-slate-950 text-white font-black text-[10px] uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all cursor-pointer shadow-md active:scale-98"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-bold font-sans text-slate-700"
                      >
                        <option value="" disabled hidden>How can we help you?</option>
                        <option value="Product Details">Product / Specifications Inquiry</option>
                        <option value="Order Status">Delivery & Order Tracking</option>
                        <option value="Assembly Support">Bike Assembly & Tech Support</option>
                        <option value="Warranty claim">Warranty & Refund Cases</option>
                        <option value="Sponsorship">Sponsorship & Brand Relations</option>
                        <option value="Other">Other Issues</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans resize-none placeholder:text-slate-400 text-slate-900 leading-relaxed"
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-[#AEE426] hover:bg-black hover:text-[#AEE426] text-slate-950 font-black text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    {isSubmittingContact ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        SUBMITTING MESSAGE...
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        SEND MESSAGE
                      </>
                    )}
                  </button>

                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Card Right: DEALER INQUIRY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl select-text text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#AEE426]/12 text-[#95C222] flex items-center justify-center font-bold">
                <Store className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                  DEALER INQUIRY
                </h2>
                <div className="h-[3px] w-8 bg-[#AEE426] mt-0.5" />
              </div>
            </div>

            <p className="font-sans text-xs text-slate-550 leading-relaxed font-semibold mb-6">
              Interested in partnering with Balanza Bikes? Fill out the form below and our team will get in touch.
            </p>

            <AnimatePresence mode="wait">
              {showDealerSuccess ? (
                <motion.div
                  key="dealer-success"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="py-12 px-4 text-center flex flex-col items-center justify-center font-sans"
                >
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5 border border-emerald-100 shadow-[0_4px_16px_rgba(16,185,129,0.08)]">
                    <CheckCircle className="h-8 w-8 stroke-[2.2]" />
                  </div>
                  <h3 className="font-display text-lg font-black text-slate-950 uppercase tracking-tight mb-2.5">
                    APPLICATION SUBMITTED!
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-sm mb-8 text-center">
                    {dealerSuccessText || "Thank you! Your dealership application has been sent successfully. A copy has been delivered to hello@balanzabikes.com and our wholesale team will reach back shortly."}
                  </p>
                  <button
                    onClick={() => setShowDealerSuccess(false)}
                    className="bg-slate-900 hover:bg-[#AEE426] hover:text-slate-950 text-white font-black text-[10px] uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all cursor-pointer shadow-md active:scale-98"
                  >
                    SUBMIT ANOTHER INQUIRY
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleDealerSubmit} className="space-y-4">
                  {/* Business Name & Contact Person Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={dealerBusinessName}
                        onChange={(e) => setDealerBusinessName(e.target.value)}
                        placeholder="Enter business name"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={dealerContactPerson}
                        onChange={(e) => setDealerContactPerson(e.target.value)}
                        placeholder="Enter contact person name"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={dealerEmail}
                        onChange={(e) => setDealerEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={dealerPhone}
                        onChange={(e) => setDealerPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* City & State Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={dealerCity}
                        onChange={(e) => setDealerCity(e.target.value)}
                        placeholder="Enter city"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={dealerState}
                          onChange={(e) => setDealerState(e.target.value)}
                          className="w-full appearance-none px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-bold font-sans text-slate-705"
                        >
                          <option value="" disabled hidden>Select state</option>
                          {STATES_LIST.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Website / Social Link & Type of Business Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Website / Social Media Link
                      </label>
                      <input
                        type="url"
                        value={dealerWebsite}
                        onChange={(e) => setDealerWebsite(e.target.value)}
                        placeholder="Enter website or social link"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Type of Business <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={dealerBusinessType}
                          onChange={(e) => setDealerBusinessType(e.target.value)}
                          className="w-full appearance-none px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-bold font-sans text-slate-705"
                        >
                          <option value="" disabled hidden>Select business type</option>
                          {BUSINESS_TYPES.map((btype) => (
                            <option key={btype} value={btype}>{btype}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Years in Business & Number of Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Years in Business
                      </label>
                      <input
                        type="text"
                        value={dealerYears}
                        onChange={(e) => setDealerYears(e.target.value)}
                        placeholder="E.g. 2 years"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                        Number of Store Locations
                      </label>
                      <input
                        type="text"
                        value={dealerStores}
                        onChange={(e) => setDealerStores(e.target.value)}
                        placeholder="E.g. 5"
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans placeholder:text-slate-400 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Tell Us About Your Business Textarea */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 font-sans">
                      Tell Us About Your Business
                    </label>
                    <textarea
                      rows={3}
                      value={dealerAbout}
                      onChange={(e) => setDealerAbout(e.target.value)}
                      placeholder="Write about your business, store locations, experience, etc."
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-all font-semibold font-sans resize-none placeholder:text-slate-400 text-slate-900 leading-relaxed"
                    />
                  </div>

                  {/* Submit Dealer Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingDealer}
                    className="w-full bg-[#AEE426] hover:bg-black hover:text-[#AEE426] text-slate-950 font-black text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer font-sans disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    {isSubmittingDealer ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        SUBMITTING INQUIRY...
                      </span>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        SUBMIT DEALER INQUIRY
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BOTTOM SECTION: WHY PARTNER WITH BALANZA BIKES? */}
        <div className="mt-16 text-center select-none">
          <h3 className="font-display text-lg sm:text-xl md:text-2xl font-extrabold text-slate-950 uppercase tracking-tight mb-2.5">
            WHY PARTNER WITH BALANZA BIKES?
          </h3>
          <div className="h-[3px] w-12 bg-[#AEE426] mx-auto mb-10" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y-0 md:divide-x divide-slate-150">
            {/* 1 */}
            <div className="group text-center px-2">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#95C222] shadow-md border border-slate-100 transition-all duration-300 group-hover:scale-110">
                <ShieldCheck className="h-7 w-7 stroke-[1.8]" />
              </div>
              <h4 className="font-display text-[11px] font-black tracking-wider text-slate-800 uppercase mb-0.5 leading-tight">
                Premium Quality
              </h4>
              <p className="font-sans text-[10px] text-slate-500 font-bold leading-relaxed">
                Balance Bikes
              </p>
            </div>

            {/* 2 */}
            <div className="group text-center px-2 pt-4 md:pt-0">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#95C222] shadow-md border border-slate-100 transition-all duration-300 group-hover:scale-110">
                <Award className="h-7 w-7 stroke-[1.8]" />
              </div>
              <h4 className="font-display text-[11px] font-black tracking-wider text-slate-800 uppercase mb-0.5 leading-tight">
                Growing Kids
              </h4>
              <p className="font-sans text-[10px] text-slate-500 font-bold leading-relaxed">
                Mobility Category
              </p>
            </div>

            {/* 3 */}
            <div className="group text-center px-2 pt-4 md:pt-0">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#95C222] shadow-md border border-slate-100 transition-all duration-300 group-hover:scale-110">
                <Globe className="h-7 w-7 stroke-[1.8]" />
              </div>
              <h4 className="font-display text-[11px] font-black tracking-wider text-slate-800 uppercase mb-0.5 leading-tight">
                Attractive
              </h4>
              <p className="font-sans text-[10px] text-slate-500 font-bold leading-relaxed">
                Dealer Margins
              </p>
            </div>

            {/* 4 */}
            <div className="group text-center px-2 pt-4 md:pt-0">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#95C222] shadow-md border border-slate-100 transition-all duration-300 group-hover:scale-110">
                <Store className="h-7 w-7 stroke-[1.8]" />
              </div>
              <h4 className="font-display text-[11px] font-black tracking-wider text-slate-800 uppercase mb-0.5 leading-tight">
                Marketing &
              </h4>
              <p className="font-sans text-[10px] text-slate-500 font-bold leading-relaxed">
                Sales Support
              </p>
            </div>

            {/* 5 */}
            <div className="group text-center px-2 pt-4 md:pt-0">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#95C222] shadow-md border border-slate-100 transition-all duration-300 group-hover:scale-110">
                <Send className="h-7 w-7 stroke-[1.8] rotate-[20deg]" />
              </div>
              <h4 className="font-display text-[11px] font-black tracking-wider text-slate-800 uppercase mb-0.5 leading-tight">
                Fast Nationwide
              </h4>
              <p className="font-sans text-[10px] text-slate-500 font-bold leading-relaxed">
                Shipping
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
