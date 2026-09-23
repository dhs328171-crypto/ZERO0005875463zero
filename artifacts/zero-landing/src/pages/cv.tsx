import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Counter } from "@/components/ui/counter";
import { 
  Download, Mail, Phone, MapPin, Globe, Calendar, Award, 
  Briefcase, Code2, GraduationCap, Star, Cpu, CheckCircle, ExternalLink,
  Trophy, Target, BookOpen, BadgeCheck as Certificate, Zap, ChevronDown, ChevronUp,
  ShieldCheck, BrainCircuit,
  Filter, Search, MessageCircle
} from "lucide-react";
import { SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiTailwindcss, 
         SiMongodb, SiPostgresql, SiGit, SiFirebase, SiDocker, SiPython, 
         SiFigma, SiGraphql, SiRedis, SiFreecodecamp } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { apiGet, getImageUrl } from "@/lib/api";

// Skills with levels
const skills = [
  { name: "React / Next.js", level: 90, color: "bg-cyan-400", icon: <SiReact size={18} className="text-cyan-400" /> },
  { name: "TypeScript / JavaScript", level: 88, color: "bg-blue-400", icon: <SiTypescript size={18} className="text-blue-400" /> },
  { name: "Node.js / Express", level: 84, color: "bg-green-400", icon: <SiNodedotjs size={18} className="text-green-400" /> },
  { name: "Python / Automation", level: 78, color: "bg-yellow-400", icon: <SiPython size={18} className="text-yellow-300" /> },
  { name: "UI/UX + Figma", level: 82, color: "bg-purple-400", icon: <SiFigma size={18} className="text-purple-400" /> },
  { name: "PostgreSQL / MongoDB", level: 80, color: "bg-blue-400", icon: <SiPostgresql size={18} className="text-blue-300" /> },
  { name: "Cyber Security", level: 68, color: "bg-red-400", icon: <ShieldCheck size={18} className="text-red-400" /> },
  { name: "AI Models / AI Apps", level: 72, color: "bg-pink-400", icon: <BrainCircuit size={18} className="text-pink-400" /> },
];

const professionalTracks = [
  { title: "Software Engineering", items: ["Web application architecture", "Full Stack development", "Databases and APIs", "JavaScript, TypeScript, Python, Java, C/C++ and C#"] },
  { title: "AI & Automation", items: ["AI model experimentation", "AI-powered applications", "Custom bot development", "AI video editing workflows"] },
  { title: "Cyber Security", items: ["Secure application thinking", "Access and content protection", "Security-focused platform features"] },
  { title: "Marketing, Sales & Finance", items: ["Sales and negotiation", "Digital marketing", "Financial trading", "Investment strategy research"] },
];

// Experience timeline
const experience = [
  {
    role: "Software Engineer & Full Stack Developer",
    company: "ZERO — Software Architect Solutions",
    period: "6+ سنوات تعلم وتطبيق ذاتي",
    location: "المملكة العربية السعودية (عن بعد)",
    desc: "تطوير منصات ويب وتجارب رقمية متكاملة تشمل الواجهات، الـAPI، قواعد البيانات، لوحات الإدارة، والأتمتة.",
    highlights: ["10+ دراسات حالة معروضة", "تطوير مواقع ومنصات كاملة", "React / Node.js / Python", "لوحات SaaS ومتاجر وLMS"],
    color: "border-primary/40",
    dot: "bg-primary",
    current: true,
  },
  {
    role: "AI & Application Builder",
    company: "ZERO Lab / مشاريع مستقلة",
    period: "مستمر",
    location: "عن بعد",
    desc: "تصميم معماريات لأنظمة AI، تجربة النماذج وتعديلها، وبناء تطبيقات ذكاء اصطناعي وبوتات مخصصة.",
    highlights: ["3–4 معماريات AI", "تطبيقات AI مخصصة", "4 بوتات مخصصة", "تجارب نماذج وتحسينات"],
    color: "border-green-400/40",
    dot: "bg-green-400",
    current: false,
  },
  {
    role: "Web & Cyber Security Track",
    company: "تعلم وتطبيق مستقل",
    period: "1–1.5 سنة أمن سيبراني",
    location: "عن بعد",
    desc: "تطوير مواقع وتطبيقات مع إدخال مبادئ حماية المحتوى، الصلاحيات، والوعي الأمني داخل المنتج.",
    highlights: ["11+ موقعًا وتطبيقًا", "حماية محتوى ومنصات", "React وواجهات RTL", "أساسيات SEO والأمان"],
    color: "border-yellow-400/40",
    dot: "bg-yellow-400",
    current: false,
  },
];

