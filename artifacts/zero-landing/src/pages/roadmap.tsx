import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Zap, Lock, ArrowRight, BookOpen, Trophy, Target, Rocket, Star, Calendar, ExternalLink, ChevronDown, ChevronUp, Award as Certificate, Users, Gift, Bell, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/contexts/i18n-context";

// Enhanced Roadmap with Courses & Certifications
interface RoadmapItem {
  text: string;
  done: boolean;
  date?: string;
  link?: string;
  type?: 'feature' | 'course' | 'certification' | 'milestone';
}

interface Quarter {
  label: string;
  status: 'done' | 'current' | 'upcoming' | 'future';
  title: string;
  subtitle?: string;
  items: RoadmapItem[];
}

const quarters: Quarter[] = [
  {
    label: "Q1-Q2 2025",
    status: "done",
    title: "🏗️ التأساسيات",
    subtitle: "بناء الأساسات والتقنيات الجوهرية",
    items: [
      { text: "إطلاق موقع ZERO الجديد", done: true, type: 'milestone', date: 'يناير 2026' },
      { text: "بناء نظام إدارة المشاريع", done: true, type: 'feature', date: 'فبراير 2026' },
      { text: "تطوير لوحة التحكم الكاملة", done: true, type: 'feature', date: 'مارس 2026' },
      { text: "نظام المدونة التقنية", done: true, type: 'feature', date: 'أبريل 2026' },
      { text: "معرض الأعمال التفاعلي", done: true, type: 'feature', date: 'مايو 2026' },
    ],
  },
  {
    label: "Q3-Q4 2025",
    status: "done",
    title: "⚡ التوسع والنضج",
    subtitle: "إضافة الميزات المتقدمة",
    items: [
      { text: "نظام التقييمات والمراجعات", done: true, type: 'feature', date: 'مايو 2026' },
      { text: "منصة إدارة العملاء CRM", done: true, type: 'feature', date: 'يونيو 2026' },
      { text: "نظام المهام Kanban", done: true, type: 'feature', date: 'يوليو 2026' },
      { text: "لوحة التحليلات المتقدمة", done: true, type: 'feature', date: 'أغسطس 2026' },
      { text: "صفحة الأسعار التفاعلية", done: true, type: 'feature', date: 'سبتمبر 2026' },
    ],
  },
  {
    label: "Q1 2026",
    status: "done",
    title: "🚀 المنصة المتكاملة",
    subtitle: "إطلاق صفحات متعددة ونظم متكاملة",
    items: [
      { text: "لوحة تحكم متكاملة للمشاريع", done: true, type: 'feature', date: 'أكتوبر 2026' },
      { text: "نظام تحليلات متقدم", done: true, type: 'feature', date: 'أكتوبر 2026' },
      { text: "مدير SEO مدمج", done: true, type: 'feature', date: 'نوفمبر 2026' },
      { text: "إدارة الوسائط والصور", done: true, type: 'feature', date: 'نوفمبر 2026' },
      { text: "سجل الأنشطة والإشعارات", done: true, type: 'feature', date: 'ديسمبر 2026' },
    ],
  },
  {
    label: "Q2 2026",
    status: "current",
    title: "🎓 رحلة التعلم & الشهادات",
    subtitle: "التركيز على التعلم المستمر والحصول على شهادات",
    items: [
      { 
        text: "🐍 Python for Everybody Specialization (Solern)", 
        done: false, 
        type: 'course',
        date: 'جاري...',
        link: "https://www.solern.org/specializations/python-for-everybody"
      },
      { text: "📚 JavaScript Algorithms and Data Structures", done: false, type: 'course', date: 'قريباً', link: "#" },
      { text: "🎨 تحسين مهارات UI/UX Design", done: false, type: 'course', date: 'مخطط لها', link: "#" },
      { text: "🔒 أمان سيبري متقدم", done: false, type: 'course', date: 'مخطط لها', link: "#" },
      { text: "✅ بناء مشاريع عملية للـ Portfolio", done: true, type: 'feature', date: 'جاري...' },
    ],
  },
  {
    label: "Q3 2026",
    status: "upcoming",
    title: "🏆 الشهادات المعترفة",
    subtitle: "الحصول على شهادات من منصات عالمية",
    items: [
      { 
        text: "🏆 Full Stack Developer (freeCodeCamp)", 
        done: false, 
        type: 'certification',
        link: "https://www.freecodeamp.org/certification/full-stack-developer/"
      },
      { text: "☁️ AWS Cloud Practitioner", done: false, type: 'certification', link: "https://aws.amazon.com/certification/cloud-practitioner/" },
      { text: "🎯 Meta React Developer (Renewal)", done: false, type: 'certification', link: "https://www.coursera.org/professional-certificates/meta-react/" },
      { text: "📱 Google UX Design", done: false, type: 'certification', link: "https://coursera.org/professional-certificates/google-ux-design/" },
      { text: "💡 Python Professional Certificate", done: false, type: 'certification', link: "#" },
    ],
  },
  {
    label: "Q4 2026",
    status: "upcoming",
    title: "🌍 التوسع الدولي",
    subtitle: "فتح آفاق جديدة وتوسع قاعدة العملاء",
    items: [
      { text: "🌐 إنشاء محفظة أعمال دولية", done: false, type: 'milestone' },
      { text: "🤝 شراكات مع مطورين عرب", done: false, type: 'milestone' },
      { text: "📢 نظام تسويق ومراجعات آلي", done: false, type: 'feature' },
      { text: "🛒️ تطبيق جوال ZERO للعملاء", done: false, type: 'milestone' },
      { text: "🎁 برنامج الإحالة والمكافآت", done: false, type: 'milestone' },
    ],
  },
  {
    label: "2027+",
    status: "future",
    title: "🚀 المستقبل البعيد",
    subtitle: "رؤية طويلة المدى",
    items: [
      { text: "🤖 AI مساعد ذكي للتطوير", done: false, type: 'feature' },
      { text: "🎓 ZERO Academy للتعليم التقني", done: false, type: 'milestone' },
      { text: "🛒️ سوق القوالب والإضافات", done: false, type: 'milestone' },
      { text: "👥 فريق Zero للمطورين العرب", done: false, type: 'milestone' },
      { text: "🌍 مكتبة open-source مجتمعية", done: false, type: 'milestone' },
    ],
  },
];

