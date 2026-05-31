import React from "react";
import { motion } from "motion/react";
import { GraduationCap, MapPin, Calendar, ExternalLink } from "lucide-react";
import { EducationItem } from "../types";

interface EducationProps {
  educationList: EducationItem[];
}

export default function Education({ educationList }: EducationProps) {
  return (
    <section id="education" className="py-24 max-w-7xl mx-auto px-6 border-b border-white/10 relative">
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 select-none">
        <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-3 font-bold">
          // ACADEMIC DEGREES
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
          Academic Qualifications
        </h2>
        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
        <p className="text-gray-400 max-w-xl text-xs sm:text-sm mx-auto leading-relaxed">
          Academic foundation in advanced software engineering, network routing algorithms, and distributed cybersecurity protocols.
        </p>
      </div>

      {/* Degree Cards Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Render in Stack (LIFO) order - newest/last added on top */}
        {[...educationList].reverse().map((edu, idx) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 transition-colors flex flex-col justify-between group"
          >
            <div>
              {/* Icon & Title block */}
              <div className="flex items-center gap-3.5 mb-5">
                {edu.logo && (
                  edu.logo.startsWith('/') ||
                  edu.logo.startsWith('data:image/') ||
                  edu.logo.startsWith('http://') ||
                  edu.logo.startsWith('https://')
                ) ? (
                  <img
                    src={edu.logo}
                    alt={`${edu.institution} Logo`}
                    className="w-12 h-12 rounded-xl object-contain border border-white/10 shrink-0 bg-white p-1"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-lg text-white leading-tight">
                    {edu.degree}
                  </h3>
                  <span className="text-blue-400 text-xs font-mono mt-1 block font-bold uppercase tracking-wide">
                    {edu.institution}
                  </span>
                </div>
              </div>

              {/* Description body */}
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                {edu.description}
              </p>
            </div>

            {/* Sticky Card Meta bottom */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10 w-full">
              <div className="flex items-center justify-between gap-x-4 gap-y-1 text-[10px] font-mono text-gray-400 select-none">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {edu.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Graduation: {edu.year}
                </span>
              </div>
              {edu.documentUrl && (
                <div className="pt-2 border-t border-white/5">
                  <a
                    href={edu.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 text-center text-blue-400 hover:text-white font-mono text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10 group/doc"
                    title="View Academic Document Summary or Certificate"
                  >
                    <ExternalLink className="w-3.5 h-3.5 group-hover/doc:translate-x-0.5 group-hover/doc:-translate-y-0.5 transition-transform" />
                    View Academic Record
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
