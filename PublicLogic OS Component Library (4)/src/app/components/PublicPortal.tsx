import React, { useState } from "react";
import { 
  CheckCircle2, ShieldAlert, Clock, Scale, Info, History 
} from "lucide-react";
import { Header } from "./layout";
import { Button, Card } from "./ui/base";
import { Input, Textarea, Select, Label, Checkbox, FileSubmit } from "./ui/form";
import { Alert } from "./ui/overlay";
import { motion as Motion } from "motion/react";
import { projectId } from "../../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-70f81275`;
const LEGAL_NOTICE = "This request is submitted under M.G.L. c. 66 §10 and 950 CMR 32.00. The Town of Phillipston must respond within 10 business days unless a valid extension applies.";

export default function PublicPortal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [caseId, setCaseId] = useState("");
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // DEMO MODE: Anonymous resident submissions are simulated for Figma preview
    // to bypass MSAL redirect constraints.
    const id = `PRR-2026-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    setTimeout(() => {
      setCaseId(id);
      setShowSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Header title="Resident Records Portal" />
      <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        
        <div className="mb-10 flex items-center gap-4 px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[14px] text-emerald-900 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="leading-relaxed font-medium">
            <strong>Simulation Mode:</strong> To support the Figma preview environment, submissions are currently simulated. 
            Official filings require a verified secure connection to the Municipal Vault.
          </p>
        </div>

        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-emerald-100 shadow-lg shadow-emerald-500/5">
            <Scale className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Public Records Request</h2>
            <p className="text-slate-400 text-base font-bold uppercase tracking-widest">Town of Phillipston • M.G.L. c. 66 Compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {showSuccess ? (
              <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-20 px-10 bg-white border border-slate-100 rounded-[32px] text-center shadow-xl">
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-8 border border-emerald-100">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black mb-3 text-slate-900 uppercase">Request Filed</h3>
                <p className="text-slate-500 mb-10 max-w-sm text-lg font-medium">Your request has been prepared for the Municipal Archive. Save your reference ID:</p>
                <div className="bg-slate-50 px-8 py-5 rounded-full border-2 border-emerald-500/20 font-mono text-2xl font-bold text-emerald-600 mb-12 tracking-[0.2em]">
                  {caseId}
                </div>
                <Button variant="primary" onClick={() => setShowSuccess(false)} className="px-12 h-14 bg-emerald-500 border-none rounded-full shadow-xl shadow-emerald-500/20 text-white font-black uppercase tracking-widest">
                  File Another Request
                </Button>
              </Motion.div>
            ) : (
              <Card className="p-10 border-none bg-white shadow-xl rounded-[32px]">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Legal Name</Label>
                      <Input name="name" required placeholder="John Q. Public" className="bg-slate-50 border-slate-200 h-12 rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Email</Label>
                      <Input name="email" type="email" required placeholder="email@example.com" className="bg-slate-50 border-slate-200 h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
                    <Select name="type" className="bg-slate-50 border-slate-200 h-12 rounded-xl">
                      <option>Assessors' Records</option>
                      <option>Building Permits</option>
                      <option>Town Clerk Records</option>
                      <option>Public Safety Reports</option>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                    <Textarea 
                      name="description" 
                      required 
                      placeholder="Provide specific details..." 
                      className="min-h-[160px] bg-slate-50 border-slate-200 p-4 rounded-xl"
                    />
                  </div>
                  
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox id="ack-1" required />
                      <label htmlFor="ack-1" className="text-[12px] text-slate-600 font-bold leading-tight cursor-pointer uppercase tracking-tight">
                        I understand this is a public record under M.G.L. c. 66
                      </label>
                    </div>
                  </div>

                  <Button type="submit" isLoading={isSubmitting} className="w-full h-16 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 border-none">
                    File Official Request
                  </Button>
                </form>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Alert variant="info" className="border-emerald-100 bg-white p-6 rounded-[32px] shadow-sm">
              <h4 className="font-black text-emerald-600 mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Clock className="w-4 h-4" /> Response Protocol
              </h4>
              <p className="text-[12px] leading-relaxed text-slate-600 font-medium">{LEGAL_NOTICE}</p>
            </Alert>
            
            <Card className="p-7 bg-white border-none shadow-sm rounded-[32px]">
              <h4 className="font-black mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-900">
                <ShieldAlert className="w-5 h-5 text-emerald-500" /> Exemptions
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                Certain records are exempt including personnel files and active criminal investigations.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
