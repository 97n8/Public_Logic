import React from "react";
import { motion } from "motion/react";
import { ChevronRight, Shield, Zap, Target, Users, ArrowRight, Landmark, Globe, Scale } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { VaultFramework } from "@/app/components/VaultFramework";

export function HomePage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Introducing the VAULT™ Framework
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
                Durable <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-white">
                  Governance.
                </span>
              </h1>
              <p className="text-xl text-emerald-100/70 mb-10 max-w-xl leading-relaxed font-medium">
                PublicLogic empowers Massachusetts municipalities with structured, resilient solutions that bridge the gap between tradition and innovation. Built for the modern town.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 group"
                >
                  Explore VAULT™ <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <Link
                  to="/writing"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Latest Insights
                </Link>
              </div>
              
              <div className="mt-16 flex items-center gap-12">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">351</span>
                  <span className="text-emerald-100/60 text-xs uppercase tracking-[0.2em] font-bold">MA Towns</span>
                </div>
                <div className="w-px h-12 bg-white/10" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">VAULT™</span>
                  <span className="text-emerald-100/60 text-xs uppercase tracking-[0.2em] font-bold">Standard</span>
                </div>
                <div className="w-px h-12 bg-white/10" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">15+</span>
                  <span className="text-emerald-100/60 text-xs uppercase tracking-[0.2em] font-bold">Years Exp</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-emerald-500/10 blur-[120px] rounded-full" aria-hidden="true" />
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1664243328213-6b314501ba7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWNodXNldHRzJTIwdG93biUyMGhhbGwlMjBhcmNoaXRlY3R1cmUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MzQyMDYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Massachusetts Governance"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/20 to-transparent opacity-80" aria-hidden="true" />
                
                {/* Floating Glass Element */}
                <div className="absolute bottom-8 left-8 right-8 p-8 bg-emerald-950/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40 flex-shrink-0">
                      <Zap className="w-7 h-7 text-emerald-950" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white text-xl font-bold mb-1">AI for Impact Pilot</p>
                      <p className="text-emerald-100/60 leading-tight">Now launching in partnership with <span className="text-emerald-400 font-bold">Polimorphic</span>. Structure-first AI implementation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Town Logos / Trust Row */}
      <section className="py-12 border-y border-white/5 bg-[#011c16]/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <p className="text-center text-emerald-100/60 text-sm font-bold uppercase tracking-[0.3em] mb-10">Trusted by Leadership across the Commonwealth</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-80 transition-opacity">
            <TownLogo name="Lexington" icon={<Landmark className="w-6 h-6" aria-hidden="true" />} />
            <TownLogo name="Concord" icon={<Scale className="w-6 h-6" aria-hidden="true" />} />
            <TownLogo name="Andover" icon={<Shield className="w-6 h-6" aria-hidden="true" />} />
            <TownLogo name="Wellesley" icon={<Globe className="w-6 h-6" aria-hidden="true" />} />
            <TownLogo name="Plymouth" icon={<Users className="w-6 h-6" aria-hidden="true" />} />
          </div>
        </div>
      </section>

      {/* The VAULT™ Interactive Section */}
      <section className="py-32 bg-[#011c16]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">The VAULT™ Framework</h2>
            <p className="text-xl text-emerald-100/60 leading-relaxed font-medium">
              Our proprietary methodology isn't just a checklist; it's a structural realignment of how municipal governance functions in a digital age.
            </p>
          </div>

          <VaultFramework />
        </div>
      </section>

      {/* AI Partnership Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-950/60 backdrop-blur-xl border border-white/10 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full -mr-[300px] -mt-[300px]" aria-hidden="true" />
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full" aria-hidden="true" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-8">
                  Strategic Partnership
                </div>
                <h3 className="text-5xl lg:text-7xl font-black text-white mb-10 leading-[0.95] tracking-tighter">
                  Structure-First <span className="text-emerald-400">AI.</span>
                </h3>
                <p className="text-xl text-emerald-100/70 mb-10 leading-relaxed font-medium">
                  We believe that technology without structure is noise. Our <span className="text-white font-bold">AI for Impact Pilot</span> integrates Polimorphic's advanced tools within our VAULT™ framework to ensure AI serves the public interest with accountability.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    to="/writing"
                    className="inline-flex items-center gap-2 text-emerald-400 font-bold text-lg hover:text-emerald-300 transition-colors group"
                  >
                    Read the announcement <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-white font-bold text-lg hover:text-emerald-200 transition-colors group"
                  >
                    Join the Pilot <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center p-10 text-center group hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-all shadow-xl">
                    <Shield className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <p className="text-white font-bold text-xl">Governance First</p>
                </div>
                <div className="aspect-square bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center p-10 text-center group hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 mt-12">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-all shadow-xl">
                    <Users className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <p className="text-white font-bold text-xl">Public Trust</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="relative rounded-[4rem] overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-600 transition-colors duration-500 group-hover:bg-emerald-500" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" aria-hidden="true" />
            
            <div className="relative z-10 p-16 md:p-24 text-center">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-[0.95]">
                Secure your town's <br className="hidden md:block" /> structural future.
              </h2>
              <p className="text-2xl text-emerald-50 mb-14 max-w-2xl mx-auto opacity-90 font-medium leading-relaxed">
                Join the growing list of Massachusetts municipalities adopting the VAULT™ governance standard.
              </p>
              <Link
                to="/contact"
                className="inline-block px-12 py-6 bg-white text-emerald-900 rounded-[2rem] font-black text-2xl hover:bg-emerald-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Consult with PublicLogic
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TownLogo({ name, icon }: { name: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 grayscale group-hover:grayscale-0 transition-all">
      <div className="p-2 rounded-lg bg-emerald-500/10 border border-white/5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 text-emerald-400" })}
      </div>
      <span className="text-xl font-bold text-white tracking-tight">{name}</span>
    </div>
  );
}