// Education & Certificates - ENHANCED with courses
const education = [
  {
    degree: "البيانات التعليمية الرسمية",
    school: "سيتم تحديثها من صاحب السيرة",
    period: "—",
    gpa: "غير منشور",
    type: "academic",
  },
];

// Static fallback used while the API is unavailable or has no certificates yet.
type CertificateCard = {
  title: string;
  issuer: string;
  date: string;
  status: "completed" | "in-progress" | "upcoming" | "planned";
  platform: string;
  platformIcon: string;
  platformColor: string;
  credentialUrl: string;
  skills: string[];
  description: string;
  badge: string;
  isHighlighted: boolean;
  progress?: number;
  image?: string;
  credentialId?: string;
};

const fallbackCertifications: CertificateCard[] = [
  {
    title: "Python Certificate",
    issuer: "SoloLearn",
    date: "موثقة — 2026",
    status: "completed",
    platform: "Sololearn",
    platformIcon: "🐍",
    platformColor: "border-blue-400/40 bg-gradient-to-r from-blue-400/10 to-cyan-400/5",
    credentialUrl: "https://api2.sololearn.com/v2/certificates/CC-2F2FE49H/image/png?t=639207855602386520",
    skills: ["Python Basics", "Data Types", "Loops", "Functions", "OOP", "File Handling"],
    description: "شهادة Python موثقة مع رابط مباشر للمصدر الأصلي ورقم اعتماد قابل للمراجعة.",
    badge: "شهادة موثقة",
    isHighlighted: true,
  },
];

type ApiCertificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  image: string | null;
  category: string;
  featured: boolean;
};

function mapApiCertificate(cert: ApiCertificate): CertificateCard {
  const colors: Record<string, string> = {
    cloud: "border-sky-400/40 bg-sky-400/5",
    security: "border-red-400/40 bg-red-400/5",
    development: "border-primary/40 bg-primary/5",
    design: "border-purple-400/40 bg-purple-400/5",
    database: "border-orange-400/40 bg-orange-400/5",
    devops: "border-green-400/40 bg-green-400/5",
    ai: "border-yellow-400/40 bg-yellow-400/5",
  };

  return {
    title: cert.title,
    issuer: cert.issuer,
    date: cert.expiryDate
      ? `${cert.issueDate} — ${cert.expiryDate}`
      : cert.issueDate,
    status: "completed",
    platform: cert.issuer,
    platformIcon: "🏆",
    platformColor: colors[cert.category] || "border-primary/30 bg-primary/5",
    credentialUrl: cert.credentialUrl || "#",
    skills: cert.credentialId ? [`Credential ID: ${cert.credentialId}`] : [],
    description: `شهادة مهنية صادرة من ${cert.issuer}.`,
    badge: cert.featured ? "★ شهادة مميزة" : "شهادة موثقة",
    isHighlighted: cert.featured,
    image: cert.image || undefined,
    credentialId: cert.credentialId || undefined,
  };
}

// Learning Roadmap - What's coming next
const learningRoadmap = [
  { phase: "المرحلة 1 ✅", title: "Python Certificate (SoloLearn)", items: ["Python Basics", "Data Types", "Functions", "OOP", "File Handling"], current: true },
  { phase: "المرحلة 2 🎯", title: "JavaScript & Full Stack", items: ["JavaScript Algorithms", "React Patterns", "Node.js APIs", "Database Design"], current: false },
  { phase: "المرحلة 3 ⚡", title: "AI & Cyber Security", items: ["AI application architecture", "Model experimentation", "Secure platforms", "Automation and bots"], current: false },
  { phase: "المرحلة 4 🚀", title: "Business & Delivery", items: ["Digital marketing", "Sales and negotiation", "Client delivery", "Live product launches"], current: false },
];

