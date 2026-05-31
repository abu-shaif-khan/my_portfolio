import React from "react";
import { motion } from "motion/react";
import { Linkedin, Github, Facebook, Mail, ArrowDown, FileText, Send, Wifi, Settings, ShieldCheck, Database, Server } from "lucide-react";
import { HeroData } from "../types";

interface HeroProps {
  data: HeroData;
  onContactClick: () => void;
}

export default function Hero({ data, onContactClick }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background space elements & Ambient Glows */}
      <div className="absolute inset-0 network-grid opacity-15 pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12 pb-24 border-b border-white/10">
        {/* Left column: Text Intros */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-md border border-green-500/50 py-1.5 px-3.5 rounded-full w-fit mb-6 text-green-400 font-bold tracking-tight"
            id="badge-work-status"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase">Available for Work</span>
          </motion.div>

          {/* Titles */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-blue-500 font-mono text-xs uppercase tracking-widest mb-2 font-bold"
          >
            SYSTEMS & NETWORKS ENGINEERING
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-4 block leading-tight"
            id="hero-name"
          >
            Hello, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-extrabold text-glow select-none">
              {data.name || "Abu Shaif Khan"}
            </span>
          </motion.h1>

          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-blue-400 font-mono text-sm sm:text-base tracking-tighter mb-4 uppercase font-semibold"
            id="hero-title"
          >
            {data.title || "IT & Network Specialist"}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mb-8"
            id="hero-description"
          >
            {data.description ||
              "Designing secure, scalable, and high-performance IT infrastructure for modern enterprise environments."}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 mb-10"
            id="hero-ctas"
          >
            <a
              id="cta-resume"
              href={data.resumeUrl || "/api/portfolio/resume"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider uppercase rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 group transition-all"
            >
              <FileText className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Get Resume
            </a>
            <button
              id="cta-contact"
              onClick={onContactClick}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs font-semibold tracking-wider uppercase rounded-lg flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              Contact
            </button>
          </motion.div>

          {/* Socials Link Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-5 border-t border-white/10 pt-6 w-fit"
            id="hero-socials"
          >
            <span className="font-mono text-[11px] tracking-widest text-gray-500 uppercase">// Connect:</span>
            {data.socials.linkedin && (
              <a
                id="social-linkedin"
                href={data.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {data.socials.github && (
              <a
                id="social-github"
                href={data.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {data.socials.email && (
              <a
                id="social-email"
                href={`mailto:${data.socials.email}`}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Right column: Rotating Circular Image Cover representation */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
            id="hero-photo-wrapper"
          >
            {/* Pulsing Back Glow Rings */}
            <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full scale-90 group-hover:scale-100 transition-transform pointer-events-none" />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 through-indigo-500 to-blue-600 rounded-full opacity-30 animate-spin-slow pointer-events-none" style={{ animationDuration: '15s' }} />

            {/* Profile Avatar Frame */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mx-auto rounded-full border-4 border-blue-600/30 p-2 bg-black overflow-hidden filter drop-shadow-[0_10px_30px_rgba(37,99,235,0.15)] group">
              {data.photoUrl ? (
                // When an actual profile photo is updated by admin
                <img
                  id="profile-avatar-img"
                  src={data.photoUrl}
                  alt={data.name || "Abu Shaif Khan Portrait"}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full hover:scale-105 transition-all duration-500"
                />
              ) : (
                // Beautiful Datacenter Visual Placeholder if no custom image upload is provided (seed fallback)
                <div 
                  id="profile-avatar-placeholder"
                  className="w-full h-full rounded-full bg-gradient-to-b from-[#111827] to-black flex flex-col items-center justify-center p-6 border border-white/10 select-none"
                >
                  <div className="relative mb-3 animate-bounce" style={{ animationDuration: '4s' }}>
                    <div className="absolute -inset-3 bg-blue-600/25 rounded-full blur-md opacity-75"></div>
                    <Server className="w-12 h-12 text-blue-500 relative z-10" />
                  </div>
                  <span className="font-display font-extrabold text-white text-lg tracking-wide uppercase">
                    ASK-INFRA
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mb-4">
                    // Core Terminal Online
                  </span>
                  {/* Miniature visual server stack */}
                  <div className="flex flex-col gap-1 w-32 bg-black/80 rounded p-2 border border-white/5 font-mono text-[8px] text-gray-500">
                    <div className="flex justify-between items-center bg-gray-900 px-1 py-0.5 rounded">
                      <span>Cisco Router</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-900 px-1 py-0.5 rounded">
                      <span>Azure Cloud</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-900 px-1 py-0.5 rounded">
                      <span>Firewall WAN</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Overlapping Hover Cover Badge - placed outside overflow-hidden to stay completely on top */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 bg-black/85 text-green-400 border border-green-500/30 text-[9px] font-mono font-bold tracking-widest uppercase p-1.5 px-3.5 rounded-full shadow-lg select-none animate-pulse">
              SYS_ONLINE
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
