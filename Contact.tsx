import React, { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Shield, 
  ArrowRight, 
  Zap, 
  Clock, 
  ChevronDown 
} from "lucide-react";

interface ContactFormData {
  fullName: string;
  organization: string;
  email: string;
  interest: string;
  goals: string;
}

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form Data:", data);
    toast.success("Engagement request received. A partner will contact you within 24 hours.");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div 
        className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[180px] -z-10" 
        aria-hidden="true" 
      />
      
      <div className="container mx-auto">
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8">
              Secure Consultation
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.95]">
              Start the <br />
              <span className="text-emerald-400 italic">Conversation.</span>
            </h1>
            <p className="text-2xl text-emerald-100/70 max-w-3xl mx-auto leading-relaxed font-medium">
              Ready to implement the VAULT™ standard in your town? Our partners are ready to architect your structural future.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="bg-emerald-950/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
                  <Shield className="w-32 h-32 text-emerald-500" />
               </div>
               <h3 className="text-3xl font-black text-white mb-12 tracking-tight">Direct Access</h3>
               
               <div className="space-y-10">
                 <ContactInfoItem 
                    icon={<Mail className="w-6 h-6" aria-hidden="true" />} 
                    title="Email" 
                    value="partners@publiclogic.com" 
                    subtitle="24-hour response standard"
                 />
                 <ContactInfoItem 
                    icon={<Phone className="w-6 h-6" aria-hidden="true" />} 
                    title="Direct Line" 
                    value="+1 (617) 555-0198" 
                    subtitle="Mon-Fri, 8am-6pm EST"
                 />
                 <ContactInfoItem 
                    icon={<MapPin className="w-6 h-6" aria-hidden="true" />} 
                    title="The Commonwealth Hub" 
                    value="75 State Street, Boston, MA 02109" 
                    subtitle="Architecture & Strategy Office"
                 />
               </div>

               <div className="mt-16 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-4 text-emerald-400 font-black uppercase tracking-widest text-xs">
                     <Clock className="w-4 h-4" aria-hidden="true" /> Priority Response for Town Managers
                  </div>
               </div>
            </div>

            <div className="p-12 bg-emerald-600 rounded-[3.5rem] shadow-[0_30px_60px_rgba(5,150,105,0.4)] relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" aria-hidden="true" />
               <Zap className="w-16 h-16 text-white mb-8 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
               <h4 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">AI for Impact Pilot</h4>
               <p className="text-emerald-50 text-xl font-medium leading-relaxed mb-8">
                  Interested in our structure-first AI deployment with Polimorphic? Mention "Impact Pilot" in your message for specialized onboarding.
               </p>
               <button 
                 onClick={() => toast.info("Opening Pilot Program briefing...")}
                 className="flex items-center gap-3 text-white font-black text-lg group/btn hover:gap-5 transition-all"
               >
                  Pilot Details <ArrowRight className="w-6 h-6" aria-hidden="true" />
               </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-2xl p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-3xl"
            >
              <h3 className="text-4xl font-black text-white mb-12 tracking-tight">Project Inquiry</h3>
              <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="fullName" className="text-emerald-100/60 font-black uppercase tracking-widest text-xs ml-4">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      {...register("fullName", { required: "Name is required" })}
                      placeholder="Julian Thorne"
                      className={`w-full bg-white/5 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all placeholder:text-emerald-100/10 font-medium`}
                    />
                    {errors.fullName && <p className="text-red-400 text-xs ml-4 font-bold">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="organization" className="text-emerald-100/60 font-black uppercase tracking-widest text-xs ml-4">Town / Organization</label>
                    <input
                      id="organization"
                      type="text"
                      {...register("organization", { required: "Organization is required" })}
                      placeholder="Town of Lexington"
                      className={`w-full bg-white/5 border ${errors.organization ? 'border-red-500' : 'border-white/10'} rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all placeholder:text-emerald-100/10 font-medium`}
                    />
                    {errors.organization && <p className="text-red-400 text-xs ml-4 font-bold">{errors.organization.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="email" className="text-emerald-100/60 font-black uppercase tracking-widest text-xs ml-4">Professional Email</label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      placeholder="jthorne@lexingtonma.gov"
                      className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all placeholder:text-emerald-100/10 font-medium`}
                    />
                    {errors.email && <p className="text-red-400 text-xs ml-4 font-bold">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="interest" className="text-emerald-100/60 font-black uppercase tracking-widest text-xs ml-4">Area of Interest</label>
                    <div className="relative">
                      <select 
                        id="interest"
                        {...register("interest")}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all appearance-none font-medium cursor-pointer"
                      >
                        <option className="bg-emerald-950" value="VAULT™ Implementation">VAULT™ Implementation</option>
                        <option className="bg-emerald-950" value="AI for Impact Pilot">AI for Impact Pilot</option>
                        <option className="bg-emerald-950" value="Governance Audit">Governance Audit</option>
                        <option className="bg-emerald-950" value="Interim Leadership">Interim Leadership</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 pointer-events-none" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="goals" className="text-emerald-100/60 font-black uppercase tracking-widest text-xs ml-4">Strategic Goals</label>
                  <textarea
                    id="goals"
                    rows={6}
                    {...register("goals", { required: "Please share your goals" })}
                    placeholder="Tell us about the structural challenges your town is currently facing..."
                    className={`w-full bg-white/5 border ${errors.goals ? 'border-red-500' : 'border-white/10'} rounded-[2rem] p-8 text-white text-lg focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all placeholder:text-emerald-100/10 resize-none font-medium`}
                  ></textarea>
                  {errors.goals && <p className="text-red-400 text-xs ml-4 font-bold">{errors.goals.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-[2rem] font-black text-2xl uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 group ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Initiate Engagement <Send className="w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" aria-hidden="true" />
                    </>
                  )}
                </button>
                
                <p className="text-center text-emerald-100/50 text-sm font-bold tracking-widest uppercase">
                  Encrypted & Secure Communication Channel
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon, title, value, subtitle }: { icon: React.ReactNode, title: string, value: string, subtitle: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-all duration-500 shadow-xl group-hover:shadow-emerald-500/20 group-hover:scale-110 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-emerald-100/60 font-black uppercase tracking-[0.2em] text-xs mb-1">{title}</p>
        <p className="text-2xl font-black text-white mb-1 group-hover:text-emerald-400 transition-colors tracking-tight">{value}</p>
        <p className="text-emerald-100/60 font-bold italic text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