// Status configuration
const statusConfig = {
  done: { 
    label: "مكتمل ✅", 
    icon: CheckCircle, 
    color: "text-green-400", 
    border: "border-green-400/30",
    bg: "bg-green-400/10 border-green-400/30",
    dotColor: "bg-green-400" 
  },
  current: { 
    label: "الآن 🎯", 
    icon: Zap, 
    color: "text-primary", 
    border: "border-primary/30",
    bg: "bg-primary/10 border-primary/30",
    dotColor: "bg-primary animate-pulse" 
  },
  upcoming: { 
    label: "قريباً ⏳", 
    icon: Clock, 
    color: "text-yellow-400", 
    border: "border-yellow-400/30",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    dotColor: "bg-yellow-400" 
  },
  future: { 
    label: "مستقبلاً 🔒", 
    icon: Lock, 
    color: "text-muted-foreground/50", 
    border: "border-border",
    bg: "bg-card border-border",
    dotColor: "bg-muted-foreground/30" 
  },
};

// Type icons
const typeIcons = {
  feature: <Gift size={12} />,
  course: <BookOpen size={12} />,
  certification: <Certificate size={12} />,
  milestone: <Target size={12} />,
};

// Learning stats
const learningStats = [
  { value: "3+", label: "شهادات مخططة", icon: Trophy },
  { value: "2+", label: "كورسات جارية", icon: BookOpen },
  { value: "100+", label: "ساعة تعلم", icon: Clock },
  { value: "∞", label: "خبرة عملية", icon: Star },
];

