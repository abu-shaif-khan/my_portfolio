import React, { useState, useEffect } from "react";
import { Terminal, ShieldAlert, Monitor, User, Server, Settings } from "lucide-react";

interface NavbarProps {
  viewMode: "portfolio" | "admin";
  setViewMode: (mode: "portfolio" | "admin") => void;
  brandName: string;
}

export default function Navbar({ viewMode, setViewMode, brandName }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (viewMode === "admin") {
      setViewMode("portfolio");
      // Let view state update first
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      id="nav-main"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10 py-4 shadow-lg shadow-black/40" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => scrollToSection("home")}
          className="cursor-pointer flex items-center gap-2 group"
          id="logo-brand"
        >
          <div className="bg-blue-600/10 p-2 rounded-xl border border-blue-600/20 group-hover:border-blue-500/50 transition-colors">
            <Server className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-wide text-white group-hover:text-blue-400 transition-colors block leading-none">
              {brandName || "Abu Shaif Khan"}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#9ca3af] font-mono mt-0.5 block">
              IT & Network Specialist
            </span>
          </div>
        </div>
 
        {/* Action Links & Mode Toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          {viewMode === "portfolio" && (
            <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-gray-400">
              <button
                id="btn-nav-home"
                onClick={() => scrollToSection("home")}
                className="hover:text-white hover:text-glow transition-all"
              >
                Home
              </button>
              <button
                id="btn-nav-skills"
                onClick={() => scrollToSection("skills")}
                className="hover:text-white hover:text-glow transition-all"
              >
                Skills
              </button>
              <button
                id="btn-nav-experience"
                onClick={() => scrollToSection("experience")}
                className="hover:text-white hover:text-glow transition-all"
              >
                Experience
              </button>
              <button
                id="btn-nav-certifications"
                onClick={() => scrollToSection("certifications")}
                className="hover:text-white hover:text-glow transition-all"
              >
                Certificaitons
              </button>
              <button
                id="btn-nav-education"
                onClick={() => scrollToSection("education")}
                className="hover:text-white hover:text-glow transition-all"
              >
                Academic
              </button>
              <button
                id="btn-nav-contact"
                onClick={() => scrollToSection("contact")}
                className="hover:text-white hover:text-glow transition-all font-semibold"
              >
                Contact
              </button>
            </div>
          )}
 
          {/* Admin Dashboard Switcher */}
          <button
            id="btn-toggle-view"
            onClick={() => setViewMode(viewMode === "portfolio" ? "admin" : "portfolio")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider transition-all border group ${
              viewMode === "admin"
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-500 shadow-md"
                : "bg-white/5 text-gray-300 border-white/10 hover:border-blue-500/50 hover:bg-white/10 hover:text-white shadow-xl"
            }`}
          >
            {viewMode === "portfolio" ? (
              <>
                <Settings className="w-3.5 h-3.5 animate-[spin_8s_linear_infinite]" />
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Exit Admin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
