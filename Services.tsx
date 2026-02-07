import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronRight, Zap, Shield, Layers, ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router";
import { VaultFramework } from "@/app/components/VaultFramework";

export function ServicesPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="container mx-auto">
        <header className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8">
              Core Capabilities
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.95]">
              The <span className="text-emerald-400">VAULT™</span> <br /> Standard.
            </h1>
            <p className="text-2xl text-emerald-100/60 max-w-3xl mx-auto leading-relaxed font-medium">
              Our comprehensive suite of services is built upon the VAULT™ framework, ensuring every town we serve is equipped for the structural challenges of tomorrow.
            </p>
          </motion.div>
        </header>

        {/* VAULT Detail Interactive */}
        <section className="mb-40">
          <div className="flex flex-col lg:flex-row gap-16 items-end mb-20">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Deconstructing VAULT™</h2>
              <p className="text-xl text-emerald-100/60 max-w-2xl leading-relaxed font-medium">
                VAULT™ is a proprietary methodology developed specifically for the unique structural needs of Massachusetts towns. It shifts the paradigm from reactive to proactive governance.
              </p>
            </div>
            <div className="flex gap-4">
               <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-emerald-100/60 text-sm font-bold uppercase tracking-widest">
                  Proprietary Framework
               </div>
            </div>
          </div>
          <VaultFramework />
        </section>

        {/* Service Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-40">
          <ServiceCard 
            icon={<Layers className="w-10 h-10" aria-hidden="true" />}
            title="Governance Architecture"
            description="Full-scale restructuring of municipal workflows, charter updates, and administrative modernization tailored for MA law."
            features={["Charter Modernization", "Workflow Optimization", "Policy Design", "Administrative Audits"]}
            index={0}
          />
          <ServiceCard 
            icon={<Zap className="w-10 h-10" aria-hidden="true" />}
            title="AI for Impact Pilot"
            description="Our flagship program with Polimorphic. Implementing responsible AI within a structure-first governance framework."
            features={["Ethics Frameworks", "AI Tool Deployment", "Staff Empowerment", "Impact Assessment"]}
            highlighted
            index={1}
          />
          <ServiceCard 
            icon={<Shield className="w-10 h-10" aria-hidden="true" />}
            title="Interim Leadership"
            description="High-level interim town management that maintains framework continuity during leadership transitions."
            features={["Transition Stability", "Process Continuity", "Talent Search Support", "Operational Recovery"]}
            index={2}
          />
        </section>

        {/* The Polimorphic Partnership Feature */}
        <section className="mb-40 relative">
          <div className="absolute inset-0 bg-emerald-500/5 rounded-[4rem] border border-white/5 -z-10 pointer-events-none" aria-hidden="true" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 p-12 lg:p-24 items-center">
            <div>
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
                <Activity className="w-8 h-8 text-emerald-950" aria-hidden="true" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Powered by <span className="text-emerald-400">Polimorphic</span></h3>
              <p className="text-xl text-emerald-100/70 mb-10 leading-relaxed font-medium">
                Our technology partnership with Polimorphic allows us to offer the most advanced digital governance tools in the Commonwealth. We provide the structure; they provide the engine.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <li className="flex items-center gap-3 text-emerald-100 font-bold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" aria-hidden="true" /> Digital Town Hall
                </li>
                <li className="flex items-center gap-3 text-emerald-100 font-bold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" aria-hidden="true" /> Automated Workflows
                </li>
                <li className="flex items-center gap-3 text-emerald-100 font-bold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" aria-hidden="true" /> Secure Data Vaults
                </li>
                <li className="flex items-center gap-3 text-emerald-100 font-bold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" aria-hidden="true" /> Citizen Portals
                </li>
              </ul>
              <Link to="/contact" className="inline-flex items-center gap-3 text-emerald-400 font-black text-xl hover:gap-5 transition-all group">
                Learn more about Polimorphic <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-emerald-950/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-3xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent group-hover:from-emerald-500/20 transition-all duration-700" aria-hidden="true" />
                 <div className="text-center p-12 relative z-10">
                    <Zap className="w-24 h-24 text-emerald-400 mx-auto mb-8 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.3)]" aria-hidden="true" />
                    <p className="text-3xl font-black text-white mb-4 italic tracking-tight">Next-Gen Governance</p>
                    <p className="text-emerald-100/60 font-bold uppercase tracking-[0.2em] text-sm">Deployment Ready 2026</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-32 bg-emerald-600 rounded-[4rem] border border-white/20 shadow-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter">Ready for a <br /> Structure-First Approach?</h2>
            <Link
              to="/contact"
              className="inline-block px-12 py-6 bg-white text-emerald-900 rounded-[2rem] font-black text-2xl hover:bg-emerald-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Schedule an Audit <ChevronRight className="w-7 h-7 inline-block ml-2" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, description, features, highlighted = false, index }: { icon: React.ReactNode, title: string, description: string, features: string[], highlighted?: boolean, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`p-12 rounded-[3.5rem] border transition-all duration-500 flex flex-col h-full ${
        highlighted 
          ? "bg-emerald-600 border-emerald-400 shadow-[0_30px_60px_rgba(5,150,105,0.4)] scale-[1.05] z-10" 
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-2 shadow-2xl"
      }`}
    >
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl ${
        highlighted ? "bg-white text-emerald-600" : "bg-emerald-500/20 text-emerald-400"
      }`}>
        {icon}
      </div>
      <h3 className={`text-3xl font-black mb-6 tracking-tight text-white`}>{title}</h3>
      <p className={`text-lg mb-10 leading-relaxed flex-grow font-medium ${highlighted ? "text-emerald-50/80" : "text-emerald-100/70"}`}>
        {description}
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((f) => (
          <li key={f} className={`flex items-center gap-4 font-bold ${highlighted ? "text-white" : "text-emerald-50"}`}>
            <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${highlighted ? "text-emerald-200" : "text-emerald-500"}`} aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
      <Link 
        to="/contact"
        className={`mt-auto inline-flex items-center justify-center py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
          highlighted ? "bg-white text-emerald-950 hover:bg-emerald-50" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-emerald-950"
        }`}
      >
        Select Program
      </Link>
    </motion.div>
  );
}
