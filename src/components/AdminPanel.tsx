import React, { useState, useEffect } from "react";
import {
  Terminal,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  User,
  Wifi,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Shield,
  MessageSquare,
  ChevronRight,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronDown,
  FileText
} from "lucide-react";
import { PortfolioData, HeroData, SkillItem, SkillCategory, ExperienceItem, EducationItem, CertificationItem, ContactInfo, ContactMessage } from "../types";

interface AdminPanelProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
  token: string | null;
  setToken: (token: string | null) => void;
  fetchPortfolio: () => Promise<void>;
}

type TabType = "hero" | "skills" | "experience" | "education" | "certifications" | "contact" | "messages" | "security";

const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS_LIST = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() + 5 - i).toString());

export default function AdminPanel({ portfolio, setPortfolio, token, setToken, fetchPortfolio }: AdminPanelProps) {
  // Authentication states
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Panel settings
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ status: "success" | "error" | ""; text: string }>({ status: "", text: "" });

  // Messages logs state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Security variables
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityFeedback, setSecurityFeedback] = useState({ success: "", error: "" });

  // Sub-items editor models
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<{ name: string; category: SkillCategory; level: number }>({
    name: "",
    category: "Networking",
    level: 80,
  });

  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilitiesText: string;
    technologiesText: string;
    documentUrl: string;
    logo: string;
  }>({
    title: "",
    company: "",
    location: "",
    startDate: `January ${new Date().getFullYear()}`,
    endDate: "Present",
    responsibilitiesText: "",
    technologiesText: "",
    documentUrl: "",
    logo: "",
  });

  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduForm, setEduForm] = useState<{
    degree: string;
    institution: string;
    location: string;
    year: string;
    description: string;
    documentUrl: string;
    logo: string;
  }>({
    degree: "",
    institution: "",
    location: "",
    year: "",
    description: "",
    documentUrl: "",
    logo: "",
  });

  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<{
    name: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    verifyUrl: string;
    badgeImage: string;
    documentUrl: string;
  }>({
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    verifyUrl: "",
    badgeImage: "cisco",
    documentUrl: "",
  });

  // Local modifications working copies
  const [heroForm, setHeroForm] = useState<HeroData>(portfolio.hero);
  const [contactForm, setContactForm] = useState<ContactInfo>(portfolio.contact);
  const [skillsList, setSkillsList] = useState<SkillItem[]>(portfolio.skills);
  const [expList, setExpList] = useState<ExperienceItem[]>(portfolio.experiences);
  const [eduList, setEduList] = useState<EducationItem[]>(portfolio.education);
  const [certsList, setCertsList] = useState<CertificationItem[]>(portfolio.certifications);

  // Synchronize dynamic updates when baseline moves
  useEffect(() => {
    setHeroForm(portfolio.hero);
    setContactForm(portfolio.contact);
    setSkillsList(portfolio.skills);
    setExpList(portfolio.experiences);
    setEduList(portfolio.education);
    setCertsList(portfolio.certifications);
  }, [portfolio]);

  // Read logs if admin is authenticated
  useEffect(() => {
    if (token) {
      loadMessages();
    }
  }, [token]);

  const loadMessages = async () => {
    if (!token) return;
    setMessagesLoading(true);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed loading messages");
      setMessages(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Submit password verify login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Login validation failed.");
      }

      setToken(json.token);
      localStorage.setItem("ask_portfolio_admin_token", json.token);
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("ask_portfolio_admin_token");
  };

  // Write dynamic modifications to global file database
  const handleSaveChangesAll = async (updatedPortfolio: PortfolioData) => {
    if (!token) return;
    setSaveLoading(true);
    setSaveFeedback({ status: "", text: "" });

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPortfolio),
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error("Invalid or expired session token. Logged out.");
      }

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to commit save payload.");
      }

      setPortfolio(updatedPortfolio);
      setSaveFeedback({ status: "success", text: "Database state completely synchronized!" });
      setTimeout(() => setSaveFeedback({ status: "", text: "" }), 3000);
    } catch (e: any) {
      setSaveFeedback({ status: "error", text: e.message || "An unexpected network error occurred." });
    } finally {
      setSaveLoading(false);
    }
  };

  // Base64 Local Image Upload Processor
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetType: "profile" | "badge" | "resume" | "certForm" | "expForm" | "eduForm" | "expLogo" | "eduLogo",
    extraId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File exceeds safety 5MB upload limit.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            data: base64Data,
          }),
        });

        if (response.status === 401) {
          handleLogout();
          throw new Error("Invalid or expired session token. Logged out.");
        }

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.error || "Upload rejected.");
        }

        if (targetType === "profile") {
          setHeroForm((prev) => {
            const next = { ...prev, photoUrl: resData.url };
            handleSaveChangesAll({ ...portfolio, hero: next });
            return next;
          });
        } else if (targetType === "resume") {
          setHeroForm((prev) => {
            const next = { ...prev, resumeUrl: resData.url };
            handleSaveChangesAll({ ...portfolio, hero: next });
            return next;
          });
        } else if (targetType === "badge" && extraId) {
          setCertsList((prev) => {
            const next = prev.map((c) => (c.id === extraId ? { ...c, badgeImage: resData.url } : c));
            handleSaveChangesAll({ ...portfolio, certifications: next });
            return next;
          });
        } else if (targetType === "certForm") {
          setCertForm((prev) => ({ ...prev, badgeImage: resData.url }));
        } else if (targetType === "expForm") {
          setExpForm((prev) => ({ ...prev, logo: resData.url }));
        } else if (targetType === "eduForm") {
          setEduForm((prev) => ({ ...prev, logo: resData.url }));
        } else if (targetType === "expLogo" && extraId) {
          setExpList((prev) => {
            const next = prev.map((exp) => (exp.id === extraId ? { ...exp, logo: resData.url } : exp));
            handleSaveChangesAll({ ...portfolio, experiences: next });
            return next;
          });
        } else if (targetType === "eduLogo" && extraId) {
          setEduList((prev) => {
            const next = prev.map((edu) => (edu.id === extraId ? { ...edu, logo: resData.url } : edu));
            handleSaveChangesAll({ ...portfolio, education: next });
            return next;
          });
        }
      } catch (err: any) {
        alert("Upload error: " + err.message);
      }
    };
  };

  // Message read controller
  const markMessageAsRead = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "read" as const } : m)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Message delete controller
  const deleteMessage = async (id: string) => {
    if (!token || !window.confirm("Are you sure you want to permanently delete this message inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Safe password changer
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityFeedback({ success: "", error: "" });
    if (!currentPassword || !newPassword) return;

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error("Invalid or expired session token. Logged out.");
      }

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Password change failed.");
      }

      setSecurityFeedback({ success: resData.message || "Password successfully changed!", error: "" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      setSecurityFeedback({ success: "", error: error.message });
    }
  };

  // SKILLS LOGIC
  const handleSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;

    const newSkill: SkillItem = {
      id: "skill-" + Date.now(),
      category: skillForm.category,
      name: skillForm.name.trim(),
      level: Number(skillForm.level),
    };

    const nextSkills = [...skillsList, newSkill];
    setSkillsList(nextSkills);
    setSkillForm({ name: "", category: "Networking", level: 80 });
    handleSaveChangesAll({ ...portfolio, skills: nextSkills });
  };

  const handleSkillDelete = (id: string) => {
    const nextSkills = skillsList.filter((s) => s.id !== id);
    setSkillsList(nextSkills);
    handleSaveChangesAll({ ...portfolio, skills: nextSkills });
  };

  const handleSkillUpdate = (id: string, updatedName: string, updatedLevel: number) => {
    const nextSkills = skillsList.map((s) => (s.id === id ? { ...s, name: updatedName, level: updatedLevel } : s));
    setSkillsList(nextSkills);
    setEditingSkillId(null);
    handleSaveChangesAll({ ...portfolio, skills: nextSkills });
  };

  // EXPERIENCE LOGIC
  const handleExpAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.title.trim() || !expForm.company.trim()) return;

    const responsibilities = expForm.responsibilitiesText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
    const technologies = expForm.technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let nextExp;
    if (editingExpId) {
      nextExp = expList.map((exp) =>
        exp.id === editingExpId
          ? {
              ...exp,
              title: expForm.title.trim(),
              company: expForm.company.trim(),
              location: expForm.location.trim() || "Dhaka, Bangladesh",
              startDate: expForm.startDate.trim() || "2024",
              endDate: expForm.endDate.trim() || "Present",
              responsibilities,
              technologies,
              documentUrl: expForm.documentUrl.trim() || undefined,
              logo: expForm.logo || undefined,
            }
          : exp
      );
      setEditingExpId(null);
    } else {
      const newExp: ExperienceItem = {
        id: "exp-" + Date.now(),
        title: expForm.title.trim(),
        company: expForm.company.trim(),
        location: expForm.location.trim() || "Dhaka, Bangladesh",
        startDate: expForm.startDate.trim() || "2024",
        endDate: expForm.endDate.trim() || "Present",
        responsibilities,
        technologies,
        documentUrl: expForm.documentUrl.trim() || undefined,
        logo: expForm.logo || undefined,
      };
      nextExp = [...expList, newExp];
    }

    setExpList(nextExp);
    setExpForm({
      title: "",
      company: "",
      location: "",
      startDate: `January ${new Date().getFullYear()}`,
      endDate: "Present",
      responsibilitiesText: "",
      technologiesText: "",
      documentUrl: "",
      logo: "",
    });
    handleSaveChangesAll({ ...portfolio, experiences: nextExp });
  };

  const handleExpStartEdit = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setExpForm({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      responsibilitiesText: exp.responsibilities.join("\n"),
      technologiesText: exp.technologies.join(", "),
      documentUrl: exp.documentUrl || "",
      logo: exp.logo || "",
    });
    document.getElementById("exp-form-container")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExpCancelEdit = () => {
    setEditingExpId(null);
    setExpForm({
      title: "",
      company: "",
      location: "",
      startDate: `January ${new Date().getFullYear()}`,
      endDate: "Present",
      responsibilitiesText: "",
      technologiesText: "",
      documentUrl: "",
      logo: "",
    });
  };

  const handleExpDelete = (id: string) => {
    const nextExp = expList.filter((e) => e.id !== id);
    setExpList(nextExp);
    handleSaveChangesAll({ ...portfolio, experiences: nextExp });
    if (editingExpId === id) {
      handleExpCancelEdit();
    }
  };

  // EDUCATION LOGIC
  const handleEduAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) return;

    let nextEdu;
    if (editingEduId) {
      nextEdu = eduList.map((edu) =>
        edu.id === editingEduId
          ? {
              ...edu,
              degree: eduForm.degree.trim(),
              institution: eduForm.institution.trim(),
              location: eduForm.location.trim() || "Dhaka, Bangladesh",
              year: eduForm.year.trim() || "2024",
              description: eduForm.description.trim(),
              documentUrl: eduForm.documentUrl.trim() || undefined,
              logo: eduForm.logo || undefined,
            }
          : edu
      );
      setEditingEduId(null);
    } else {
      const newEdu: EducationItem = {
        id: "edu-" + Date.now(),
        degree: eduForm.degree.trim(),
        institution: eduForm.institution.trim(),
        location: eduForm.location.trim() || "Dhaka, Bangladesh",
        year: eduForm.year.trim() || "2024",
        description: eduForm.description.trim(),
        documentUrl: eduForm.documentUrl.trim() || undefined,
        logo: eduForm.logo || undefined,
      };
      nextEdu = [...eduList, newEdu];
    }

    setEduList(nextEdu);
    setEduForm({ degree: "", institution: "", location: "", year: "", description: "", documentUrl: "", logo: "" });
    handleSaveChangesAll({ ...portfolio, education: nextEdu });
  };

  const handleEduStartEdit = (edu: EducationItem) => {
    setEditingEduId(edu.id);
    setEduForm({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      year: edu.year,
      description: edu.description,
      documentUrl: edu.documentUrl || "",
      logo: edu.logo || "",
    });
    document.getElementById("edu-form-container")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEduCancelEdit = () => {
    setEditingEduId(null);
    setEduForm({ degree: "", institution: "", location: "", year: "", description: "", documentUrl: "", logo: "" });
  };

  const handleEduDelete = (id: string) => {
    const nextEdu = eduList.filter((e) => e.id !== id);
    setEduList(nextEdu);
    handleSaveChangesAll({ ...portfolio, education: nextEdu });
    if (editingEduId === id) {
      handleEduCancelEdit();
    }
  };

  // CERTIFICATIONS LOGIC
  const handleCertAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.name.trim() || !certForm.issuer.trim()) return;

    let nextCerts;
    if (editingCertId) {
      nextCerts = certsList.map((c) =>
        c.id === editingCertId
          ? {
              ...c,
              name: certForm.name.trim(),
              issuer: certForm.issuer.trim(),
              issueDate: certForm.issueDate.trim() || new Date().toISOString().split("T")[0],
              expiryDate: undefined,
              credentialId: certForm.credentialId.trim() || "N/A",
              verifyUrl: certForm.verifyUrl.trim() || "",
              badgeImage: certForm.badgeImage,
              documentUrl: certForm.documentUrl.trim() || undefined,
            }
          : c
      );
      setEditingCertId(null);
    } else {
      const newCert: CertificationItem = {
        id: "cert-" + Date.now(),
        name: certForm.name.trim(),
        issuer: certForm.issuer.trim(),
        issueDate: certForm.issueDate.trim() || new Date().toISOString().split("T")[0],
        expiryDate: undefined,
        credentialId: certForm.credentialId.trim() || "N/A",
        verifyUrl: certForm.verifyUrl.trim() || "",
        badgeImage: certForm.badgeImage,
        documentUrl: certForm.documentUrl.trim() || undefined,
      };
      nextCerts = [...certsList, newCert];
    }

    setCertsList(nextCerts);
    setCertForm({
      name: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      verifyUrl: "",
      badgeImage: "cisco",
      documentUrl: "",
    });
    handleSaveChangesAll({ ...portfolio, certifications: nextCerts });
  };

  const handleCertStartEdit = (cert: CertificationItem) => {
    setEditingCertId(cert.id);
    setCertForm({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialId: cert.credentialId,
      verifyUrl: cert.verifyUrl,
      badgeImage: cert.badgeImage || "cisco",
      documentUrl: cert.documentUrl || "",
    });
    document.getElementById("cert-form-container")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCertCancelEdit = () => {
    setEditingCertId(null);
    setCertForm({
      name: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      verifyUrl: "",
      badgeImage: "cisco",
      documentUrl: "",
    });
  };

  const handleCertDelete = (id: string) => {
    const nextCerts = certsList.filter((c) => c.id !== id);
    setCertsList(nextCerts);
    handleSaveChangesAll({ ...portfolio, certifications: nextCerts });
    if (editingCertId === id) {
      handleCertCancelEdit();
    }
  };

  // Login View Renderer
  if (!token) {
    return (
      <section className="min-h-screen pt-36 pb-24 flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 network-grid opacity-10 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8 select-none">
            <div className="inline-flex p-3.5 bg-blue-600/10 text-blue-500 rounded-full border border-blue-600/20 mb-4 animate-pulse">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white tracking-wide">
              Secure Terminal Auth
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-2">
              // INPUT CREDENTIAL DIAGNOSTICS KEY
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div
                id="login-auth-error"
                className="bg-red-550/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-4 rounded font-mono text-left"
              >
                * ERR: {loginError}
              </div>
            )}

            <div className="space-y-1.5 text-left relative">
              <label htmlFor="auth-password" className="text-glow text-[11px] font-mono tracking-wider uppercase text-gray-400">
                Security Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator secret"
                  disabled={loginLoading}
                  className="w-full pl-10 pr-12 py-3 bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-gray-200 text-sm focus:outline-none transition-colors font-mono"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
                <button
                  type="button"
                  id="btn-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="transparent absolute right-3.5 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password label description */}
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              disabled={loginLoading || !password}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-lg shadow-lg hover:shadow-blue-900/20 cursor-pointer"
            >
              {loginLoading ? "Opening Secure Socket..." : "Verify Authorization Key"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Count unreads list
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  const startParts = (expForm.startDate || "").split(" ");
  const defaultStartMonth = MONTHS_LIST.includes(startParts[0]) ? startParts[0] : "January";
  const defaultStartYear = startParts[1] || startParts[0] || new Date().getFullYear().toString();

  const isPresent = (expForm.endDate || "").toLowerCase() === "present";
  const endParts = isPresent ? [] : (expForm.endDate || "").split(" ");
  const defaultEndMonth = MONTHS_LIST.includes(endParts[0]) ? endParts[0] : "January";
  const defaultEndYear = endParts[1] || endParts[0] || new Date().getFullYear().toString();

  const adminTabs: { id: TabType; label: string; icon: any; badge?: number }[] = [
    { id: "hero", label: "Home Info", icon: User },
    { id: "skills", label: "Technical Skills", icon: Wifi },
    { id: "experience", label: "Experience Logs", icon: Briefcase },
    { id: "education", label: "Academia Degrees", icon: GraduationCap },
    { id: "certifications", label: "Security Certs", icon: Award },
    { id: "contact", label: "Contact Coordinates", icon: Mail },
    { id: "messages", label: "User Inquiry Logs", icon: MessageSquare, badge: unreadCount },
    { id: "security", label: "Session Security", icon: Shield },
  ];

  return (
    <section className="min-h-screen pt-28 pb-24 px-6 max-w-7xl mx-auto">
      <div className="absolute inset-0 network-grid opacity-5 pointer-events-none" />

      {/* Control Panel Header bar */}
      <div className="bg-[#0e1117] border border-white/5 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glow-blue">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-ping"></span>
            <span className="font-mono text-[10px] text-brand-success uppercase tracking-wider font-semibold">
              ADMIN SOCKET ESTABLISHED
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-wide mt-1">
            Dynamic Control Dashboard
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">// PORTFOLIO CONTENT ENGINE DIRECTIVES</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {saveFeedback.text && (
            <span
              id="admin-save-top-feedback"
              className={`text-[11px] font-mono py-1.5 px-3.5 rounded border ${
                saveFeedback.status === "success"
                  ? "bg-brand-success/5 border-brand-success/20 text-brand-success"
                  : "bg-red-500/5 border-red-500/20 text-red-400"
              }`}
            >
              • {saveFeedback.text}
            </span>
          )}

          <button
            id="btn-admin-logout"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white rounded-lg font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Wipe Session Token
          </button>
        </div>
      </div>

      {/* Main Panel Content split rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-[#0e1117] border border-white/5 rounded-xl p-4 shadow-xl">
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest px-3 mb-2 block">// MODULE DIRECTORS:</span>

          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left font-sans text-xs font-semibold py-3 px-4 rounded-lg flex items-center justify-between border transition-all ${
                activeTab === tab.id
                  ? "bg-brand-navy border-brand-accent/50 text-white"
                  : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-brand-accent" : "text-gray-500"}`} />
                <span>{tab.label}</span>
              </div>
              {tab.badge !== undefined && tab.badge > 0 ? (
                <span className="bg-red-500 text-white text-[9px] font-mono leading-none py-1 px-2 rounded-full font-bold shadow animate-pulse">
                  {tab.badge}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Module display box */}
        <div className="lg:col-span-9 bg-[#0e1117]/80 backdrop-blur-sm border border-white/5 rounded-xl p-8 glow-blue min-h-[500px]">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>Manage Home Hero Section</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">// TARGET: PORTFOLIO.HERO</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Avatar editor */}
                <div className="bg-brand-black/50 border border-white/5 p-6 rounded-xl flex flex-col items-center justify-center space-y-4">
                  {heroForm.photoUrl ? (
                    <img
                      src={heroForm.photoUrl}
                      alt="Abu Shaif Khan Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-brand-accent"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-[#111827] border border-white/5 flex flex-col items-center justify-center text-gray-500 font-mono text-[10px] font-semibold text-center select-none">
                      NO CUSTOM<br />IMAGESET
                    </div>
                  )}

                  <div className="text-center">
                    <label className="px-4 py-2 bg-brand-navy border border-brand-accent/20 hover:border-brand-accent text-blue-300 hover:text-white font-mono text-xs rounded-lg cursor-pointer inline-block transition-colors">
                      <Plus className="w-3.5 h-3.5 inline mr-1.5" />
                      Browse Portfolio Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "profile")}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[9px] text-gray-500 font-mono block mt-2">
                      Upload portrait (JPG, PNG, WEBP). Max size 5MB.
                    </span>
                  </div>
                </div>

                {/* Meta details form details */}
                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="hero-edit-name" className="text-[11px] font-mono text-gray-400 block uppercase">Specialist Full Name</label>
                    <input
                      id="hero-edit-name"
                      type="text"
                      className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none"
                      value={heroForm.name}
                      onChange={(e) => setHeroForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="hero-edit-title" className="text-[11px] font-mono text-gray-400 block uppercase">Professional Designation</label>
                    <input
                      id="hero-edit-title"
                      type="text"
                      className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="hero-edit-tagline" className="text-[11px] font-mono text-gray-400 block uppercase">Slogan Slices / Tagline</label>
                    <input
                      id="hero-edit-tagline"
                      type="text"
                      className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none"
                      value={heroForm.tagline}
                      onChange={(e) => setHeroForm((prev) => ({ ...prev, tagline: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Description text */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="hero-edit-description" className="text-[11px] font-mono text-gray-400 block uppercase">Profile Narrative Introduction</label>
                <textarea
                  id="hero-edit-description"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none resize-y min-h-[100px]"
                  value={heroForm.description}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* PDF Resume Management Column */}
              <div className="border-t border-white/5 pt-5 space-y-4">
                <h3 className="font-mono text-xs text-gray-400 uppercase tracking-wider">// RESUME / CV DOCUMENT LINK:</h3>
                <div className="bg-brand-black/50 border border-white/5 p-6 rounded-xl space-y-4">
                  <div className="text-left space-y-1.5">
                    <label htmlFor="hero-edit-resume-url" className="text-[11px] font-mono text-gray-400 block uppercase">Google Drive or Web CV Link</label>
                    <input
                      id="hero-edit-resume-url"
                      type="url"
                      placeholder="e.g. https://drive.google.com/file/d/.../view?usp=sharing"
                      className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-xs text-gray-200 outline-none"
                      value={heroForm.resumeUrl || ""}
                      onChange={(e) => setHeroForm((prev) => ({ ...prev, resumeUrl: e.target.value }))}
                    />
                    <p className="text-[11px] text-gray-500">
                      Provide a public Google Drive, Dropbox, or Web PDF link. Clicking "Get Resume" on your main portfolio will load this link in a new browser tab.
                    </p>
                    {heroForm.resumeUrl && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono text-green-400 font-semibold bg-green-500/10 px-2 py-1 rounded">
                          ✓ Custom Resume Link Configured
                        </span>
                        <a
                          href={heroForm.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 underline hover:text-blue-300 font-mono flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Test/Verify Link
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Channels row */}
              <div className="border-t border-white/5 pt-5 space-y-4">
                <h3 className="font-mono text-xs text-gray-400 uppercase tracking-wider">// SOCIAL INTERFACE CORDS:</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">LinkedIn URL</span>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-brand-black/50 border border-white/5 rounded text-xs text-gray-200"
                      value={heroForm.socials.linkedin}
                      onChange={(e) =>
                        setHeroForm((prev) => ({
                          ...prev,
                          socials: { ...prev.socials, linkedin: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">GitHub Profile</span>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-brand-black/50 border border-white/5 rounded text-xs text-gray-200"
                      value={heroForm.socials.github}
                      onChange={(e) =>
                        setHeroForm((prev) => ({
                          ...prev,
                          socials: { ...prev.socials, github: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Public email</span>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-brand-black/50 border border-white/5 rounded text-xs text-gray-200"
                      value={heroForm.socials.email}
                      onChange={(e) =>
                        setHeroForm((prev) => ({
                          ...prev,
                          socials: { ...prev.socials, email: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Commit Button */}
              <button
                id="btn-save-hero"
                disabled={saveLoading}
                onClick={() => handleSaveChangesAll({ ...portfolio, hero: heroForm })}
                className="px-5 py-3 bg-brand-accent hover:bg-blue-600 rounded-lg text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saveLoading ? "Synchronizing..." : "Serialize Hero State"}
              </button>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>Manage Skills Database</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">// TARGET: PORTFOLIO.SKILLS</span>
              </h2>

              {/* Form to insert new skill */}
              <form onSubmit={handleSkillAdd} className="bg-brand-black/50 border border-white/5 p-5 rounded-xl space-y-4">
                <span className="font-mono text-[10px] text-brand-accent block uppercase tracking-wide">
                  + Add Tech Comp Directive:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="skill-add-name" className="text-[10px] font-mono text-gray-400 uppercase">Skill Name</label>
                    <input
                      id="skill-add-name"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs focus:border-brand-accent outline-none text-gray-200"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Cisco Nexus, BGP"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="skill-add-category" className="text-[10px] font-mono text-gray-400 uppercase">Category Track</label>
                    <select
                      id="skill-add-category"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 focus:border-brand-accent outline-none"
                      value={skillForm.category}
                      onChange={(e) => setSkillForm((prev) => ({ ...prev, category: e.target.value as SkillCategory }))}
                    >
                      <option value="Networking">Networking</option>
                      <option value="System Administration">System Administration</option>
                      <option value="Cloud Technologies">Cloud Technologies</option>
                      <option value="Firewall">Firewall</option>
                      <option value="Virtualization">Virtualization</option>
                      <option value="Monitoring & Tools">Monitoring & Tools</option>
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="AI Tools">AI Tools</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-skills-add-submit"
                  className="py-2.5 px-4 bg-brand-accent hover:bg-blue-600 text-white font-mono text-xs font-semibold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Plus className="w-4 h-4" /> Insert Competency Node
                </button>
              </form>

              {/* Skills list table list layout */}
              <div className="bg-brand-black/35 border border-white/5 rounded-xl overflow-hidden mt-6">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest px-4 py-3 block border-b border-white/5">// CURRENT VERIFIED NODES:</span>

                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                  {skillsList.map((skill) => {
                    const isEditing = editingSkillId === skill.id;

                    return (
                      <div key={skill.id} className="p-4 flex items-center justify-between gap-4">
                        {isEditing ? (
                          // Editing rows
                          <div className="flex flex-1 flex-col sm:flex-row gap-3">
                            <input
                              type="text"
                              defaultValue={skill.name}
                              id={`skill-edit-name-${skill.id}`}
                              className="flex-1 bg-brand-black border border-brand-accent/50 rounded px-2.5 py-1 text-xs text-white outline-none"
                            />
                            <div className="flex gap-1">
                              <button
                                type="button"
                                id={`btn-skill-save-${skill.id}`}
                                onClick={() => {
                                  const nameEl = document.getElementById(`skill-edit-name-${skill.id}`) as HTMLInputElement;
                                  if (nameEl) {
                                    handleSkillUpdate(skill.id, nameEl.value, skill.level);
                                  }
                                }}
                                className="p-1 px-2.5 bg-brand-success/15 hover:bg-brand-success text-brand-success hover:text-white rounded text-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingSkillId(null)}
                                className="p-1 px-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Normal rows view
                          <>
                            <div className="text-left">
                              <span className="bg-brand-navy/60 text-blue-300 font-mono text-[9px] px-2 py-0.5 rounded border border-brand-accent/15 mr-2">
                                {skill.category}
                              </span>
                              <span className="text-sm font-sans font-semibold text-gray-200">{skill.name}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* Action tools */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  id={`btn-skill-editing-trigger-${skill.id}`}
                                  onClick={() => setEditingSkillId(skill.id)}
                                  className="p-1.5 hover:bg-brand-navy text-blue-400 rounded"
                                  title="Edit Skill Details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  id={`btn-skill-delete-${skill.id}`}
                                  onClick={() => handleSkillDelete(skill.id)}
                                  className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"
                                  title="Remove Skill Node"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {activeTab === "experience" && (
            <div id="exp-form-container" className="scroll-mt-24 space-y-6">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>Manage Professional Experience</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">// TARGET: PORTFOLIO.EXPERIENCES</span>
              </h2>

              {/* Form to insert experience */}
              <form onSubmit={handleExpAdd} className="bg-brand-black/50 border border-white/5 p-5 rounded-xl space-y-4">
                <span className="font-mono text-[10px] text-brand-accent block uppercase tracking-wide">
                  {editingExpId ? "✏️ Edit Professional Experience Node:" : "+ Add Professional Experience:"}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label htmlFor="exp-add-title" className="text-[10px] font-mono text-gray-400 uppercase">Job Title</label>
                    <input
                      id="exp-add-title"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={expForm.title}
                      onChange={(e) => setExpForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Senior Network Architect"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="exp-add-company" className="text-[10px] font-mono text-gray-400 uppercase">Company Name</label>
                    <input
                      id="exp-add-company"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={expForm.company}
                      onChange={(e) => setExpForm((prev) => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Cisco Systems, BD Networks"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Start Date</span>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        id="exp-add-startMonth"
                        className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent cursor-pointer"
                        value={defaultStartMonth}
                        onChange={(e) => {
                          const newMonth = e.target.value;
                          setExpForm((prev) => ({ ...prev, startDate: `${newMonth} ${defaultStartYear}` }));
                        }}
                      >
                        {MONTHS_LIST.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select
                        id="exp-add-startYear"
                        className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent cursor-pointer"
                        value={defaultStartYear}
                        onChange={(e) => {
                          const newYear = e.target.value;
                          setExpForm((prev) => ({ ...prev, startDate: `${defaultStartMonth} ${newYear}` }));
                        }}
                      >
                        {YEARS_LIST.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">End Date</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-mono text-brand-accent select-none">
                        <input
                          type="checkbox"
                          checked={isPresent}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExpForm((prev) => ({ ...prev, endDate: "Present" }));
                            } else {
                              setExpForm((prev) => ({ ...prev, endDate: `${defaultEndMonth} ${defaultEndYear}` }));
                            }
                          }}
                          className="rounded bg-brand-black border border-white/10 text-brand-accent focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                        />
                        <span>Currently Employed</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        id="exp-add-endMonth"
                        disabled={isPresent}
                        className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        value={defaultEndMonth}
                        onChange={(e) => {
                          const newMonth = e.target.value;
                          setExpForm((prev) => ({ ...prev, endDate: `${newMonth} ${defaultEndYear}` }));
                        }}
                      >
                        {MONTHS_LIST.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select
                        id="exp-add-endYear"
                        disabled={isPresent}
                        className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        value={defaultEndYear}
                        onChange={(e) => {
                          const newYear = e.target.value;
                          setExpForm((prev) => ({ ...prev, endDate: `${defaultEndMonth} ${newYear}` }));
                        }}
                      >
                        {YEARS_LIST.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label htmlFor="exp-add-location" className="text-[10px] font-mono text-gray-400 uppercase">Corporate Location</label>
                    <input
                      id="exp-add-location"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={expForm.location}
                      onChange={(e) => setExpForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Dhaka, Bangladesh"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="exp-add-technologiesText" className="text-[10px] font-mono text-gray-400 uppercase">Technologies (comma separated)</label>
                    <input
                      id="exp-add-technologiesText"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={expForm.technologiesText}
                      onChange={(e) => setExpForm((prev) => ({ ...prev, technologiesText: e.target.value }))}
                      placeholder="e.g. Cisco, Fortinet, Wireshark, active-directory"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="exp-add-documentUrl" className="text-[10px] font-mono text-gray-400 uppercase">Google Drive / Reference Document URL</label>
                  <input
                    id="exp-add-documentUrl"
                    type="url"
                    className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent animate-pulse-slow"
                    value={expForm.documentUrl}
                    onChange={(e) => setExpForm((prev) => ({ ...prev, documentUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  />
                  <span className="text-[10px] text-gray-500 block font-mono">
                    Add a public shareable Google Drive, Dropbox, or Web document link to back your credentials.
                  </span>
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="exp-add-responsibilitiesText" className="text-[10px] font-mono text-gray-400 uppercase">Responsibilities (One line per bullet)</label>
                  <textarea
                    id="exp-add-responsibilitiesText"
                    rows={3}
                    className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none resize-y focus:border-brand-accent"
                    value={expForm.responsibilitiesText}
                    onChange={(e) => setExpForm((prev) => ({ ...prev, responsibilitiesText: e.target.value }))}
                    placeholder="Designed secure corporate subnets.&#10;Hardened AD firewall interfaces."
                  />
                </div>

                {/* Upload company logo section */}
                <div className="bg-brand-black/40 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-left">
                  <div className="shrink-0">
                    {expForm.logo && (
                      expForm.logo.startsWith("/") ||
                      expForm.logo.startsWith("data:image/") ||
                      expForm.logo.startsWith("http://") ||
                      expForm.logo.startsWith("https://")
                    ) ? (
                      <img 
                        src={expForm.logo} 
                        alt="Logo Preview" 
                        className="w-12 h-12 rounded-xl object-contain border border-white/10 bg-white p-1 animate-fade-in"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#111827] border border-white/5 flex items-center justify-center text-brand-accent font-mono text-[9px] font-bold">
                        NO LOGO
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block">Upload Company Logo</span>
                    <label className="px-3 py-1.5 bg-brand-navy hover:bg-brand-navy/85 border border-brand-accent/20 hover:border-brand-accent text-blue-300 hover:text-white font-mono text-[11px] rounded cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Choose Image (SVG, PNG, JPG, JPEG)
                      <input
                        type="file"
                        accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                        onChange={(e) => handleFileUpload(e, "expForm")}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[9px] text-gray-500 font-mono block">
                      Selecting an image automatically uploads it and sets it as the company's custom logo.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3.5">
                  {editingExpId && (
                    <button
                      type="button"
                      onClick={handleExpCancelEdit}
                      className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs font-semibold uppercase rounded-lg cursor-pointer transition-all border border-white/5"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    id="btn-exp-add-submit"
                    className="py-2.5 px-4 bg-brand-accent hover:bg-blue-600 text-white font-mono text-xs font-semibold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {editingExpId ? (
                      <>
                        <Check className="w-4 h-4" /> Save Experience Node
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Insert Experience Node
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Experiences lists - Displayed in Stack (LIFO) order */}
              <div className="space-y-4 mt-6">
                {[...expList].reverse().map((exp) => (
                  <div key={exp.id} className="bg-brand-black/30 border border-white/5 rounded-xl p-5 relative flex flex-col justify-between">
                    {/* Top detail pane */}
                    <div className="flex justify-between items-start text-left mb-3">
                      <div className="flex gap-4">
                        {exp.logo && (
                          exp.logo.startsWith("/") ||
                          exp.logo.startsWith("data:image/") ||
                          exp.logo.startsWith("http://") ||
                          exp.logo.startsWith("https://")
                        ) ? (
                          <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
                            <img 
                              src={exp.logo} 
                              alt={`${exp.company} Logo`} 
                              className="w-12 h-12 rounded-xl object-contain border border-white/10 bg-white p-1 scroll-mt-24"
                              referrerPolicy="no-referrer"
                            />
                            <label className="text-[9px] text-blue-400 hover:text-white font-mono cursor-pointer bg-blue-500/5 hover:bg-blue-600/10 px-1.5 py-0.5 rounded border border-blue-500/10 transition-colors">
                              Change
                              <input
                                type="file"
                                accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                                onChange={(e) => handleFileUpload(e, "expLogo", exp.id)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-500 flex items-center justify-center">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <label className="text-[9px] text-blue-400 hover:text-white font-mono cursor-pointer bg-blue-500/5 hover:bg-blue-600/10 px-1.5 py-0.5 rounded border border-blue-500/10 transition-colors">
                              Upload
                              <input
                                type="file"
                                accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                                onChange={(e) => handleFileUpload(e, "expLogo", exp.id)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                        <div>
                          <h4 className="font-sans font-bold text-base text-white">{exp.title}</h4>
                          <span className="text-xs text-brand-accent font-mono">{exp.company}</span>
                          <div className="text-[10px] font-mono text-gray-500 mt-1">
                            {exp.location} | {exp.startDate} - {exp.endDate}
                          </div>
                          {exp.documentUrl && (
                            <div className="text-[10px] font-mono text-blue-400 mt-1.5 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded w-fit">
                              <span>📄 Link:</span>
                              <a href={exp.documentUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[240px]">
                                {exp.documentUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          id={`btn-exp-edit-${exp.id}`}
                          onClick={() => handleExpStartEdit(exp)}
                          className="p-1 px-2.5 bg-blue-500/5 hover:bg-blue-600 text-blue-400 hover:text-white rounded border border-blue-500/10 font-mono text-[10px] flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          id={`btn-exp-delete-${exp.id}`}
                          onClick={() => handleExpDelete(exp.id)}
                          className="p-1 px-2.5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded border border-red-500/10 font-mono text-[10px]"
                        >
                          Delete Record
                        </button>
                      </div>
                    </div>

                    {/* Bullet list */}
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 pl-1 mb-4 text-left">
                      {exp.responsibilities.map((resp, bIdx) => (
                        <li key={bIdx}>{resp}</li>
                      ))}
                    </ul>

                    {/* Tech tag list */}
                    <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-3 select-none">
                      {exp.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="bg-brand-navy/40 border border-brand-accent/20 text-blue-200 text-[10px] font-mono px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === "education" && (
            <div id="edu-form-container" className="scroll-mt-24 space-y-6">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>Manage Academic Degrees</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">// TARGET: PORTFOLIO.EDUCATION</span>
              </h2>

              {/* Form to insert degree */}
              <form onSubmit={handleEduAdd} className="bg-brand-black/50 border border-white/5 p-5 rounded-xl space-y-4">
                <span className="font-mono text-[10px] text-brand-accent block uppercase tracking-wide">
                  {editingEduId ? "✏️ Edit Academic Degree Node:" : "+ Add Academia Degree:"}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label htmlFor="edu-add-degree" className="text-[10px] font-mono text-gray-400 uppercase">Degree Title</label>
                    <input
                      id="edu-add-degree"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={eduForm.degree}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, degree: e.target.value }))}
                      placeholder="e.g. Bachelor of Science in CSE"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="edu-add-institution" className="text-[10px] font-mono text-gray-400 uppercase">University / Institution</label>
                    <input
                      id="edu-add-institution"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, institution: e.target.value }))}
                      placeholder="e.g. American International University"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="edu-add-year" className="text-[10px] font-mono text-gray-400 uppercase">Graduation Year</label>
                    <input
                      id="edu-add-year"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={eduForm.year}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g. 2020"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="edu-add-location" className="text-[10px] font-mono text-gray-400 uppercase">Location</label>
                    <input
                      id="edu-add-location"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={eduForm.location}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Dhaka, Bangladesh"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="edu-add-description" className="text-[10px] font-mono text-gray-400 uppercase">Degree summary / course achievements</label>
                  <textarea
                    id="edu-add-description"
                    rows={3}
                    className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none resize-y focus:border-brand-accent"
                    value={eduForm.description}
                    onChange={(e) => setEduForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Focused on Computer networks and cyber risk audits. Core coursework..."
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="edu-add-documentUrl" className="text-[10px] font-mono text-gray-400 uppercase">Google Drive / Academic Document URL</label>
                  <input
                    id="edu-add-documentUrl"
                    type="url"
                    className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent animate-pulse-slow"
                    value={eduForm.documentUrl}
                    onChange={(e) => setEduForm((prev) => ({ ...prev, documentUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  />
                  <span className="text-[10px] text-gray-500 block font-mono">
                    Provide a public shareable Google Drive, Dropbox, or Web link to your degree or board certificate copy.
                  </span>
                </div>

                {/* Upload institution logo section */}
                <div className="bg-brand-black/40 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-left">
                  <div className="shrink-0">
                    {eduForm.logo && (
                      eduForm.logo.startsWith("/") ||
                      eduForm.logo.startsWith("data:image/") ||
                      eduForm.logo.startsWith("http://") ||
                      eduForm.logo.startsWith("https://")
                    ) ? (
                      <img 
                        src={eduForm.logo} 
                        alt="Institution Logo Preview" 
                        className="w-12 h-12 rounded-xl object-contain border border-white/10 bg-white p-1 animate-fade-in"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#111827] border border-white/5 flex items-center justify-center text-brand-accent font-mono text-[9px] font-bold">
                        NO LOGO
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block">Upload Institution Logo</span>
                    <label className="px-3 py-1.5 bg-brand-navy hover:bg-brand-navy/85 border border-brand-accent/20 hover:border-brand-accent text-blue-300 hover:text-white font-mono text-[11px] rounded cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Choose Image (SVG, PNG, JPG, JPEG)
                      <input
                        type="file"
                        accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                        onChange={(e) => handleFileUpload(e, "eduForm")}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[9px] text-gray-500 font-mono block">
                      Selecting an image automatically uploads it and sets it as the institution's custom logo.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3.5">
                  {editingEduId && (
                    <button
                      type="button"
                      onClick={handleEduCancelEdit}
                      className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs font-semibold uppercase rounded-lg cursor-pointer transition-all border border-white/5"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    id="btn-edu-add-submit"
                    className="py-2.5 px-4 bg-brand-accent hover:bg-blue-600 text-white font-mono text-xs font-semibold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {editingEduId ? (
                      <>
                        <Check className="w-4 h-4" /> Save Academic Node
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Insert Academic Node
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Education list table view - Displayed in Stack (LIFO) order */}
              <div className="space-y-4 mt-6">
                {[...eduList].reverse().map((edu) => (
                  <div key={edu.id} className="bg-brand-black/30 border border-white/5 rounded-xl p-5 flex justify-between items-start text-left">
                    <div className="flex gap-4">
                      {edu.logo && (
                        edu.logo.startsWith("/") ||
                        edu.logo.startsWith("data:image/") ||
                        edu.logo.startsWith("http://") ||
                        edu.logo.startsWith("https://")
                      ) ? (
                        <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
                          <img 
                            src={edu.logo} 
                            alt={`${edu.institution} Logo`} 
                            className="w-12 h-12 rounded-xl object-contain border border-white/10 bg-white p-1"
                            referrerPolicy="no-referrer"
                          />
                          <label className="text-[9px] text-blue-400 hover:text-white font-mono cursor-pointer bg-blue-500/5 hover:bg-blue-600/10 px-1.5 py-0.5 rounded border border-blue-500/10 transition-colors">
                            Change
                            <input
                              type="file"
                              accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                              onChange={(e) => handleFileUpload(e, "eduLogo", edu.id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
                          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-500 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <label className="text-[9px] text-blue-400 hover:text-white font-mono cursor-pointer bg-blue-500/5 hover:bg-blue-600/10 px-1.5 py-0.5 rounded border border-blue-500/10 transition-colors">
                            Upload
                            <input
                              type="file"
                              accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                              onChange={(e) => handleFileUpload(e, "eduLogo", edu.id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                      <div>
                        <h4 className="font-sans font-bold text-base text-white">{edu.degree}</h4>
                        <span className="text-xs text-brand-accent font-mono block mt-1">{edu.institution}</span>
                        <p className="text-xs text-gray-400 mt-3">{edu.description}</p>
                        <div className="text-[10px] font-mono text-gray-500 mt-2">
                          {edu.location} | Class of {edu.year}
                        </div>
                        {edu.documentUrl && (
                          <div className="text-[10px] font-mono text-blue-400 mt-1.5 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded w-fit">
                            <span>📂 Record:</span>
                            <a href={edu.documentUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[240px]">
                              {edu.documentUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        id={`btn-edu-edit-${edu.id}`}
                        onClick={() => handleEduStartEdit(edu)}
                        className="p-1 px-2.5 bg-blue-500/5 hover:bg-blue-600 text-blue-400 hover:text-white rounded border border-blue-500/10 font-mono text-[10px] flex items-center gap-1 transition-all"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        id={`btn-edu-delete-${edu.id}`}
                        onClick={() => handleEduDelete(edu.id)}
                        className="p-1 px-2.5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded border border-red-500/10 font-mono text-[10px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATIONS */}
          {activeTab === "certifications" && (
            <div id="cert-form-container" className="scroll-mt-24 space-y-6">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>Manage Security & Network Certifications</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">// TARGET: PORTFOLIO.CERTIFICATIONS</span>
              </h2>

              {/* Form to insert certification */}
              <form onSubmit={handleCertAdd} className="bg-brand-black/50 border border-white/5 p-5 rounded-xl space-y-4">
                <span className="font-mono text-[10px] text-brand-accent block uppercase tracking-wide">
                  {editingCertId ? "✏️ Edit Certification Node:" : "+ Add Certification Node:"}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label htmlFor="cert-add-name" className="text-[10px] font-mono text-gray-400 uppercase">Certification Name</label>
                    <input
                      id="cert-add-name"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={certForm.name}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Cisco CCNP Enterprise"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="cert-add-issuer" className="text-[10px] font-mono text-gray-400 uppercase">Issuing Organization</label>
                    <input
                      id="cert-add-issuer"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={certForm.issuer}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, issuer: e.target.value }))}
                      placeholder="e.g. Cisco, Microsoft"
                    />
                  </div>

                  <div className="space-y-1 text-left md:col-span-2">
                    <label htmlFor="cert-add-issueDate" className="text-[10px] font-mono text-gray-400 uppercase">Issue Date (YYYY-MM-DD)</label>
                    <input
                      id="cert-add-issueDate"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={certForm.issueDate}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, issueDate: e.target.value }))}
                      placeholder="e.g. 2023-04-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 text-leftCol col-span-1 md:col-span-2">
                    <label htmlFor="cert-add-verifyUrl" className="text-[10px] font-mono text-gray-400 uppercase">Verification URL (Credly Link)</label>
                    <input
                      id="cert-add-verifyUrl"
                      type="text"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                      value={certForm.verifyUrl}
                      onChange={(e) => setCertForm((prev) => ({ ...prev, verifyUrl: e.target.value }))}
                      placeholder="https://www.credly.com/certificates/..."
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="cert-add-badgeImage" className="text-[10px] font-mono text-gray-400 uppercase">Badge Selector key</label>
                    <select
                      id="cert-add-badgeImage"
                      className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 focus:border-brand-accent outline-none font-mono"
                      value={certForm.badgeImage && ["cisco", "microsoft", "aws", "fortinet", "comptia", "default"].includes(certForm.badgeImage.toLowerCase()) ? certForm.badgeImage.toLowerCase() : "custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== "custom") {
                          setCertForm((prev) => ({ ...prev, badgeImage: val }));
                        }
                      }}
                    >
                      <option value="cisco">cisco</option>
                      <option value="microsoft">microsoft</option>
                      <option value="aws">aws</option>
                      <option value="fortinet">fortinet</option>
                      <option value="comptia">comptia</option>
                      <option value="default">shield-badge</option>
                      <option value="custom">Custom Uploaded Logo</option>
                    </select>
                  </div>
                </div>

                {/* Upload logo section */}
                <div className="bg-brand-black/40 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-left">
                  <div className="shrink-0">
                    {certForm.badgeImage && (
                      certForm.badgeImage.startsWith("/") ||
                      certForm.badgeImage.startsWith("data:image/") ||
                      certForm.badgeImage.startsWith("http://") ||
                      certForm.badgeImage.startsWith("https://")
                    ) ? (
                      <div className="w-[108px] h-[108px] rounded-full bg-white flex items-center justify-center shrink-0 border border-white/10 shadow-inner overflow-hidden">
                        <img 
                          src={certForm.badgeImage} 
                          alt="Logo Preview" 
                          className="w-full h-full object-contain rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-[108px] h-[108px] rounded-full bg-[#111827] border border-white/5 flex items-center justify-center text-brand-accent font-mono text-[10px] font-bold">
                        {certForm.badgeImage?.toUpperCase().substring(0, 4) || "NONE"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block">Upload Custom Certification Logo</span>
                    <label className="px-3 py-1.5 bg-brand-navy hover:bg-brand-navy/85 border border-brand-accent/20 hover:border-brand-accent text-blue-300 hover:text-white font-mono text-[11px] rounded cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Choose Image (SVG, PNG, JPG, JPEG)
                      <input
                        type="file"
                        accept="image/svg+xml, image/png, image/jpeg, image/jpg"
                        onChange={(e) => handleFileUpload(e, "certForm")}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[9px] text-gray-500 font-mono block">
                      Selecting an image automatically uploads it and sets it as the certification's custom logo.
                    </span>
                  </div>
                </div>

                 <div className="space-y-1 text-left">
                  <label htmlFor="cert-add-credentialId" className="text-[10px] font-mono text-gray-400 uppercase">Credential License ID</label>
                  <input
                    id="cert-add-credentialId"
                    type="text"
                    className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent"
                    value={certForm.credentialId}
                    onChange={(e) => setCertForm((prev) => ({ ...prev, credentialId: e.target.value }))}
                    placeholder="e.g. License CCNP-102938"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="cert-add-documentUrl" className="text-[10px] font-mono text-gray-400 uppercase">Google Drive / Certificate Copy URL</label>
                  <input
                    id="cert-add-documentUrl"
                    type="url"
                    className="w-full px-3 py-2 bg-brand-black border border-white/5 rounded text-xs text-gray-200 outline-none focus:border-brand-accent animate-pulse-slow"
                    value={certForm.documentUrl}
                    onChange={(e) => setCertForm((prev) => ({ ...prev, documentUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  />
                  <span className="text-[10px] text-gray-500 block font-mono">
                    Provide a public shareable Google Drive, Dropbox, or Web document link to back your credentials.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3.5">
                  {editingCertId && (
                    <button
                      type="button"
                      onClick={handleCertCancelEdit}
                      className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs font-semibold uppercase rounded-lg cursor-pointer transition-all border border-white/5"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    id="btn-cert-add-submit"
                    className="py-2.5 px-4 bg-brand-accent hover:bg-blue-600 text-white font-mono text-xs font-semibold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {editingCertId ? (
                      <>
                        <Check className="w-4 h-4" /> Save License Node
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Insert License Node
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Certs Grid view list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {certsList.map((cert) => (
                  <div key={cert.id} className="bg-brand-black/30 border border-white/5 rounded-xl p-5 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-3">
                          {cert.badgeImage && (
                            cert.badgeImage.startsWith("/") ||
                            cert.badgeImage.startsWith("data:image/") ||
                            cert.badgeImage.startsWith("http://") ||
                            cert.badgeImage.startsWith("https://")
                          ) ? (
                            <div className="w-[90px] h-[90px] rounded-full bg-white flex items-center justify-center shrink-0 border border-white/10 shadow-inner overflow-hidden">
                              <img 
                                src={cert.badgeImage} 
                                alt="Logo" 
                                className="w-full h-full object-contain rounded-full"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <span className="bg-brand-navy/60 text-blue-300 font-mono text-[9px] px-2 py-0.5 rounded border border-brand-accent/15 uppercase">
                              {cert.badgeImage}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            id={`btn-cert-edit-${cert.id}`}
                            onClick={() => handleCertStartEdit(cert)}
                            className="px-2 py-1 hover:bg-blue-500/10 text-blue-400 hover:text-blue-500 rounded text-[10px] font-mono flex items-center gap-0.5 transition-all"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Edit
                          </button>
                          <button
                            type="button"
                            id={`btn-cert-delete-${cert.id}`}
                            onClick={() => handleCertDelete(cert.id)}
                            className="px-2 py-1 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded text-[10px] font-mono transition-all"
                          >
                            Wipe
                          </button>
                        </div>
                      </div>

                      <h4 className="font-sans font-bold text-sm text-white mt-2 leading-tight">{cert.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-1">Issued: {cert.issuer}</p>

                      <div className="mt-3 space-y-1 font-mono text-[10px] text-gray-400">
                        <div>ID: {cert.credentialId || "N/A"}</div>
                        <div>Issue Date: {cert.issueDate}</div>
                        {cert.documentUrl && (
                          <div className="text-[10px] font-mono text-blue-400 mt-1.5 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded w-fit">
                            <span>📄 Copy:</span>
                            <a href={cert.documentUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[200px]">
                              {cert.documentUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 font-mono text-[10px] text-brand-accent hover:underline inline-flex items-center gap-1"
                      >
                        Verify Links <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT INFORMATION */}
          {activeTab === "contact" && (
            <div className="space-y-6 font-sans">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>Manage Address & Contact Information</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">// TARGET: PORTFOLIO.CONTACT</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="contact-edit-email" className="text-[11px] font-mono text-gray-400 block uppercase">Office Email Coordinates</label>
                  <input
                    id="contact-edit-email"
                    type="email"
                    className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="contact-edit-phone" className="text-[11px] font-mono text-gray-400 block uppercase">Corporate Phone lines</label>
                  <input
                    id="contact-edit-phone"
                    type="text"
                    className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="contact-edit-address" className="text-[11px] font-mono text-gray-400 block uppercase">Office Location</label>
                  <input
                    id="contact-edit-address"
                    type="text"
                    className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none"
                    value={contactForm.location}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="contact-edit-whatsapp" className="text-[11px] font-mono text-gray-400 block uppercase">WhatsApp Direct Link Number</label>
                  <input
                    id="contact-edit-whatsapp"
                    type="text"
                    className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none"
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                  />
                  <span className="text-[9px] font-mono text-gray-500 block">Use country codes, do not include symbols (e.g. +8801712...).</span>
                </div>
              </div>

              {/* Commit Button */}
              <button
                id="btn-save-contact"
                disabled={saveLoading}
                onClick={() => handleSaveChangesAll({ ...portfolio, contact: contactForm })}
                className="px-5 py-3 bg-brand-accent hover:bg-blue-600 rounded-lg text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saveLoading ? "Synchronizing..." : "Serialize Coordinates"}
              </button>
            </div>
          )}

          {/* TAB 7: MESSAGES INQUIRIES LOG */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>User Inquiry Inbox Logs ({messages.length})</span>
                <button
                  type="button"
                  id="btn-refresh-messages"
                  onClick={loadMessages}
                  className="p-1 px-3 bg-brand-navy/60 border border-brand-accent/20 rounded text-xs text-blue-300 hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Retry Load
                </button>
              </h2>

              {messagesLoading && (
                <div className="py-12 text-center text-gray-500 font-mono text-xs animate-pulse">
                  // SCANNING INBOX PACKETS...
                </div>
              )}

              {!messagesLoading && messages.length === 0 && (
                <div className="py-12 text-center text-gray-500 border border-dashed border-white/5 rounded-xl font-mono text-xs">
                  // NO MESSAGES LOGGED YET. INBOX PACKET STACK EMPTY.
                </div>
              )}

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`border rounded-xl p-5 text-left transition-all ${
                      msg.status === "unread"
                        ? "bg-brand-navy/20 border-brand-accent/30 glow-blue shadow-md"
                        : "bg-brand-black/30 border-white/5"
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans font-bold text-sm text-white">{msg.name}</h4>
                          <span className="text-[10px] font-mono text-gray-500">({msg.email})</span>
                        </div>
                        <h5 className="font-sans font-semibold text-xs text-brand-accent mt-0.5">{msg.subject}</h5>
                      </div>

                      <div className="flex items-center gap-2 select-none">
                        <span className="font-mono text-[9px] text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleDateString()}
                        </span>

                        {msg.status === "unread" && (
                          <span className="bg-red-500/10 text-red-400 font-mono text-[9px] px-2 py-0.5 rounded border border-red-500/10 font-bold">
                            UNREAD
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Cipher text body */}
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    {/* Operational row buttons */}
                    <div className="flex justify-end gap-2 border-t border-white/5 pt-3.5 font-mono text-[10px]">
                      {msg.status === "unread" && (
                        <button
                          type="button"
                          id={`btn-msg-read-${msg.id}`}
                          onClick={() => markMessageAsRead(msg.id)}
                          className="px-3 py-1.5 bg-brand-success/15 hover:bg-brand-success text-brand-success hover:text-white rounded border border-brand-success/20 transition-all font-semibold"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        type="button"
                        id={`btn-msg-delete-${msg.id}`}
                        onClick={() => deleteMessage(msg.id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded border border-red-500/20 transition-all font-semibold"
                      >
                        Wipe Log
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SECURITY DETAILS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-lg text-white border-b border-white/5 pb-3 flex items-center justify-between">
                <span>Manage Administrative Credentials</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">// TARGET: PORTFOLIO.AUTH</span>
              </h2>

              <form onSubmit={handleChangePasswordSubmit} className="max-w-md space-y-4">
                {securityFeedback.success && (
                  <div id="security-success-alert" className="p-3 bg-brand-success/10 border border-brand-success/20 text-brand-success text-xs rounded font-mono text-left">
                    • SUCCESS: {securityFeedback.success}
                  </div>
                )}

                {securityFeedback.error && (
                  <div id="security-error-alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded font-mono text-left">
                    * ERR: {securityFeedback.error}
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label htmlFor="sec-edit-current" className="text-[11px] font-mono text-gray-400 block uppercase">Current Secret Password</label>
                  <input
                    id="sec-edit-current"
                    type="password"
                    className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none font-mono"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password key"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="sec-edit-new" className="text-[11px] font-mono text-gray-400 block uppercase">New Secret Password</label>
                  <input
                    id="sec-edit-new"
                    type="password"
                    className="w-full px-4 py-2.5 bg-brand-black/50 border border-white/5 focus:border-brand-accent rounded-lg text-sm text-gray-200 outline-none font-mono"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new custom security password"
                  />
                  <span className="text-[9px] text-gray-500 block">Provide a custom secure phrase of at least 6 characters. Use caution. Choosing a lost secret requires server file wipes.</span>
                </div>

                <button
                  type="submit"
                  id="btn-security-submit"
                  disabled={!currentPassword || !newPassword}
                  className="px-5 py-3 bg-brand-accent hover:bg-blue-600 disabled:bg-slate-900 rounded-lg text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-6 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  Wipe & Rewrite Password Hash
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
