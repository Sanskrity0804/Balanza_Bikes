/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesBar from './components/FeaturesBar';
import BikesCatalog from './components/BikesCatalog';
import WhyBalanza from './components/WhyBalanza';
import OurStory from './components/OurStory';
import AssemblyPage from './components/AssemblyPage';
import Blogs from './components/Blogs';
import BlogsPage from './components/BlogsPage';
import ContactPage from './components/ContactPage';
import OurStoryPage from './components/OurStoryPage';
import FAQsPage from './components/FAQsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsPage from './components/TermsPage';
import ShippingPage from './components/ShippingPage';
import ReturnsPage from './components/ReturnsPage';
import Footer from './components/Footer';
import DrawersAndModals from './components/DrawersAndModals';
import AccountModal from './components/AccountModal';
import AdminPanel from './components/AdminPanel';
import InfoModal from './components/InfoModal';
import AdminLogin from './components/AdminLogin';
import SEO from './components/SEO';
import { AppProvider, useApp } from './context/AppContext';
import React, { useState, useEffect } from 'react';

function MainLayout() {
  const { isAdminOpen, setAdminOpen, activePage, setActivePage, selectedBlogPost, setIsAdminAuthorized } = useApp();
  const [currentUrlPath, setCurrentUrlPath] = useState(window.location.pathname);

  // Patch window.history to trigger popstate on pushState and replaceState
  useEffect(() => {
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function (state, title, url) {
      const result = originalPush.apply(this, [state, title, url]);
      window.dispatchEvent(new Event('popstate'));
      return result;
    };

    window.history.replaceState = function (state, title, url) {
      const result = originalReplace.apply(this, [state, title, url]);
      window.dispatchEvent(new Event('popstate'));
      return result;
    };

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, []);

  // Synchronize activePage based on the URL pathname on load and browser back/forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentUrlPath(path);
      
      if (path.startsWith('/admin')) {
        return;
      }

      // Automatically clear the admin session for safety when navigating away from the admin area
      localStorage.removeItem('balanza_admin_authorized');
      localStorage.removeItem('balanza_admin_jwt');
      localStorage.removeItem('balanza_admin_user');
      sessionStorage.removeItem('balanza_admin_authorized');
      sessionStorage.removeItem('balanza_admin_jwt');
      sessionStorage.removeItem('balanza_admin_user');
      setIsAdminAuthorized(false);
      
      if (path === '/blogs' || path === '/blogs/') {
        setActivePage('blogs');
      } else if (path === '/contact') {
        setActivePage('contact');
      } else if (path === '/story') {
        setActivePage('story');
      } else if (path === '/assembly') {
        setActivePage('assembly');
      } else if (path === '/faqs') {
        setActivePage('faqs');
      } else if (path === '/privacy') {
        setActivePage('privacy');
      } else if (path === '/terms') {
        setActivePage('terms');
      } else if (path === '/shipping') {
        setActivePage('shipping');
      } else if (path === '/returns') {
        setActivePage('returns');
      } else if (path === '/' || path === '') {
        setActivePage('home');
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [setActivePage, setIsAdminAuthorized]);

  // Synchronize activePage state updates back to the browser URL address bar
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    if (currentPath.startsWith('/admin')) {
      return;
    }

    let targetPath = '/';
    if (activePage === 'blogs') targetPath = '/blogs';
    else if (activePage === 'contact') targetPath = '/contact';
    else if (activePage === 'story') targetPath = '/story';
    else if (activePage === 'assembly') targetPath = '/assembly';
    else if (activePage === 'faqs') targetPath = '/faqs';
    else if (activePage === 'privacy') targetPath = '/privacy';
    else if (activePage === 'terms') targetPath = '/terms';
    else if (activePage === 'shipping') targetPath = '/shipping';
    else if (activePage === 'returns') targetPath = '/returns';

    if (currentPath !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [activePage]);

  if (currentUrlPath === '/admin/login') {
    return <AdminLogin />;
  }

  if (currentUrlPath === '/admin') {
    const hasToken = localStorage.getItem('balanza_admin_jwt');
    if (!hasToken) {
      setTimeout(() => {
        window.history.replaceState({}, '', '/admin/login');
        window.dispatchEvent(new Event('popstate'));
      }, 0);
      return (
        <div className="min-h-screen bg-[#06080F] flex items-center justify-center font-sans text-slate-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
          <div className="animate-pulse font-mono text-xs uppercase tracking-widest text-lime-400">
            Establishing administrative link...
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#06080F] p-2 sm:p-8 flex items-center justify-center font-sans relative overflow-hidden">
        {/* Premium ambient glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-lime-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-30" />
        
        <AdminPanel 
          isOpen={true} 
          onClose={() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }} 
        />
      </div>
    );
  }

  // Dynamic SEO Configuration
  let seoTitle = "Premium Balance Bikes for Toddlers & Kids";
  let seoDescription = "Discover Balanza Bikes - Premium, lightweight balance bikes designed for toddlers and early learners (12+ Months) to foster balance, confidence, and motor skills.";
  let seoCanonical = "https://balanzabikes.com/";
  let seoType: "website" | "article" | "product" = "website";
  let seoImage = "https://balanzabikes.com/images/bike_explorer_olive_1779786711803.png";
  let seoSchema: any = null;

  if (activePage === 'home') {
    seoTitle = "Premium Balance Bikes for Toddlers & Kids";
    seoDescription = "Discover Balanza Bikes - Premium, lightweight balance bikes designed for toddlers and early learners (12+ Months) to foster balance, confidence, and motor skills.";
    seoCanonical = "https://balanzabikes.com/";
    seoType = "website";
    seoSchema = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://balanzabikes.com/#organization",
        "name": "Balanza Bikes",
        "url": "https://balanzabikes.com",
        "logo": "https://balanzabikes.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-98889-63663",
          "contactType": "customer service",
          "email": "hello@balanzabikes.com"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://balanzabikes.com/#website",
        "name": "Balanza Bikes",
        "url": "https://balanzabikes.com"
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Balanza Mini - Mint Green",
        "image": "https://balanzabikes.com/images/bike_explorer_olive_1779786711803.png",
        "description": "Designed for early learners, premium construction with lightweight alloys and ergonomic controls to foster independence starting at 12+ Months.",
        "sku": "balanza-mini-mint-green",
        "brand": { "@type": "Brand", "name": "Balanza" },
        "offers": {
          "@type": "Offer",
          "url": "https://balanzabikes.com/",
          "priceCurrency": "INR",
          "price": "2899",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Balanza Mini - Lavender",
        "image": "https://balanzabikes.com/images/bike_vintage_lilac_1779792037270.png",
        "description": "Timeless retro-vintage aesthetics combined with premium durability, classy tan leather touches, beige fat-tread tyres, and supportive comfort.",
        "sku": "balanza-mini-lavender",
        "brand": { "@type": "Brand", "name": "Balanza" },
        "offers": {
          "@type": "Offer",
          "url": "https://balanzabikes.com/",
          "priceCurrency": "INR",
          "price": "2899",
          "availability": "https://schema.org/InStock"
        }
      }
    ];
  } else if (activePage === 'blogs') {
    seoTitle = "Expert Tips, Milestone Guides & Parent Stories | Blog";
    seoDescription = "Stay updated with Balanza Bikes blogs. Expert advice on parenting, choosing balance bikes, milestone celebrations, and raising confident explorers.";
    seoCanonical = "https://balanzabikes.com/blogs";
    seoType = "website";
    seoSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Balanza Bikes Blog",
      "description": "Expert advice on parenting, choosing balance bikes, milestone celebrations, and raising confident explorers.",
      "publisher": {
        "@type": "Organization",
        "name": "Balanza Bikes",
        "logo": "https://balanzabikes.com/images/logo.png"
      }
    };
  } else if (activePage === 'blog-detail' && selectedBlogPost) {
    seoTitle = selectedBlogPost.title;
    seoDescription = selectedBlogPost.excerpt;
    seoCanonical = `https://balanzabikes.com/blogs/${selectedBlogPost.id}`;
    seoType = "article";
    seoImage = selectedBlogPost.imageUrl.startsWith('http') ? selectedBlogPost.imageUrl : `https://balanzabikes.com${selectedBlogPost.imageUrl}`;
    seoSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": selectedBlogPost.title,
      "description": selectedBlogPost.excerpt,
      "image": seoImage,
      "datePublished": "2026-06-24",
      "author": {
        "@type": "Person",
        "name": selectedBlogPost.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Balanza Bikes",
        "logo": {
          "@type": "ImageObject",
          "url": "https://balanzabikes.com/images/logo.png"
        }
      }
    };
  } else if (activePage === 'contact') {
    seoTitle = "Contact Us - Support & Dealership Inquiries";
    seoDescription = "Get in touch with Balanza Bikes support or inquire about dealerships. Call us at +91 9888-963-663 or write to us at hello@balanzabikes.com.";
    seoCanonical = "https://balanzabikes.com/contact";
  } else if (activePage === 'story') {
    seoTitle = "Our Story - Crafting Joy & Confidence";
    seoDescription = "Discover the story behind Balanza Bikes. Learn how we craft premium, safe, and ultra-lightweight balance bikes that empower tiny riders from day one.";
    seoCanonical = "https://balanzabikes.com/story";
  } else if (activePage === 'assembly') {
    seoTitle = "Assembly Instructions - 3-Step Setup Guide";
    seoDescription = "Watch our simple step-by-step assembly video guide. Get your Balanza Mini assembled in less than 5 minutes with the included toolkit.";
    seoCanonical = "https://balanzabikes.com/assembly";
  } else if (activePage === 'faqs') {
    seoTitle = "Frequently Asked Questions";
    seoDescription = "Find answers to all your questions about shipping, assembly, size guides, warranty, safety, and why balance bikes are perfect for kids.";
    seoCanonical = "https://balanzabikes.com/faqs";
    seoSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a balance bike?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A balance bike is a pedal-free bike that helps children learn balance naturally using their feet. It fosters balance, coordination, confidence, and independence from day one."
          }
        },
        {
          "@type": "Question",
          "name": "Why not just use training wheels like everyone else?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Training wheels teach children to rely on artificial support rather than balance. With a balance bike, kids learn true balance from day one, making the transition to a pedal bike faster and more confident."
          }
        },
        {
          "@type": "Question",
          "name": "At what age can my child start using Balanza?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Balanza Mini is designed for toddlers from 12 months and above. If your toddler can walk independently, they are likely ready to begin their Balanza journey."
          }
        },
        {
          "@type": "Question",
          "name": "What makes the Balanza Mini different?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Balanza Mini is thoughtfully designed for toddlers starting at 12 months, featuring a lightweight frame, ultra-low seat height, easy-grip handlebars, and premium retro aesthetics."
          }
        }
      ]
    };
  } else if (activePage === 'privacy') {
    seoTitle = "Privacy Policy";
    seoDescription = "Read the Balanza Bikes Privacy Policy. Learn how we collect, protect, and safely handle your personal data when using our website.";
    seoCanonical = "https://balanzabikes.com/privacy";
  } else if (activePage === 'terms') {
    seoTitle = "Terms of Service";
    seoDescription = "Review the terms and conditions governing your use of the Balanza Bikes website, purchases, support services, and legal rights.";
    seoCanonical = "https://balanzabikes.com/terms";
  } else if (activePage === 'shipping') {
    seoTitle = "Shipping & Delivery Policy";
    seoDescription = "Learn about our shipping times, delivery areas across India, tracking information, and express packaging of your Balanza Mini.";
    seoCanonical = "https://balanzabikes.com/shipping";
  } else if (activePage === 'returns') {
    seoTitle = "Cancellation & Refund Policy";
    seoDescription = "Understand our transparent returns, replacements, and cancellation policies. We offer a 7-day hassle-free return window for unused items.";
    seoCanonical = "https://balanzabikes.com/returns";
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#BFEC53] selection:text-slate-950">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={seoCanonical}
        ogType={seoType}
        ogImage={seoImage}
        schema={seoSchema}
      />
      <Header />
      
      <main>
        {activePage === 'home' ? (
          <>
            <Hero />
            <BikesCatalog />
            <FeaturesBar />
            <WhyBalanza />
            <OurStory />
            <Blogs />
          </>
        ) : activePage === 'contact' ? (
          <ContactPage />
        ) : activePage === 'story' ? (
          <OurStoryPage />
        ) : activePage === 'assembly' ? (
          <AssemblyPage />
        ) : activePage === 'faqs' ? (
          <FAQsPage />
        ) : activePage === 'privacy' ? (
          <PrivacyPolicyPage />
        ) : activePage === 'terms' ? (
          <TermsPage />
        ) : activePage === 'shipping' ? (
          <ShippingPage />
        ) : activePage === 'returns' ? (
          <ReturnsPage />
        ) : (
          <BlogsPage />
        )}
      </main>

      <Footer />
      <DrawersAndModals />
      <AccountModal />
      <InfoModal />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