export default function Roadmap() {
  const [expandedQuarter, setExpandedQuarter] = useState<string | null>(null);
  const { dir } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Navbar />
      <main className="pt-24">
        
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-xs text-primary mb-3 tracking-widest uppercase flex items-center gap-2">
                <Rocket size={14} />
                roadmap.future()
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                خارطة <span className="text-primary glow-cyan-text"> الطريق</span>
                <br />
                <span className="text-2xl md:text-3xl">والشهادات</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                رؤيتي المهني — من بداية المتسقل حتى مستقبل واعد مع الشهادات والكورسات
              </p>

              {/* Learning Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                {learningStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card/50 border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-all"
                  >
                    <stat.icon className="mx-auto text-primary mb-1" size={20} />
                    <div className="text-xl font-bold font-mono text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Current Focus Banner */}
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <Zap size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-primary">التركيز الحالي: Q2 2026</p>
                  <p className="text-sm text-muted-foreground">🐍 كورس بايثون على Solern + بناء مشاريع عملية</p>
                </div>
              </div>
              
              <a
                href="https://www.solern.org/specializations/python-for-everybody"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-mono text-sm hover:bg-primary/90 glow-cyan transition-all"
              >
                شاهد الكورس <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Legend */}
        <section className="px-4 pb-4">
          <div className="container mx-auto max-w-4xl flex flex-wrap gap-3 justify-center">
            {[
              { key: 'done', ...statusConfig.done },
              { key: 'current', ...statusConfig.current },
              { key: 'upcoming', ...statusConfig.upcoming },
              { key: 'future', ...statusConfig.future },
            ].map(({ key, ...config }) => (
              <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.border} ${config.bg}`}>
                <config.icon size={12} className={config.color} />
                <span className={`text-xs font-mono ${config.color}`}>{config.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="py-8 px-4 pb-16">
          <div className="container mx-auto max-w-4xl">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />

              <div className="space-y-6">
                {quarters.map((q, i) => {
                  const s = statusConfig[q.status as keyof typeof statusConfig];
                  const isExpanded = expandedQuarter === q.label;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="md:pr-16 relative"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute right-3 top-6 w-6 h-6 rounded-full border-2 ${s.border} ${s.bg} flex items-center justify-center hidden md:flex`}>
                        <s.icon size={12} className={s.color} />
                      </div>

                      {/* Quarter Card */}
                      <div className={`border ${s.border} rounded-xl overflow-hidden transition-all ${
                        isExpanded ? 'shadow-lg shadow-primary/10' : ''
                      }`}>
                        {/* Header - Always Visible */}
                        <div 
                          className="px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-background/30 transition-colors"
                          onClick={() => setExpandedQuarter(isExpanded ? null : q.label)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm text-foreground">{q.label}</span>
                            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${s.border} ${s.bg} ${s.color}`}>
                              {s.label}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground">{q.title}</h3>
                          
                          <ChevronDown 
                            size={14} 
                            className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        </div>

                        {/* Subtitle */}
                        {q.subtitle && (
                          <p className="px-5 pb-3 text-xs text-muted-foreground italic border-b border-border/30">
                            {q.subtitle}
                          </p>
                        )}

                        {/* Expandable Items */}
                        <AnimatePresence mode="wait">
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-5 pb-5"
                            >
                              <div className="grid sm:grid-cols-2 gap-2">
                                {q.items.map((item, j) => (
                                  <div key={j} className="flex items-start gap-2.5 py-2 group/item">
                                    {/* Item Icon based on type */}
                                    <span className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] ${
                                      item.done 
                                        ? 'bg-green-400/10 text-green-400' 
                                        : q.status === 'current'
                                          ? 'bg-primary/10 text-primary animate-pulse'
                                          : 'bg-muted/10 text-muted-foreground'
                                    }`}>
                                      {typeIcons[item.type || 'feature']}
                                    </span>
                                    
                                    {/* Item Content */}
                                    <div className="flex-1 min-w-0">
                                      <span className={`text-sm ${
                                        item.done ? 'text-foreground' : 'text-muted-foreground'
                                      }`}>
                                        {item.text}
                                        
                                        {/* Link for courses/certs */}
                                        {item.link && (
                                          <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
                                          >
                                            <ExternalLink size={10} />
                                          </a>
                                        )}
                                      </span>
                                      
                                      {/* Date badge for some items */}
                                      {item.date && (
                                        <span className="text-[9px] font-mono text-muted-foreground/60 ml-auto block mt-0.5">
                                          {item.date}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Quarter CTA if current/upcoming */}
                              {(q.status === 'current' || q.status === 'upcoming') && (
                                <div className="mt-4 pt-4 border-t border-border/30">
                                  {q.status === 'current' ? (
                                    <a
                                      href="#"
                                      className="block w-full text-center py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg font-mono text-sm hover:bg-primary/20 transition-all"
                                    >
                                      <Zap size={14} className="inline mr-2" />
                                      تتبع تقدمي في هذا الربع
                                    </a>
                                  ) : (
                                    <div className="flex gap-2">
                                      <button className="flex-1 py-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-lg font-mono text-xs hover:bg-yellow-400/20 transition-all">
                                        <Bell size={12} className="inline mr-1" />
                                        نبّني عند الوصول
                                      </button>
                                      <a href="/contact" className="flex-1 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-m文本-xs hover:bg-primary/20 transition-all text-center">
                                        تواصل للاستفسير
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Overview Section */}
        <section className="py-16 px-4 bg-card/30 border-y border-border">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Certificate size={32} className="mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold mb-2">خطة الشهادات</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                شهادات من أفضل المنصات العالمية — بعضها مجانية وبعضها مدفوعة
              </p>
            </motion.div>

            {/* Certification Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: "Python for Everybody",
                  issuer: "University of Michigan / Solern",
                  platform: "Solern",
                  status: "in-progress",
                  icon: "🐍",
                  color: "from-blue-500/20 to-cyan-400/20",
                  url: "https://www.solern.org/specializations/python-for-everybody",
                  skills: ["Python Basics", "Data Structures", "Web Scraping", "SQL"],
                  description: "تخصص شامل يغطي أساسيات بايثون المتقدمة، هياكل البيانات، واستخراج البيانات من الويب.",
                },
                {
                  name: "Full Stack Developer",
                  issuer: "freeCodeCamp",
                  platform: "freeCodeCamp",
                  status: "planned",
                  icon: "🏆",
                  color: "from-orange-600/20 to-orange-400/20",
                  url: "https://www.freecodecamp.org/certification/full-stack-developer/",
                  skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
                  description: "شهادة Full Stack Development مجانية ومعترفة دولياً. تغطي كل جوانب تطوير الويب من الصفر إلى قاعدة البيانات.",
                },
                {
                  name: "AWS Cloud Practitioner",
                  issuer: "Amazon Web Services",
                  platform: "AWS",
                  status: "planned",
                  icon: "☁️",
                  color: "from-orange-500/20 to-yellow-400/20",
                  url: "https://aws.amazon.com/certification/cloud-practitioner/",
                  skills: ["EC2", "S3", "Lambda", "API Gateway", "RDS"],
                  description: "شهادة أساسية في خدمات AWS السحابية. تغطي مفاهيم أساسية لبناء وحلول تطبيقات سحاب��ة.",
                },
                {
                  name: "Meta React Developer",
                  issuer: "Meta (Coursera)",
                  platform: "Coursera",
                  status: "completed",
                  icon: "✅",
                  color: "from-green-500/20 to-blue-400/20",
                  url: "#",
                  skills: ["React", "Redux", "Testing", "Hooks"],
                  description: "شهادة احترافية في تطوير React من Meta (فيسبوك). تم تجديد كل جوانب React المتقدمة.",
                },
                {
                  name: "Google UX Design",
                  issuer: "Google (Coursera)",
                  platform: "Coursera",
                  status: "planned",
                  icon: "🎨",
                  color: "from-blue-300/20 to-indigo-400/20",
                  url: "https://coursera.org/professional-certificates/google-ux-design/",
                  skills: ["UX Research", "Wireframing", "Prototyping"],
                  description: "شهادة تصميم تجربة مستخدم من Google. تغطي مهارات تصميم احترافية ومبادئ UI/UX.",
                },
              ].map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-card border rounded-xl overflow-hidden hover:border-primary/30 transition-all group`}
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${cert.color} p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cert.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm">{cert.name}</h3>
                        <p className="text-xs text-foreground/70">{cert.issuer}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      cert.status === 'completed' ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                      cert.status === 'in-progress' ? 'bg-blue-400/20 text-blue-400 border-blue-400/30 animate-pulse' :
                      'bg-gray-400/10 text-gray-400 border-gray-400/30'
                    }`}>
                      {cert.status === 'completed' ? '✅ مكتملة' :
                       cert.status === 'in-progress' ? '🔄 قيد التنفيذ' :
                       '⏳ مخطط لها'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {cert.description}
                    </p>
                    
                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {cert.skills.map((skill, j) => (
                        <span key={j} className="text-[10px] font-mono bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    {cert.url !== '#' && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-2 bg-background/50 border border-border rounded-lg text-xs font-mono text-foreground hover:text-primary hover:border-primary/50 transition-all"
                      >
                        <ExternalLink size={11} className="inline mr-1" />
                        {cert.status === 'completed' ? 'عرض الشهادة' : 'ابدأ الدراسة'}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="bg-card border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-5" />
              <div className="relative z-10">
                <Users size={40} className="mx-auto text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">شاركني في الرحلة!</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  سواء كنت مبتدئاً أو خبيراً، نرحب بك خطوة واضحة.
                  انضم لمجتمع ZERO واحصل على دعم وموارد.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://chat.whatsapp.com/LkJJ5CIyE0mFdFIupB33J9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-mono text-sm hover:bg-primary/90 glow-cyan transition-all"
                  >
                    <MessageCircle size={14} className="ml-1" />
                    تواصل معي
                  </a>
                  <a
                    href="/community"
                    className="inline-flex items-center gap-2 border border-primary/30 text-primary px-6 py-2.5 rounded-xl font-mono text-sm hover:bg-primary/10 transition-all"
                  >
                    <Users size={14} className="ml-1" />
                    انضم المجتمع
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
