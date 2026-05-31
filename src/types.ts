export interface HeroData {
  name: string;
  title: string;
  tagline: string;
  description: string;
  photoUrl: string;
  resumeUrl?: string;
  counters: {
    experience: string;
    projects: string;
    deployments: string;
    uptime: string;
  };
  socials: {
    linkedin: string;
    github: string;
    facebook: string;
    email: string;
  };
}

export type SkillCategory =
  | "Networking"
  | "System Administration"
  | "Cloud Technologies"
  | "Firewall"
  | "Virtualization"
  | "Monitoring & Tools"
  | "Programming Languages"
  | "Data Analysis"
  | "AI Tools";

export interface SkillItem {
  id: string;
  category: SkillCategory;
  name: string;
  level: number; // 0-100
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string; // e.g. "Present" or "2024"
  responsibilities: string[];
  technologies: string[];
  documentUrl?: string;
  logo?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  description: string;
  documentUrl?: string;
  logo?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string; // Optional field
  credentialId: string;
  verifyUrl: string;
  badgeImage?: string; // custom or preselected SVG key
  documentUrl?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface PortfolioData {
  hero: HeroData;
  skills: SkillItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  contact: ContactInfo;
}
