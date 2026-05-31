import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, AlertTriangle, CheckCircle } from "lucide-react";
import { ContactInfo } from "../types";

interface ContactProps {
  info: ContactInfo;
}

export default function Contact({ info }: ContactProps) {
  // Form values state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Sending status
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error" | ""; text: string }>({
    status: "",
    text: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset feedback
    setFeedback({ status: "", text: "" });

    // Client side quick validates
    if (!name.trim()) return setFeedback({ status: "error", text: "Please provide a name." });
    if (!email.trim() || !email.includes("@")) return setFeedback({ status: "error", text: "Please enter a valid email address." });
    if (!subject.trim()) return setFeedback({ status: "error", text: "Please provide a subject." });
    if (!message.trim() || message.trim().length < 10) return setFeedback({ status: "error", text: "Please enter a message (min 10 characters)." });

    setLoading(true);

    try {
      const response = await fetch("/api/contact/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit message. Please try again.");
      }

      setFeedback({
        status: "success",
        text: resData.message || "Your message has been sent successfully! Abu Shaif Khan will get back to you shortly.",
      });

      // Reset fields
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (e: any) {
      setFeedback({
        status: "error",
        text: e.message || "An unexpected network error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-6 relative border-t border-white/10">
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <div className="text-center mb-16 select-none">
        <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-3 font-bold">
          // SERVICE INTAKE
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
          Get In Touch
        </h2>
        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
        <p className="text-gray-400 max-w-xl text-xs sm:text-sm mx-auto leading-relaxed">
          Interested in enhancing your networking systems? Message me using the form below, and let's configure your secure infrastructures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto relative z-10">
        {/* Contact info column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-center h-full space-y-8 shadow-xl">
            <h3 className="font-display font-bold text-xl text-white tracking-wide border-b border-white/10 pb-4">
              Contact Info
            </h3>

            {/* Address Items */}
            <div className="space-y-6">
              {/* Mail */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase text-gray-500">// Email Address:</span>
                  <a
                    id="link-contact-email"
                    href={`mailto:${info.email}`}
                    className="text-sm font-sans font-medium text-gray-200 hover:text-blue-400 transition-colors"
                  >
                    {info.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase text-gray-500">// Phone:</span>
                  <a
                    id="link-contact-phone"
                    href={`tel:${info.phone}`}
                    className="text-sm font-sans font-medium text-gray-200 hover:text-blue-400 transition-colors"
                  >
                    {info.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase text-gray-500">// Location:</span>
                  <span className="text-sm font-sans font-medium text-gray-200">
                    {info.location}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA info */}
            <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4 font-mono text-xs text-blue-400 leading-relaxed block shadow-inner">
              <span className="font-semibold text-white block mb-1">⚡ Quick Routing Option:</span>
              Instant messaging is active. You can trigger direct WhatsApp dialogue with my floating bottom widget at any hour.
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
            <h3 className="font-display font-bold text-xl text-white tracking-wide mb-6">
              Send Your Queries...
            </h3>

            {/* Form alerts feedback block */}
            {feedback.text && (
              <div
                id="contact-form-feedback"
                className={`flex gap-2.5 items-start p-4 rounded-lg text-xs leading-relaxed mb-6 font-mono border ${
                  feedback.status === "success"
                    ? "bg-green-500/10 border-green-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {feedback.status === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <div>{feedback.text}</div>
              </div>
            )}

            {/* Form entry */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="contact-name" className="text-glow text-[11px] font-mono uppercase text-gray-400 block">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-gray-200 text-sm font-sans focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="contact-email" className="text-glow text-[11px] font-mono uppercase text-gray-400 block">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jdoe@domain.com"
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-gray-200 text-sm font-sans focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="contact-subject" className="text-glow text-[11px] font-mono uppercase text-gray-400 block">
                  Message Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Network Audit Quotation"
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-gray-200 text-sm font-sans focus:outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="contact-message" className="text-glow text-[11px] font-mono uppercase text-gray-400 block">
                  Secure Message Cipher
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message details here..."
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-gray-200 text-sm font-sans focus:outline-none transition-all resize-y min-h-[100px]"
                />
              </div>

              {/* Send Button */}
              <button
                id="btn-contact-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-mono text-xs font-bold tracking-wider uppercase rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-blue-900/20"
              >
                {loading ? (
                  "Sending Message..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