// Projects showcase
const projects = [
  { name: "منصات ويب كاملة", tech: "React + Next.js + Node.js", desc: "واجهات ومنصات متجاوبة مع API وقاعدة بيانات ولوحة إدارة.", url: "#" },
  { name: "أنظمة AI وأتمتة", tech: "Python + AI Models + Automation", desc: "معماريات وتطبيقات ذكاء اصطناعي وبوتات مخصصة.", url: "#" },
  { name: "متاجر وواجهات RTL", tech: "React + TypeScript + REST API", desc: "تجارب متاجر عربية، كتالوجات، طلبات، وفلاتر.", url: "#" },
  { name: "منصات تعليمية آمنة", tech: "React + Security + PWA", desc: "لوحات تعليمية، حماية محتوى، اشتراكات، وتقارير.", url: "#" },
];

// Tech stack icons
const techStack = [
  { icon: <SiReact size={22} className="text-cyan-400" />, name: "React" },
  { icon: <SiNextdotjs size={22} className="text-white" />, name: "Next.js" },
  { icon: <SiTypescript size={22} className="text-blue-400" />, name: "TypeScript" },
  { icon: <SiNodedotjs size={22} className="text-green-400" />, name: "Node.js" },
  { icon: <SiTailwindcss size={22} className="text-cyan-300" />, name: "Tailwind" },
  { icon: <SiPostgresql size={22} className="text-blue-300" />, name: "PostgreSQL" },
  { icon: <SiMongodb size={22} className="text-green-500" />, name: "MongoDB" },
  { icon: <SiGit size={22} className="text-orange-400" />, name: "Git" },
  { icon: <SiFirebase size={22} className="text-yellow-400" />, name: "Firebase" },
  { icon: <SiDocker size={22} className="text-blue-500" />, name: "Docker" },
  { icon: <SiPython size={22} className="text-yellow-300" />, name: "Python" },
  { icon: <Code2 size={22} className="text-orange-300" />, name: "Java" },
  { icon: <Code2 size={22} className="text-blue-300" />, name: "C / C++ / C#" },
  { icon: <SiFigma size={22} className="text-purple-400" />, name: "Figma" },
  { icon: <SiGraphql size={22} className="text-pink-400" />, name: "GraphQL" },
  { icon: <SiRedis size={22} className="text-red-500" />, name: "Redis" },
    { icon: <FaAws size={22} className="text-orange-400" />, name: "AWS" },
    { icon: <SiFreecodecamp size={22} className="text-orange-600" />, name: "freeCodeCamp" },
];

type ActiveTab = 'about' | 'skills' | 'experience' | 'certifications' | 'projects';

