import React from "react";
import { motion } from "motion/react";
import { BadgeCheck, Calendar, ExternalLink, ShieldCheck, Bookmark } from "lucide-react";
import { CertificationItem } from "../types";

interface CertificationsProps {
  certsList: CertificationItem[];
}

export default function Certifications({ certsList }: CertificationsProps) {
  // SVG Badges representations matching badgeImage keys
  const renderBadgeMarkup = (badgeKey?: string) => {
    if (badgeKey && (
      badgeKey.startsWith("/") ||
      badgeKey.startsWith("data:image/") ||
      badgeKey.startsWith("http://") ||
      badgeKey.startsWith("https://")
    )) {
      return (
        <div className="w-[108px] h-[108px] rounded-full bg-white flex items-center justify-center shrink-0 border border-white/10 shadow-inner overflow-hidden">
          <img
            src={badgeKey}
            alt="Badge"
            className="w-full h-full object-contain rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    switch (badgeKey?.toLowerCase()) {
      case "cisco":
        return (
          <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-tr from-cyan-600/30 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center font-mono text-center select-none font-bold text-sm text-cyan-300">
            CISCO
          </div>
        );
      case "microsoft":
        return (
          <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-tr from-blue-700/30 to-indigo-500/10 border border-blue-400/30 flex items-center justify-center font-mono text-center select-none font-bold text-xs text-blue-300">
            MSFT
          </div>
        );
      case "aws":
        return (
          <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-tr from-amber-600/30 to-orange-500/10 border border-amber-400/30 flex items-center justify-center font-mono text-center select-none font-bold text-sm text-amber-300">
            AWS
          </div>
        );
      case "fortinet":
        return (
          <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-tr from-red-600/30 to-orange-500/10 border border-red-400/30 flex items-center justify-center font-mono text-center select-none font-bold text-xs text-red-300">
            FNT
          </div>
        );
      case "comptia":
        return (
          <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-tr from-teal-600/30 to-cyan-500/10 border border-teal-400/30 flex items-center justify-center font-mono text-center select-none font-bold text-xs text-teal-300">
            COMP
          </div>
        );
      default:
        return (
          <div className="w-[108px] h-[108px] rounded-full bg-[#111827] border border-white/5 flex items-center justify-center text-brand-accent">
            <ShieldCheck className="w-12 h-12" />
          </div>
        );
    }
  };

  return (
    <section id="certifications" className="py-24 max-w-7xl mx-auto px-6 border-b border-white/10 relative">
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 select-none">
        <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-3 font-bold">
          // DOMAIN VALIDATION
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
          Professional Certifications
        </h2>
        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
        <p className="text-gray-400 max-w-xl text-xs sm:text-sm mx-auto leading-relaxed">
          Industry-aligned, verified professional credentials proving specialized infrastructure competence and system engineering.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certsList.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 transition-colors flex flex-col justify-between"
          >
            <div>
              {/* Badge visual & Name header */}
              <div className="flex flex-col items-center text-center gap-4 mb-5 pb-4 border-b border-white/10">
                <div className="shrink-0">{renderBadgeMarkup(cert.badgeImage)}</div>
                
                <div className="flex flex-col items-center text-center">
                  <h3 className="font-sans font-bold text-sm sm:text-base text-white tracking-wide leading-snug group-hover:text-blue-500 transition-colors text-center">
                    {cert.name}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono mt-1.5 block text-center">
                    Issued by {cert.issuer}
                  </span>
                </div>
              </div>

              {/* Credential ID and details metadata */}
              <div className="space-y-2 mb-6 font-mono text-[11px] text-gray-400">
                <div className="flex justify-between items-center bg-black/40 px-2.5 py-1.5 rounded border border-white/5">
                  <span className="text-gray-500">Credential ID:</span>
                  <span className="text-gray-200 font-medium font-mono">{cert.credentialId || "N/A"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Issue Date:</span>
                  <span className="text-gray-300">{cert.issueDate}</span>
                </div>
              </div>
            </div>

            {/* Verification trigger bottom button */}
            <div className="space-y-2 w-full">
              {cert.documentUrl && (
                <a
                  href={cert.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-center text-blue-400 hover:text-white font-mono text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
                  title="View Certificate Document Copy"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Certificate Copy
                </a>
              )}
              {cert.verifyUrl ? (
                <a
                  id={`btn-verify-${cert.id}`}
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600 text-center text-white font-mono text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition-all group"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Verify Credential
                  <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ) : (
                <div className="w-full py-2 bg-black/40 border border-white/5 text-center text-gray-600 font-mono text-[10px] uppercase rounded">
                  Verified - Internal Record
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
