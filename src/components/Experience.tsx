import React from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Briefcase, Cpu, CheckCircle2, ExternalLink } from "lucide-react";
import { ExperienceItem } from "../types";

interface ExperienceProps {
  experiencesList: ExperienceItem[];
}

export default function Experience({ experiencesList }: ExperienceProps) {
  return (
    <section id="experience" className="py-24 max-w-7xl mx-auto px-6 border-b border-white/10 relative">
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 select-none">
        <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-3 font-bold">
          // INFRASTRUCTURE TIMELINE
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
          Professional Experience
        </h2>
        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
        <p className="text-gray-400 max-w-xl text-xs sm:text-sm mx-auto leading-relaxed">
          Over 3 years of building corporate server environments, setting up redundant gateways, and administering security measures.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative max-w-3xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-900 to-white/10 pointer-events-none" />

        {/* Timeline Cards Container */}
        <div className="space-y-12">
          {/* Render in Stack (LIFO) order - newest/last added on top */}
          {[...experiencesList].reverse().map((exp) => {
            return (
              <div key={exp.id} className="relative pl-12 sm:pl-16">
                {/* Custom glowing node indicator */}
                <div className="absolute left-6 w-4 h-4 rounded-full bg-[#0A0A0A] border-2 border-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.7)] z-20 transform -translate-x-1/2 top-6" />

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 transition-colors"
                >
                  {/* Compact Card details */}
                  <div className="mb-4">
                    <div className="flex items-start gap-4 mb-3">
                      {exp.logo && (
                        exp.logo.startsWith('/') ||
                        exp.logo.startsWith('data:image/') ||
                        exp.logo.startsWith('http://') ||
                        exp.logo.startsWith('https://')
                      ) ? (
                        <img
                          src={exp.logo}
                          alt={`${exp.company} Logo`}
                          className="w-12 h-12 rounded-xl object-contain border border-white/10 shrink-0 bg-white p-1"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-500 shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-display font-extrabold text-lg text-white leading-snug">
                          {exp.title}
                        </h4>
                        <p className="text-blue-400 text-xs font-medium font-mono uppercase tracking-wider mt-0.5">{exp.company}</p>
                      </div>
                    </div>

                    {/* Unified responsive meta list */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono text-gray-400 mt-3 border-b border-white/10 pb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                  </div>

                  {/* Duty Bullet points */}
                  <div className="space-y-2 mb-6">
                    {exp.responsibilities.map((resp, respIdx) => (
                      <div key={respIdx} className="flex gap-2.5 items-start text-xs text-gray-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <p>{resp}</p>
                      </div>
                    ))}
                  </div>

                  {/* Premium-styled Experience Document Link */}
                  {exp.documentUrl && (
                    <div className="mb-6">
                      <a
                        href={exp.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 text-blue-400 hover:text-white font-mono text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-blue-900/10 group/doc"
                        title="View Experience Certificate / Reference Letter"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/doc:translate-x-0.5 group-hover/doc:-translate-y-0.5 transition-transform" />
                        View Experience Certificate
                      </a>
                    </div>
                  )}

                  {/* Technology tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1.5 mr-2 text-[10px] font-mono text-gray-500 select-none">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Core Set:</span>
                    </div>
                    {exp.technologies.map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="bg-black/40 border border-white/5 text-blue-400 px-2.5 py-1 rounded text-[10px] font-mono tracking-tight"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
