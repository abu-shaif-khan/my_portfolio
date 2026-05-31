import React, { useState } from "react";
import { motion } from "motion/react";
import { Wifi, Terminal, Cloud, ShieldAlert, Cpu, Activity, Server, Sliders, Code, BarChart2, Brain } from "lucide-react";
import { SkillItem, SkillCategory } from "../types";

interface SkillsProps {
  skillsList: SkillItem[];
}

export default function Skills({ skillsList }: SkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "All">("All");

  // Map category to Lucide Icon
  const getCategoryIcon = (category: SkillCategory) => {
    switch (category) {
      case "Networking":
        return Wifi;
      case "System Administration":
        return Terminal;
      case "Cloud Technologies":
        return Cloud;
      case "Firewall":
        return ShieldAlert;
      case "Virtualization":
        return Cpu;
      case "Monitoring & Tools":
        return Activity;
      case "Programming Languages":
        return Code;
      case "Data Analysis":
        return BarChart2;
      case "AI Tools":
        return Brain;
      default:
        return Server;
    }
  };

  const categories: (SkillCategory | "All")[] = [
    "All",
    "Networking",
    "System Administration",
    "Cloud Technologies",
    "Firewall",
    "Virtualization",
    "Monitoring & Tools",
    "Programming Languages",
    "Data Analysis",
    "AI Tools",
  ];

  // Group dynamic list by Category
  const groupedCategories: { [key in SkillCategory]?: SkillItem[] } = {};
  skillsList.forEach((skill) => {
    if (!groupedCategories[skill.category]) {
      groupedCategories[skill.category] = [];
    }
    groupedCategories[skill.category]?.push(skill);
  });

  const displayedCategories = Object.keys(groupedCategories) as SkillCategory[];

  return (
    <section id="skills" className="py-24 max-w-7xl mx-auto px-6 border-b border-white/10 relative">
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 select-none">
        <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-3 font-bold">
          // INFRASTRUCTURE COMPETENCY
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
          Core Technical Skills
        </h2>
        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
        <p className="text-gray-400 max-w-xl text-xs sm:text-sm mx-auto leading-relaxed">
          Comprehensive expertise across modern network engineering stacks, cloud server clusters, secure tunnels, and system monitoring engines.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
        {categories.map((cat, idx) => {
          const Icon = cat === "All" ? Sliders : getCategoryIcon(cat);
          return (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-wider transition-all border ${
                selectedCategory === cat
                  ? "bg-blue-600 border-blue-600 text-white shadow-md"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Skill Cards Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCategories
          .filter((cat) => selectedCategory === "All" || selectedCategory === cat)
          .map((cat, catIdx) => {
            const CategoryIcon = getCategoryIcon(cat);
            const skillsInCat = groupedCategories[cat] || [];
            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.05 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-start hover:border-blue-500/50 transition-colors"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                  <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-500">
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white tracking-wide">
                      {cat}
                    </h3>
                  </div>
                </div>

                {/* Skills list as tag badges without competence level and progress bars */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsInCat.map((item) => (
                    <span
                      key={item.id}
                      className="px-3 py-1.5 bg-black/40 rounded-lg text-xs border border-white/5 text-gray-300 font-sans font-medium transition-colors hover:bg-black/60"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
      </div>
    </section>
  );
}
