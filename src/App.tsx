import React, { useState, useEffect } from "react";
import { Server, Settings, AlertCircle } from "lucide-react";
import { PortfolioData } from "./types";
import { DEFAULT_PORTFOLIO_DATA } from "./data";

// Custom dynamic components
import Navbar from "./components/Navbar";
import NetworkCanvas from "./components/NetworkCanvas";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import WhatsAppButton from "./components/WhatsAppButton";
import BackToTop from "./components/BackToTop";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [viewMode, setViewMode] = useState<"portfolio" | "admin">("portfolio");
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  // Retrieve auth token and fetch base data content on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("ask_portfolio_admin_token");
    if (savedToken) {
      setToken(savedToken);
    }

    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    setErrorText("");
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      } else {
        console.warn("REST server returned error status. Falling back to default static seeds.");
        setPortfolio(DEFAULT_PORTFOLIO_DATA);
      }
    } catch (err: any) {
      console.warn("Connection to REST server failed. Falling back to default static seeds.", err);
      setPortfolio(DEFAULT_PORTFOLIO_DATA);
    } finally {
      setLoading(false);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 1. Loading Phase Renderer
  if (loading) {
    return (
      <div 
        id="loading-spinner-universe"
        className="min-h-screen bg-brand-black flex flex-col items-center justify-center font-mono relative select-none"
      >
        <div className="absolute inset-0 network-grid opacity-15" />
        <div className="absolute w-[300px] h-[300px] bg-brand-accent/10 rounded-full filter blur-[100px]" />
        
        <div className="relative flex flex-col items-center space-y-6 z-10">
          <div className="relative">
            {/* Spinning network core ring */}
            <div className="w-16 h-16 rounded-full border-2 border-brand-accent/20 border-t-brand-accent animate-spin" />
            <Server className="w-6 h-6 text-brand-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          <div className="text-center">
            <span className="font-display font-black text-white text-lg tracking-wide uppercase">
              Abu Shaif Khan
            </span>
            <span className="text-[10px] text-brand-accent uppercase tracking-[0.25em] block mt-1">
              // Booting Router Core Configs
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Safe baseline
  const activePortfolio = portfolio || DEFAULT_PORTFOLIO_DATA;

  return (
    <div id="ask-portfolio-root" className="bg-brand-black min-h-screen relative text-gray-300 antialiased overflow-hidden">
      {/* Universal Floating Glass Header Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        brandName={activePortfolio.hero.name || "Abu Shaif Khan"}
      />

      {/* Screen view switcher */}
      {viewMode === "portfolio" ? (
        // PORTFOLIO VIEW MODE (Public representation)
        <main id="portfolio-view-segment" className="relative">
          {/* Fiber Connected Network Dot Background Canvas (Follows Resize rules) */}
          <NetworkCanvas />

          {/* HOME HERO PROFILE CARD & STATS */}
          <Hero 
            data={activePortfolio.hero} 
            onContactClick={scrollToContact} 
          />

          {/* DYNAMIC PROGRESSIVE SKILLS GRIDS */}
          <Skills 
            skillsList={activePortfolio.skills} 
          />

          {/* TIMELINE TIMED WORK EXPERIENCE CHRONOLOGY */}
          <Experience 
            experiencesList={activePortfolio.experiences} 
          />

          {/* VERIFIABLE REGULATED DOMAIN CERTIFICATIONS */}
          <Certifications 
            certsList={activePortfolio.certifications} 
          />

          {/* HIGHER EDUCATION ACADEMIC MODULES */}
          <Education 
            educationList={activePortfolio.education} 
          />

          {/* CONTACT INQUIRY SHEET FORMS */}
          <Contact 
            info={activePortfolio.contact} 
          />

          {/* Elegant Corporate Footer */}
          <footer className="border-t border-white/5 py-12 bg-brand-black relative z-10 text-center select-none">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="font-display font-bold text-white text-base tracking-wide block">
                  {activePortfolio.hero.name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-0.5 block">
                  System Architecture & IT Security operations
                </span>
              </div>
              
              <div className="font-mono text-xs text-gray-500">
                © {new Date().getFullYear()} Abu Shaif Khan. All Rights Reserved.
              </div>
            </div>
          </footer>

          {/* Floating interactive anchors */}
          <WhatsAppButton 
            number={activePortfolio.contact.whatsapp} 
          />
          
          <BackToTop />
        </main>
      ) : (
        // DASHBOARD MODE (Control Operations Workspace)
        <main id="admin-view-segment" className="relative z-10 min-h-screen bg-brand-black">
          <AdminPanel
            portfolio={activePortfolio}
            setPortfolio={setPortfolio}
            token={token}
            setToken={setToken}
            fetchPortfolio={fetchPortfolio}
          />
        </main>
      )}
    </div>
  );
}
