import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft, BookOpen, Search, Share2, Facebook, Twitter, Link, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';

export default function BlogsPage() {
  const { blogs, activePage, setActivePage, selectedBlogPost, setSelectedBlogPost } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  // Scroll to top on page mount or page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedBlogPost]);

  // Categories/Tags
  const allTags = ['All', 'Gift Guides', 'Riding Tips', 'Parenting', 'Assembly'];

  // Filter posts based on tag and search query
  const filteredPosts = blogs.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTag === 'All') return matchesSearch;
    
    // Simple mock classification for tags
    if (selectedTag === 'Gift Guides') {
      return matchesSearch && (post.id.includes('gift') || post.title.toLowerCase().includes('gift'));
    }
    if (selectedTag === 'Riding Tips') {
      return matchesSearch && (post.id.includes('bike') || post.id.includes('kid') || post.title.toLowerCase().includes('need'));
    }
    return matchesSearch;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. DETAIL VIEW FOR AN INDIVIDUAL BLOG POST
  if (activePage === 'blog-detail' && selectedBlogPost) {
    const post = selectedBlogPost;
    // Get recommendations (other posts)
    const recommendations = blogs.filter(b => b.id !== post.id).slice(0, 2);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-slate-50/50 pt-6 pb-20 select-none"
      >
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          
          {/* Breadcrumb & Navigation Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-sans tracking-wide">
              <button 
                onClick={() => setActivePage('home')}
                className="hover:text-black transition-colors"
              >
                Home
              </button>
              <span>/</span>
              <button 
                onClick={() => setActivePage('blogs')}
                className="hover:text-black transition-colors"
              >
                Blogs
              </button>
              <span>/</span>
              <span className="text-slate-600 truncate max-w-[200px] md:max-w-xs">{post.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActivePage('blogs')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-black hover:border-slate-350 hover:shadow-xs transition-all active:scale-97 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All Blogs
              </button>
              <button 
                onClick={() => setActivePage('home')}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-extrabold text-white hover:bg-[#A7E22E] hover:text-[#111] transition-all shadow-xs active:scale-97 cursor-pointer"
              >
                Go Home
              </button>
            </div>
          </div>

          {/* Master Article Wrap */}
          <article className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            
            {/* Immersive Cover Image */}
            <div className="relative aspect-21/10 bg-slate-100">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/10 to-transparent" />
            </div>

            {/* Content Core padding */}
            <div className="p-6 md:p-12 lg:p-16">
              
              {/* Meta information row */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8 uppercase font-sans text-xs font-semibold tracking-wider text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-350" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-350" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>By <strong className="text-slate-600">{post.author}</strong></span>
                </div>

                {/* Social Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleShare}
                    className="h-8 p-2.5 rounded-full border border-slate-100 hover:border-slate-300 text-slate-500 hover:text-black flex items-center justify-center gap-1.5 cursor-pointer text-[10px] font-bold tracking-widest bg-slate-50 transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#8D9E7D]" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Link className="h-3.5 w-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Title display */}
              <h1 className="font-display text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                {post.title}
              </h1>

              {/* Body Content Paragraphs */}
              <div className="space-y-6 md:space-y-7">
                {post.content.map((paragraph, index) => {
                  const isEmphasized = paragraph.startsWith('BALANZA MINI') || paragraph.startsWith('Balanza Mini - A Gift') || paragraph.includes('never forget');
                  return (
                    <p 
                      key={index} 
                      className={`font-sans leading-relaxed text-slate-700 ${
                        isEmphasized 
                          ? 'text-sm md:text-base font-extrabold text-slate-900 border-l-4 border-[#A7E22E] pl-4 py-2 bg-slate-50/50 rounded-r-xl' 
                          : 'text-xs md:text-sm'
                      }`}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>

            </div>
          </article>

          {/* Recommended Posts list */}
          <div className="mt-14 pt-10 border-t border-slate-200 text-left">
            <h3 className="font-display text-xl font-black text-slate-900 uppercase tracking-tight mb-6">
              More Stories You Might Like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((recPost) => (
                <article 
                  key={recPost.id}
                  onClick={() => {
                    setSelectedBlogPost(recPost);
                  }}
                  className="group flex flex-col bg-white overflow-hidden rounded-2xl border border-slate-100 hover:border-slate-200/85 hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer"
                >
                  <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                    <img 
                      src={recPost.imageUrl} 
                      alt={recPost.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8D9E7D] tracking-wide block mb-1">
                        {recPost.readTime}
                      </span>
                      <h4 className="font-display text-sm font-extrabold text-slate-900 group-hover:text-[#8D9E7D] transition-colors leading-snug line-clamp-2">
                        {recPost.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-450 hover:text-black inline-flex items-center gap-1 mt-4">
                      Read Post <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    );
  }

  // 2. BLOG ARCHIVE LIST VIEW (THE FULL PAGE)
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50/40 pb-20 select-none text-left"
    >
      {/* Editorial Page Header & Title */}
      <div className="bg-[#A7E22E] py-14 md:py-20 border-b border-slate-950/10 px-4 md:px-8">
        <div className="mx-auto max-w-7xl relative">
          
          {/* Top back layout button */}
          <button 
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950/70 hover:text-slate-950 mb-6 transition-all border-b border-slate-950/10 hover:border-slate-950 pb-0.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </button>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight uppercase leading-none drop-shadow-3xs">
            Our Blogs
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-950/80 font-bold max-w-xl mt-4 leading-relaxed">
            Tips, developmental guidance, and assembly guides written specifically for curious parents wanting to support their little explorer&apos;s journey.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-10 md:mt-14">
        
        {/* Search & Tag Filter Grid Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-150 mb-10">
          
          {/* Tag filters list */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  selectedTag === tag 
                    ? 'bg-slate-950 text-white border-slate-950' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350 hover:text-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search bar inside container */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search articles & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-11 pr-4 py-2.5 text-xs font-medium rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#A7E22E] focus:border-[#A7E22E] shadow-3xs transition-all"
            />
          </div>

        </div>

        {/* Blog stream grid catalog */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8 max-w-xl mx-auto">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display text-base font-bold text-slate-900">No Articles Found</h3>
            <p className="font-sans text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn&apos;t find any blogs matching &ldquo;{searchQuery}&rdquo;. Try another search or select a different filter category!
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
              className="mt-5 px-5 py-2 bg-[#A7E22E] hover:bg-slate-950 text-slate-950 hover:text-white rounded-xl text-xs font-extrabold transition-colors active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <article 
                key={post.id}
                onClick={() => {
                  setSelectedBlogPost(post);
                  setActivePage('blog-detail');
                }}
                className="group flex flex-col bg-white overflow-hidden rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-[0_12px_24px_rgba(0,0,0,0.03)] active:scale-[0.99] transition-all cursor-pointer"
              >
                {/* Banner Thumbnail */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold tracking-wide text-slate-800 shadow-3xs uppercase backdrop-blur-3xs">
                    <Clock className="h-3 w-3 text-[#8D9E7D]" />
                    {post.readTime}
                  </span>
                </div>

                {/* Grid details block */}
                <div className="p-6 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 tracking-wider mb-2.5 uppercase font-sans">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>By {post.author}</span>
                    </div>
                    <h3 className="font-display text-base font-extrabold text-slate-900 group-hover:text-[#8D9E7D] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 mt-2.5 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-50">
                    <span className="text-xs font-extrabold text-[#8D9E7D] group-hover:text-black inline-flex items-center gap-1.5 transition-colors">
                      Read Full Article
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </motion.div>
  );
}
