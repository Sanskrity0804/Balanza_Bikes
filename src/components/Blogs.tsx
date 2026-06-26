import React from 'react';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Blogs() {
  const { blogs: blogPosts, setActivePage, setSelectedBlogPost } = useApp();

  return (
    <section id="blogs-section" className="scroll-mt-16 bg-slate-50/50 pt-8 pb-8 md:pt-12 md:pb-12 select-none border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 md:text-3.5xl uppercase">
            OUR BLOGS
          </h2>
          <div className="mt-2.5 h-1 w-12 bg-[#A7E22E] mx-auto"></div>
        </div>

        {/* Grid Layout for initial 2 blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => {
                setSelectedBlogPost(post);
                setActivePage('blog-detail');
              }}
              className="group flex flex-col bg-white overflow-hidden rounded-2xl border border-slate-100 hover:border-slate-200/80 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.06)] active:scale-[0.99] transition-all duration-350 cursor-pointer"
            >
              {/* Image Container with Hover Effect */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-800 shadow-sm uppercase">
                  <BookOpen className="h-3 w-3 text-[#8D9E7D]" />
                  {post.readTime}
                </span>
              </div>

              {/* Text Padding */}
              <div className="flex flex-col flex-1 p-6 lg:p-8 text-left justify-between">
                <div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 tracking-wide mb-3 uppercase font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-350" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span>By {post.author}</span>
                  </div>
                  <h3 className="font-display text-lg lg:text-xl font-bold text-slate-900 group-hover:text-[#8D9E7D] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed mt-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8D9E7D] group-hover:text-black flex items-center gap-1.5 transition-colors">
                    Read Full Story
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