export default function CV() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const [expandedCert, setExpandedCert] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<CertificateCard[]>(fallbackCertifications);
  const [certificatesLoading, setCertificatesLoading] = useState(true);

  // Certificates created from the admin panel are the source of truth for
  // the public CV page. Keep the static list as a graceful offline fallback.
  useEffect(() => {
    let cancelled = false;
    apiGet<{ items: ApiCertificate[] }>("/certificates?limit=100")
      .then((res) => {
        if (!cancelled && res.items.length > 0) {
          setCertifications(res.items.map(mapApiCertificate));
        }
      })
      .catch(() => {
        // The CV remains usable with the built-in fallback list.
      })
      .finally(() => {
        if (!cancelled) setCertificatesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const handlePrint = () => window.print();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'about', label: 'نبذة عني', icon: <Code2 size={16} /> },
    { id: 'skills', label: 'المهارات', icon: <Cpu size={16} /> },
    { id: 'experience', label: 'الخبرات', icon: <Briefcase size={16} /> },
    { id: 'certifications', label: 'الشهادات', icon: <Certificate size={16} />, count: certifications.length },
    { id: 'projects', label: 'المشاريع', icon: <Award size={16} /> },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-15" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-mono text-primary text-xs tracking-widest uppercase mb-4 block inline-flex items-center gap-2">
              <GraduationCap size={14} />
              resume.load()
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              السيرة <span className="text-primary glow-cyan-text">الذاتية</span> & <br className="md:hidden lg:inline" />
              <span className="text-primary glow-cyan-text">الشهادات</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg mb-6">
              Software Architect — Full Stack — AI — Cyber Security — طالب علم مستمر
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                {[
                { val: 10, suffix: "+", label: "دراسة حالة" },
                { val: 6, suffix: "", label: "مجالات تقنية" },
                { val: 1, suffix: "", label: "شهادة موثقة" },
                { val: 100, suffix: "%", label: "ملكية الكود" },
              ].map((s, i) => (
                <div key={i} className="bg-card/50 border border-border rounded-lg px-4 py-2 text-center">
                  <span className="text-xl font-bold font-mono text-primary">{s.val}{s.suffix}</span>
                  <span className="text-xs text-muted-foreground ml-1">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-mono text-sm hover:bg-primary/90 glow-cyan transition-all">
                <Download size={14} /> طباعة / حفظ PDF
              </button>
              <a href="/contact"
                className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-xl font-mono text-sm hover:border-primary/50 transition-all">
                <Mail size={14} /> تواصل معي
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-24 max-w-6xl">
        
        {/* Navigation Tabs - Sticky */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-30 bg-background/80 backdrop-blur-md border border-border rounded-xl p-2 mb-8 flex gap-1 overflow-x-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Profile Card */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-primary/20 rounded-2xl p-6 text-center"
                >
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/40 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <img src="/zero-logo.jpg" alt="ZERO" className="w-full h-full object-cover p-2" />
                  </div>
                  <h2 className="font-bold text-xl mb-1">ZERO</h2>
                  <p className="text-primary font-mono text-sm mb-4">Full Stack Developer</p>
                  
                  <div className="space-y-2 text-right">
                    {[
                      { icon: <Mail size={13} className="text-primary" />, val: "التواصل عبر النموذج الداخلي" },
                      { icon: <Phone size={13} className="text-green-400" />, val: "بيانات الاتصال عند بدء المشروع" },
                      { icon: <MapPin size={13} className="text-red-400" />, val: "الرياض، السعودية" },
                      { icon: <Globe size={13} className="text-blue-400" />, val: "ZERO Portfolio" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
                        <span className="font-mono">{item.val}</span>
                        {item.icon}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-3 mt-5 pt-4 border-t border-border">
                    <a href="/contact" target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-green-400/10 border border-green-400/30 flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-all">
                      <MessageCircle size={16} />
                    </a>
                    <a href="/contact" className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400 hover:bg-blue-400/20 transition-all">
                      <Mail size={16} />
                    </a>
                  </div>
                </motion.div>

                {/* Tech Stack Mini */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-2xl p-5"
                >
                  <h3 className="font-mono text-xs text-primary tracking-widest uppercase mb-3 flex items-center gap-2">
                    <Target size={14} /> التقنيات
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {techStack.slice(0, 8).map((t, i) => (
                      <div key={i} className="flex items-center gap-1 bg-background border border-border rounded-md px-2 py-1 text-xs">
                        {t.icon}
                        <span className="font-mono text-muted-foreground">{t.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Languages */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-2xl p-5"
                >
                  <h3 className="font-mono text-xs text-primary tracking-widest uppercase mb-3">// اللغات</h3>
                  <div className="space-y-3">
                    {[
                      { lang: "العربية", level: "اللغة الأم", pct: 100, color: "bg-primary" },
                      { lang: "الإنجليزية", level: "متقدم", pct: 85, color: "bg-blue-400" },
                    ].map((l, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{l.lang}</span>
                          <span className="text-muted-foreground">{l.level}</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${l.color} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${l.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 space-y-6"
              >
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Code2 size={18} className="text-primary" /> نبذة مختصرة
                  </h2>
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      مطور <span className="text-foreground font-medium">Full Stack شغوف</span> بتحويل الأفكار إلى تجارب رقمية استثنائية. أتخصص في بناء تطبيقات ويب وموبايل عالية الأداء باستخدام <span className="text-cyan-400">React</span>، <span className="text-white">Next.js</span>، و<span className="text-green-400"> Node.js</span>.
                    </p>
                    <p>
                      أعرض هنا <span className="text-primary font-bold">10+ دراسات حالة</span> مبنية على فيديوهات ومخرجات فعلية، مع فصل واضح بين المشروع المنشور والمشروع الذي ما زال يحتاج رابط Live Demo.
                    </p>
                    <p className="border-r-2 border-primary/30 pr-4 bg-primary/5 p-3 rounded-l">
                      <strong className="text-foreground">مبدأ العمل:</strong> لا أضع شهادة أو رقمًا أو رابطًا عامًا إلا إذا كان قابلًا للتحقق. الشهادات الحالية مرتبطة بمصدرها، وروابط المشاريع ستظهر من خلال Live Demo فقط.
                    </p>
                  </div>
                </div>

                {/* Current Focus */}
                <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-primary" /> التركيز الحالي
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <BookOpen size={16} className="text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Python / SoloLearn</p>
                          <p className="text-xs text-muted-foreground">شهادة موثقة معروضة في صفحة الشهادات</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Trophy size={16} className="text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Full Stack Roadmap</p>
                          <p className="text-xs text-muted-foreground">مسار تطوير مستمر، وليس شهادة مكتملة</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Target size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">تعميق المهارات</p>
                          <p className="text-xs text-muted-foreground">Python, Data Analysis, Automation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">أهداف 2026</p>
                          <p className="text-xs text-muted-foreground">تطوير المهارات والشهادات تدريجيًا</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Cpu size={18} className="text-primary" /> المهارات التقنية
                </h2>
                <div className="space-y-5">
                  {skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {skill.icon}
                          <span className="font-medium text-sm">{skill.name}</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2.5 bg-border rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${skill.color} rounded-full relative`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.08 }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ animationDuration: '2s' }} />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Award size={18} className="text-primary" /> التقنيات الإضافية
                </h2>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 text-xs hover:border-primary/30 transition-colors">
                      {t.icon}
                      <span className="font-mono text-muted-foreground">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-card border border-primary/20 rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <Briefcase size={18} className="text-primary" /> مسارات العمل والخبرة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionalTracks.map((track) => (
                    <div key={track.title} className="rounded-xl border border-border bg-background/60 p-4">
                      <h3 className="font-semibold text-sm text-primary mb-3">{track.title}</h3>
                      <ul className="space-y-2">
                        {track.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle size={12} className="text-green-400 mt-0.5 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Briefcase size={18} className="text-primary" /> الخبرة العملية
              </h2>
              <div className="space-y-6">
                {experience.map((exp, i) => (
                  <div key={i} className={`border-r-2 ${exp.color} pr-4 relative`}>
                    {exp.current && (
                      <span className="absolute -right-[9px] top-0 text-[10px] font-mono bg-primary text-primary-foreground px-2 py-0.5 rounded-full animate-pulse">
                        حالي
                      </span>
                    )}
                    <div className={`absolute -right-[5px] top-1.5 w-3 h-3 rounded-full ${exp.dot}`} />
                    
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-sm">{exp.role}</h3>
                        <p className="text-primary text-xs font-mono">{exp.company}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs text-muted-foreground/70 bg-background border border-border px-2 py-0.5 rounded-full">{exp.period}</span>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                          <MapPin size={9} /> {exp.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">{exp.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.map((h, j) => (
                        <span key={j} className="flex items-center gap-1 text-xs bg-background border border-border px-2 py-0.5 rounded-full text-muted-foreground">
                          <CheckCircle size={9} className="text-green-400" /> {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certifications Tab - NEW & ENHANCED */}
          {activeTab === 'certifications' && (
            <motion.div
              key="certifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20 rounded-2xl p-6 text-center">
                <Certificate size={32} className="mx-auto text-primary mb-3" />
                <h2 className="text-2xl font-bold mb-2">الشهادات والكورسات</h2>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  رحلة تعلم مستمرة — من الشهادات الاحترافية إلى المنصات العالمية
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary font-mono">{certifications.length}</div>
                    <div className="text-xs text-muted-foreground">شهادة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">
                      {certifications.filter(c => c.status === 'completed').length}
                    </div>
                    <div className="text-xs text-muted-foreground">مكتملة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400 font-mono">
                      {certifications.filter(c => c.status === 'in-progress').length}
                    </div>
                    <div className="text-xs text-muted-foreground">قيد التنفيذ</div>
                  </div>
                </div>
              </div>

              {/* Certifications List */}
                {certificatesLoading && (
                  <div className="text-xs text-muted-foreground font-mono text-center py-2 md:col-span-2">
                    جاري تحميل الشهادات المضافة من لوحة التحكم...
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-card border rounded-2xl overflow-hidden ${
                      cert.isHighlighted ? 'border-primary/30 shadow-lg shadow-primary/10' : 'border-border'
                    }`}
                  >
                    {/* Header */}
                    <div className={`p-5 ${cert.platformColor} border-b`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {cert.image ? (
                            <img
                              src={getImageUrl(cert.image)}
                              alt={cert.issuer}
                              className="w-10 h-10 rounded-lg object-contain bg-background/70 p-1"
                            />
                          ) : (
                            <span className="text-2xl">{cert.platformIcon}</span>
                          )}
                          <div>
                            <h3 className="font-bold text-sm line-clamp-1">{cert.title}</h3>
                            <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <span className={`text-[10px] font-mono px-2 py-1 rounded-full border flex-shrink-0 ${
                          cert.status === 'completed' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                          cert.status === 'in-progress' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20 animate-pulse' :
                          'bg-muted/10 text-muted-foreground border-muted/20'
                        }`}>
                          {cert.status === 'completed' ? '✅ مكتمل' : 
                           cert.status === 'in-progress' ? '🔄 قيد التنفيذ' :
                           '⏳ قادماً'}
                        </span>
                      </div>
                      
                      {cert.isHighlighted && (
                        <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {cert.badge}
                        </span>
                      )}
                    </div>

                    {/* Expandable Content */}
                    <div className="p-5">
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        {cert.description}
                      </p>
                      
                      {/* Progress Bar for in-progress certs */}
                      {cert.status === 'in-progress' && cert.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] font-mono mb-1">
                            <span className="text-primary">التقدم</span>
                            <span className="text-primary">{cert.progress}%</span>
                          </div>
                          <div className="h-2 bg-border rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${cert.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Skills gained */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {cert.skills.map((skill, j) => (
                          <span key={j} className="text-[10px] font-mono bg-background border border-border px-2 py-0.5 rounded text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Date & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                          <Calendar size={10} />
                          {cert.date}
                        </span>
                        
                        <button
                          onClick={() => setExpandedCert(expandedCert === cert.title ? null : cert.title)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {expandedCert === cert.title ? 'أقل' : 'المزيد'}
                          {expandedCert === cert.title ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedCert === cert.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 pt-3 border-t border-border/50"
                          >
                            {cert.credentialUrl !== '#' && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all"
                              >
                                <ExternalLink size={10} />
                                عرض الشهادة
                              </a>
                            )}
                            {cert.credentialId && (
                              <p className="mt-2 text-[10px] text-muted-foreground font-mono">
                                Credential ID: {cert.credentialId}
                              </p>
                            )}
                            
                            <div className="mt-2 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
                              <strong className="text-foreground">ملاحظة:</strong> هذه الشهادة ستُضاف هنا بمجرد الحصول عليها.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Learning Roadmap */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Target size={18} className="text-primary" /> خارطة التعلم المستقبلية
                </h3>
                <div className="space-y-4">
                  {learningRoadmap.map((phase, i) => (
                    <div key={i} className={`flex gap-4 ${phase.current ? 'opacity-100' : 'opacity-70'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        phase.current ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{phase.title}</h4>
                        <ul className="mt-1 space-y-1">
                          {phase.items.map((item, j) => (
                            <li key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                              <CheckCircle size={10} className={phase.current ? 'text-primary' : 'text-muted-foreground/50'} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Award size={18} className="text-primary" /> أبرز المشاريع
              </h2>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div key={i} className="bg-background border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{p.name}</h3>
                        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{p.desc}</p>
                      </div>
                      {p.url !== '#' && (
                        <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.split(" + ").map((t, j) => (
                        <span key={j} className="font-mono text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
