import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const blogPosts = [
  {
    id: "ai-pilot",
    title: "Announcing: The AI for Impact Pilot",
    excerpt: "In partnership with Polimorphic, PublicLogic is launching a structure-first AI pilot designed specifically for Massachusetts town governance. This initiative marks a turning point in municipal technology.",
    date: "Jan 15, 2026",
    author: "Sarah Chen",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    featured: true,
    timeToRead: "8 min read"
  },
  {
    id: "vault-launch",
    title: "The VAULT™ Framework: Why Structure Matters",
    excerpt: "Exploring the fundamental shift from reactive management to proactive structural governance in municipal leadership.",
    date: "Dec 10, 2025",
    author: "Julian Thorne",
    category: "Methodology",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    timeToRead: "12 min read"
  },
  {
    id: "mass-gov-trends",
    title: "2026 Governance Trends for Massachusetts",
    excerpt: "A deep dive into the evolving legal and social landscape facing local administrators this year, from housing to climate mandates.",
    date: "Nov 22, 2025",
    author: "PublicLogic Editorial",
    category: "Policy",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    timeToRead: "5 min read"
  },
  {
    id: "charter-review",
    title: "The Art of the Modern Town Charter",
    excerpt: "Why modernizing your town's founding document is the first step toward long-term structural resilience.",
    date: "Oct 05, 2025",
    author: "Marcus Vane",
    category: "Methodology",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    timeToRead: "15 min read"
  }
];

export function WritingPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="container mx-auto">
        <header className="mb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8">
              Public Insights
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.95]">
              Writing & <span className="text-emerald-400 italic">Insights.</span>
            </h1>
            <p className="text-2xl text-emerald-100/60 leading-relaxed font-medium">
              Deep dives into governance architecture, the Polimorphic tech stack, and the future of Massachusetts municipal leadership.
            </p>
          </motion.div>
        </header>

        {/* Featured Post */}
        {blogPosts.filter(p => p.featured).map(post => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative mb-32"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-emerald-950/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 overflow-hidden hover:border-emerald-500/30 transition-all duration-700 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
              <div className="aspect-[16/10] lg:aspect-auto h-full overflow-hidden relative">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 to-transparent" aria-hidden="true" />
              </div>
              <div className="p-16">
                <div className="flex items-center gap-6 mb-8">
                  <span className="px-5 py-2 bg-emerald-500 text-emerald-950 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                    Featured Article
                  </span>
                  <div className="flex items-center gap-2 text-emerald-100/60 text-sm font-bold">
                    <Calendar className="w-4 h-4" aria-hidden="true" /> {post.date}
                  </div>
                </div>
                <h2 className="text-5xl font-black text-white mb-8 group-hover:text-emerald-400 transition-colors tracking-tight leading-tight">
                  {post.title}
                </h2>
                <p className="text-xl text-emerald-100/60 mb-12 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                       <span className="block text-white font-black text-lg leading-tight">{post.author}</span>
                       <span className="text-emerald-100/60 text-sm font-bold uppercase tracking-widest">{post.timeToRead}</span>
                    </div>
                  </div>
                  <Link
                    to={`/writing/${post.id}`}
                    className="w-16 h-16 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 group/btn"
                    aria-label={`Read more about ${post.title}`}
                  >
                    <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-24 border-b border-white/5 pb-12">
          <div className="flex gap-4 overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide">
            {["All Insights", "Innovation", "Methodology", "Policy", "Town Spotlight"].map((cat) => (
              <button
                key={cat}
                className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap border ${
                  cat === "All Insights" 
                    ? "bg-emerald-500 border-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20" 
                    : "bg-white/5 border-white/10 text-emerald-100/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-100/40" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search insights"
              placeholder="Filter by keyword..."
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-white text-lg font-medium focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all placeholder:text-emerald-100/40 shadow-2xl"
            />
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogPosts.filter(p => !p.featured).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="group flex flex-col h-full"
            >
              <div className="rounded-[3rem] bg-emerald-950/40 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-emerald-500/30 transition-all duration-500 h-full flex flex-col shadow-2xl">
                <div className="aspect-video overflow-hidden relative">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-emerald-950/80 backdrop-blur-xl rounded-full text-xs font-black text-emerald-400 uppercase tracking-widest border border-white/10 shadow-lg">
                    {post.category}
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 mb-6 text-emerald-100/60 text-sm font-bold uppercase tracking-widest">
                    <Calendar className="w-4 h-4" aria-hidden="true" /> {post.date}
                    <div className="w-1 h-1 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{post.timeToRead}</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6 group-hover:text-emerald-400 transition-colors tracking-tight leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-lg text-emerald-100/60 mb-10 leading-relaxed font-medium flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-white font-black tracking-tight">{post.author}</span>
                    <Link
                      to={`/writing/${post.id}`}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-500 hover:text-emerald-950 transition-all duration-300 shadow-lg group/btn"
                      aria-label={`Read article: ${post.title}`}
                    >
                      <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
