import React from "react";
import { MessageSquareCode } from "lucide-react";

interface WhatsAppButtonProps {
  number: string; // WhatsApp clean number e.g. "+8801712345678" or "8801712345678"
}

export default function WhatsAppButton({ number }: WhatsAppButtonProps) {
  // Filter out non-digits from string
  const cleanNumber = number ? number.replace(/\D/g, "") : "";
  const whatsappUrl = `https://wa.me/${cleanNumber}`;

  return (
    <a
      id="floating-whatsapp"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-[#25d366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 transition-all filter drop-shadow-[0_10px_20px_rgba(37,211,102,0.3)] flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      {/* Ripple ring pulse */}
      <span className="absolute -inset-1 rounded-full bg-[#25d366]/40 animate-ping opacity-75"></span>
      <MessageSquareCode className="w-5.5 h-5.5 relative z-10 text-white" />
      
      {/* Tooltip cover */}
      <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-mono tracking-wider uppercase py-1 px-3.5 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none shadow-md">
        WhatsApp Live
      </span>
    </a>
  );
}
