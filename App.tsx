import React from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router";
import { motion, AnimatePresence } from "motion/react";

// Components
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

// Pages
import { HomePage } from "@/app/pages/Home";
import { AboutPage } from "@/app/pages/About";
import { ServicesPage } from "@/app/pages/Services";
import { WritingPage } from "@/app/pages/Writing";
import { ContactPage } from "@/app/pages/Contact";

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#022c22] text-emerald-50 selection:bg-emerald-500/30 font-sans selection:text-emerald-200 antialiased overflow-x-hidden">
      {/* Premium Multi-layered Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/15 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-emerald-800/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[10%] w-[55%] h-[55%] bg-emerald-900/20 rounded-full blur-[180px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
              <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
              <Route path="/writing" element={<PageWrapper><WritingPage /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for "premium" feel
      }}
    >
      {children}
    </motion.div>
  );
}
