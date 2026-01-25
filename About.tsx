import React from "react";
import { motion } from "motion/react";
import { Shield, Target, Users, Landmark, Award, Zap, Scale } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="container mx-auto">
        {/* Story Section */}
        <section className="mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8">
                Our Foundation
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.95]">
                Durable <br />
                <span className="text-emerald-400">Leadership.</span>
              </h1>
              <div className="space-y-8 text-2xl text-emerald-100/70 leading-relaxed font-medium">
                <p>
                  PublicLogic was founded in 2021 on a simple observation: the most resilient Massachusetts towns are those with the strongest underlying structures.
                </p>
                <p>
                  In an era of rapid AI integration and shifting legal mandates, municipal governance must move beyond reactive management. We provide the "structure-first" philosophy and the VAULT™ framework needed to return to proactive, durable leadership.
                </p>
                <p className="text-white italic font-bold border-l-4 border-emerald-500 pl-8 py-2">
                  "We aren't just consultants; we are architects of governance, helping communities build systems that last generations."
                </p>
              </div>
              <div className="mt-12 flex gap-8">
                 <div className="text-center p-6 bg-white/5 rounded-[2rem] border border-white/5 flex-1 shadow-xl">
                    <p className="text-4xl font-black text-white mb-1">2021</p>
                    <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest">Founded</p>
                 </div>
                 <div className="text-center p-6 bg-white/5 rounded-[2rem] border border-white/5 flex-1 shadow-xl">
                    <p className="text-4xl font-black text-white mb-1">351</p>
                    <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest">Target Reach</p>
                 </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-emerald-500/10 blur-[120px] rounded-full" aria-hidden="true" />
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dee3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Massachusetts Town Square"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent opacity-80" aria-hidden="true" />
                
                <div className="absolute -bottom-12 -left-12 p-10 bg-emerald-600 rounded-[3rem] shadow-3xl max-w-sm group-hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl">
                      <Award className="w-7 h-7" aria-hidden="true" />
                    </div>
                    <div className="text-4xl font-black text-white">15+</div>
                  </div>
                  <div className="text-emerald-50 text-xl font-bold leading-tight">Years of combined municipal expertise in the Commonwealth.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Philosophy Row */}
        <section className="py-32 border-y border-white/5 mb-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-emerald-400 shadow-xl border border-emerald-500/10">
              <Zap className="w-10 h-10" aria-hidden="true" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter italic uppercase">Structure-First.</h2>
            <p className="text-2xl text-emerald-100/60 leading-relaxed font-medium">
              Most firms focus on the "what" of policy. PublicLogic focuses on the "how" of governance. Without a durable structure, even the best policies fail under pressure.
            </p>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="mb-40">
          <div className="flex justify-between items-end mb-20">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Public Logic Integrity</h2>
             <div className="hidden md:block w-32 h-px bg-white/10 mb-6" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueItem 
              icon={<Shield className="w-10 h-10" />}
              title="Integrity"
              description="Transparent processes that build and maintain public trust through every transition."
              color="bg-emerald-500"
            />
            <ValueItem 
              icon={<Landmark className="w-10 h-10" />}
              title="Tradition"
              description="Respecting the unique heritage of Massachusetts town meetings and local autonomy."
              color="bg-emerald-400"
            />
            <ValueItem 
              icon={<Scale className="w-10 h-10" />}
              title="Precision"
              description="Evidence-based decision making for complex municipal policies and charters."
              color="bg-emerald-300"
            />
            <ValueItem 
              icon={<Users className="w-10 h-10" />}
              title="Community"
              description="Centering the needs of citizens in every structural framework we implement."
              color="bg-white"
            />
          </div>
        </section>

        {/* Team Section */}
        <section className="py-32 px-12 bg-emerald-950/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
          
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Architects of Governance.</h2>
            <p className="text-2xl text-emerald-100/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Our team consists of former town managers, policy experts, and technologists united by the VAULT™ mission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            <TeamMember 
              name="Julian Thorne" 
              role="Founding Partner" 
              bio="Former Town Manager with 20 years experience in MA municipal law." 
              imgIdx={1} 
            />
            <TeamMember 
              name="Sarah Chen" 
              role="Director of Innovation" 
              bio="Leading the AI for Impact Pilot and structural technology integration." 
              imgIdx={2} 
            />
            <TeamMember 
              name="Marcus Vane" 
              role="VAULT™ Lead Architect" 
              bio="Specialist in administrative audits and procedural legitimacy." 
              imgIdx={3} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ValueItem({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-12 rounded-[3rem] bg-white/5 border border-white/5 hover:bg-emerald-600/10 hover:border-emerald-500/30 transition-all duration-500 group h-full shadow-2xl"
    >
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 text-emerald-950 transition-all duration-500 shadow-2xl ${color} group-hover:scale-110`}>
        {React.cloneElement(icon as React.ReactElement, { "aria-hidden": "true" })}
      </div>
      <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{title}</h3>
      <p className="text-lg text-emerald-100/60 leading-relaxed font-medium group-hover:text-emerald-100 transition-colors">{description}</p>
    </motion.div>
  );
}

function TeamMember({ name, role, bio, imgIdx }: { name: string, role: string, bio: string, imgIdx: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="aspect-[4/5] bg-white/5 rounded-[3.5rem] border border-white/10 overflow-hidden mb-8 relative grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
        <ImageWithFallback
          src={`https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600&sig=${imgIdx}`}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" aria-hidden="true" />
      </div>
      <div className="px-4">
         <h4 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-emerald-400 transition-colors">{name}</h4>
         <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-4">{role}</p>
         <p className="text-lg text-emerald-100/60 font-medium leading-relaxed group-hover:text-emerald-100 transition-colors">{bio}</p>
      </div>
    </motion.div>
  );
}
