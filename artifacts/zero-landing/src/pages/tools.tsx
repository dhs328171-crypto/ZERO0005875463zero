import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  ExternalLink, Search, Star, Code2, Palette, Database, Terminal, Cpu, Smartphone, Zap, 
  Globe, Shield, BarChart3, GitBranch, Package, Layers, Heart, TrendingUp,
  BookOpen, Lightbulb, Rocket, Wrench, Sparkles, Filter, Download,
  FileCode, FileText, Layout, GraduationCap, Play, Trophy, Award as Certificate
} from "lucide-react";

// ============================================
// TYPES
// ============================================
type Tool = {
  name: string;
  desc: string;
  url: string;
  category: string;
  rating: number;
  free: boolean;
  tags: string[];
  color: string;
  icon: React.ReactNode;
  hot?: boolean;
  featured?: boolean;
  useCase?: string;
};

type Resource = {
  title: string;
  desc: string;
  type: "template" | "guide" | "components" | "cheatsheet";
  icon: React.ReactNode;
  category: string;
  downloads: number;
  rating: number;
  tags: string[];
  free: boolean;
  color: string;
};

type LearningPlatform = {
  name: string;
  desc: string;
  url: string;
  icon: string;
  color: string;
  courses?: string[];
  certified?: boolean;
  myProgress?: string;
};

// ============================================
// EXTERNAL TOOLS DATA
// ============================================
const tools: Tool[] = [
  // Development - Core Tools
  { name: "VS Code", desc: "محرر الكود الأكثر انتشاراً. ملحقات لا حصر لها وأداء استثنائي.", url: "https://code.visualstudio.com", category: "تطوير", rating: 5, free: true, tags: ["IDE", "Editor", "Free"], color: "text-blue-400", icon: <Code2 size={24} className="text-blue-400" />, hot: true, featured: true, useCase: "كتابة وتحرير الكود يومياً" },
  { name: "GitHub", desc: "منصة استضافة الكود والتعاون بين المطورين. التحكم في الإصدارات وCI/CD.", url: "https://github.com", category: "تطوير", rating: 5, free: true, tags: ["Git", "Hosting", "Collaboration"], color: "text-white", icon: <GitBranch size={24} className="text-white" />, hot: true, featured: true, useCase: "استضافة المشاريع وإدارة الإصدارات" },
  { name: "Vercel", desc: "النشر الأسرع لمشاريع React و Next.js. تجربة سلسة من الدفع للإنتاج.", url: "https://vercel.com", category: "تطوير", rating: 4.9, free: true, tags: ["Hosting", "Deploy", "Serverless"], color: "text-white", icon: <Zap size={24} className="text-white" />, hot: true, featured: true, useCase: "نشر المواقع والتطبيقات بضغطة واحدة" },
  
  // Backend & Database
  { name: "Supabase", desc: "البديل المفتوح المصدر لـ Firebase. PostgreSQL + Auth + Storage + Realtime.", url: "https://supabase.com", category: "Backend", rating: 4.8, free: true, tags: ["Database", "Backend", "BaaS"], color: "text-green-400", icon: <Database size={24} className="text-green-400" />, hot: true, featured: true, useCase: "قاعدة بيانات سحابية مع مصادقة مستخدمين" },
  { name: "Railway", desc: "نشر سحابي بسيط للـ Backends و Databases. بيئة إنتاجية جاهزة.", url: "https://railway.app", category: "Backend", rating: 4.7, free: true, tags: ["Deploy", "Cloud", "Database"], color: "text-purple-400", icon: <Globe size={24} className="text-purple-400" />, useCase: "تشغيل الـ Backends على السحاب بسهولة" },
  { name: "Drizzle ORM", desc: "ORM من الجيل الجديد لـ TypeScript. أسرع وأبسط من Prisma.", url: "https://orm.drizzle.team", category: "Backend", rating: 4.7, free: true, tags: ["ORM", "Database", "TypeScript"], color: "text-yellow-400", icon: <Database size={24} className="text-yellow-400" />, useCase: "التعامل مع قواعد البيانات بطريقة type-safe" },
  { name: "Bun", desc: "Runtime جديد يُنافس Node.js بسرعة خيالية.", url: "https://bun.sh", category: "تطوير", rating: 4.6, free: true, tags: ["Runtime", "JS", "Fast"], color: "text-orange-300", icon: <Package size={24} className="text-orange-300" />, hot: true, useCase: "تشغيل التطبيقات بسرعة فائقة" },
  
  // Design & UI
  { name: "Figma", desc: "الأداة الذهبية لتصميم الواجهات والـ Prototypes.", url: "https://figma.com", category: "تصميم", rating: 5, free: true, tags: ["UI/UX", "Prototype", "Design"], color: "text-purple-400", icon: <Palette size={24} className="text-purple-400" />, hot: true, featured: true, useCase: "تصميم واجهات المستخدم والـ Prototypes" },
  { name: "shadcn/ui", desc: "مكونات React جاهزة وقابلة للتخصيص الكامل. Accessible ومتجاوبة.", url: "https://ui.shadcn.com", category: "تصميم", rating: 5, free: true, tags: ["Components", "React", "Tailwind"], color: "text-foreground", icon: <Layers size={24} />, hot: true, featured: true, useCase: "بناء واجهات مستخدم احترافية بسرعة" },
  { name: "Tailwind CSS", desc: "Utility-first CSS framework. لبناء تصاميم سريعة وجميلة.", url: "https://tailwindcss.com", category: "تصميم", rating: 5, free: true, tags: ["CSS", "Styling", "Framework"], color: "text-cyan-400", icon: <Palette size={24} className="text-cyan-400" />, useCase: "تنسيق التصاميم بكفاءة عالية" },
  { name: "Framer Motion", desc: "مكتبة انيميشن لـ React. تحويل المواقع إلى تجارب بصرية مذهلة.", url: "https://www.framer.com/motion", category: "تصميم", rating: 4.9, free: true, tags: ["Animation", "React", "Motion"], color: "text-pink-400", icon: <Zap size={24} className="text-pink-400" />, useCase: "إضافة حركات وتأثيرات بصرية مذهلة" },
  { name: "Coolors", desc: "مولد ألوان احترافي. لإيجاد تناسق ألوان مثالي في ثوانٍ.", url: "https://coolors.co", category: "تصميم", rating: 4.7, free: true, tags: ["Colors", "Palette", "Generator"], color: "text-yellow-400", icon: <Sparkles size={24} className="text-yellow-400" />, useCase: "اختيار لوحات ألوان متناسقة للمشاريع" },
  { name: "Lucide Icons", desc: "مكتبة أيقونات SVG نظيفة وجميلة. 1000+ أيقونة مجانية.", url: "https://lucide.dev", category: "تصميم", rating: 4.8, free: true, tags: ["Icons", "SVG", "Library"], color: "text-green-400", icon: <Star size={24} className="text-green-400" />, useCase: "استخدام أيقونات جميلة في المشاريع" },
  
  // AI Tools
  { name: "Claude (Anthropic)", desc: "أذكى نموذج AI للبرمجة والكتابة. يدعم Code Analysis.", url: "https://claude.ai", category: "ذكاء اصطناعي", rating: 5, free: true, tags: ["AI", "Code", "Writing", "Analysis"], color: "text-orange-400", icon: <Cpu size={24} className="text-orange-400" />, hot: true, featured: true, useCase: "مراجعة الكود وكتابة المحتوى الذكية" },
  { name: "GitHub Copilot", desc: "مساعد AI للكتابة الكود مباشرة في VS Code.", url: "https://github.com/features/copilot", category: "ذكاء اصطناعي", rating: 4.8, free: false, tags: ["AI", "Code", "Assistant"], color: "text-primary", icon: <Code2 size={24} className="text-primary" />, hot: true, useCase: "كتابة كود أسرع مع مساعد ذكي" },
  { name: "v0 by Vercel", desc: "توليد مكونات React من وصف نصي.", url: "https://v0.dev", category: "ذكاء اصطناعي", rating: 4.6, free: true, tags: ["AI", "UI", "React", "Generator"], color: "text-white", icon: <Layers size={24} className="text-white" />, useCase: "توليد واجهات من نصوص بسرعة" },
  { name: "Cursor", desc: "محرر كود بالذكاء الاصطناعي. VS Code + AI في واحد.", url: "https://cursor.sh", category: "ذكاء اصطناعي", rating: 4.9, free: true, tags: ["AI", "IDE", "Editor", "Smart"], color: "text-blue-400", icon: <Terminal size={24} className="text-blue-400" />, hot: true, useCase: "بيئة تطوير متكاملة مع AI" },
  
  // Testing & Performance
  { name: "Lighthouse", desc: "أداة Google المجانية لقياس أداء المواقع.", url: "https://developer.chrome.com/docs/lighthouse", category: "الأداء", rating: 4.9, free: true, tags: ["Performance", "SEO", "Audit", "Free"], color: "text-yellow-400", icon: <BarChart3 size={24} className="text-yellow-400" />, useCase: "تحليل أداء المواقع وحل المشاكل" },
  { name: "Playwright", desc: "اختبار end-to-end قوي ومعتمد. يدعم كل المتصفحات.", url: "https://playwright.dev", category: "الأداء", rating: 4.7, free: true, tags: ["Testing", "E2E", "Automation"], color: "text-green-400", icon: <Shield size={24} className="text-green-400" />, useCase: "اختبار الموقع آلياً على كل المتصفحات" },
  { name: "Sentry", desc: "تتبع الأخطاء في الإنتاج. تنبيهات فورية عند حدوث مشاكل.", url: "https://sentry.io", category: "الأداء", rating: 4.8, free: true, tags: ["Monitoring", "Errors", "Alerts"], color: "text-purple-400", icon: <Shield size={24} className="text-purple-400" />, useCase: "متابعة الأخطاء وإشعار فوري" },
  
  // Mobile Development
  { name: "Expo", desc: "إطار React Native المُبسَّط. بناء تطبيقات iOS وAndroid بكود واحد.", url: "https://expo.dev", category: "موبايل", rating: 4.8, free: true, tags: ["Mobile", "React Native", "Cross-platform"], color: "text-white", icon: <Smartphone size={24} className="text-white" />, useCase: "بناء تطبيقات موبايل بـ React Native" },
  { name: "React Native", desc: "المعيار الذهبي لبناء تطبيقات جوال بـ JavaScript.", url: "https://reactnative.dev", category: "موبايل", rating: 4.7, free: true, tags: ["Mobile", "Cross-platform", "JS"], color: "text-cyan-400", icon: <Smartphone size={24} className="text-cyan-400" />, useCase: "تطوير تطبيقات موبايل للأندرويد وiOS" },
];

// ============================================
// DOWNLOADABLE RESOURCES DATA (merged from resources.tsx)
// ============================================
const resources: Resource[] = [
  {
    title: "قالب Next.js Starter احترافي",
    desc: "قالب جاهز مع Auth، Dark Mode، i18n، Tailwind، وهيكل مشروع مثالي",
    type: "template",
    icon: <Layout size={20} />,
    category: "قوالب",
    downloads: 1240,
    rating: 4.9,
    tags: ["Next.js", "TypeScript", "Tailwind"],
    free: true,
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "دليل Best Practices للـ React",
    desc: "مرجع شامل لأفضل ممارسات React من المشاريع الحقيقية",
    type: "guide",
    icon: <FileText size={20} />,
    category: "أدلة",
    downloads: 890,
    rating: 4.8,
    tags: ["React", "Performance", "Patterns"],
    free: true,
    color: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "مكونات UI بالعربي RTL",
    desc: "مجموعة مكونات shadcn/ui مخصصة للغة العربية وRTL",
    type: "components",
    icon: <Layout size={20} />,
    category: "مكونات",
    downloads: 2100,
    rating: 5.0,
    tags: ["RTL", "Arabic", "shadcn"],
    free: true,
    color: "from-purple-500/10 to-violet-500/10",
  },
  {
    title: "Cheatsheet للـ Git والـ Terminal",
    desc: "مرجع سريع لأهم أوامر Git و Linux Terminal للمطورين",
    type: "cheatsheet",
    icon: <Terminal size={20} />,
    category: "مراجع",
    downloads: 3400,
    rating: 4.9,
    tags: ["Git", "Linux", "CLI"],
    free: true,
    color: "from-orange-500/10 to-amber-500/10",
  },
  {
    title: "API Integration Guide",
    desc: "كيفية التكامل مع APIs شائعة (Stripe, Firebase, AWS) بأمثلة كاملة",
    type: "guide",
    icon: <FileCode size={20} />,
    category: "أدلة",
    downloads: 670,
    rating: 4.7,
    tags: ["API", "Stripe", "Firebase"],
    free: true,
    color: "from-red-500/10 to-rose-500/10",
  },
  {
    title: "Database Schema Templates",
    desc: "قوالب جداول قواعد البيانات لأشهر أنواع التطبيقات",
    type: "template",
    icon: <FileCode size={20} />,
    category: "قوالب",
    downloads: 780,
    rating: 4.8,
    tags: ["PostgreSQL", "Schema", "Drizzle"],
    free: true,
    color: "from-teal-500/10 to-cyan-500/10",
  },
  {
    title: "قائمة فحص قبل الإطلاق",
    desc: "Checklist شاملة لما يجب التحقق منه قبل إطلاق أي موقع أو تطبيق",
    type: "cheatsheet",
    icon: <FileText size={20} />,
    category: "مراجع",
    downloads: 1890,
    rating: 5.0,
    tags: ["SEO", "Performance", "Security"],
    free: true,
    color: "from-indigo-500/10 to-blue-500/10",
  },
  {
    title: "Tailwind CSS Custom Design System",
    desc: "نظام تصميم متكامل مبني على Tailwind مع ألوان وخطوط وتباعد موحّد",
    type: "template",
    icon: <Layout size={20} />,
    category: "قوالب",
    downloads: 1120,
    rating: 4.9,
    tags: ["Tailwind", "Design", "CSS"],
    free: true,
    color: "from-pink-500/10 to-rose-500/10",
  },
];

// ============================================
// LEARNING PLATFORMS & CERTIFICATIONS
// ============================================
const learningPlatforms: LearningPlatform[] = [
  { 
    name: "Sololearn", 
    desc: "منصة تعليمية ضخمة - شهادتي الأولى في Python قريباً! 🎉", 
    url: "https://www.sololearn.com", 
    icon: "🎓", 
    color: "border-blue-400/30 bg-blue-400/5",
    courses: ["Python (قريباً)", "JavaScript", "HTML/CSS"],
    certified: false,
    myProgress: "Python: 90% ✅"
  },
  { 
    name: "freeCodeCamp", 
    desc: "منصة تعليم مجانية ومعترفة دولياً - الهدف القادم!", 
    url: "https://www.freecodecamp.org", 
    icon: "🏆", 
    color: "border-orange-400/30 bg-orange-400/5",
    courses: ["Full Stack", "Data Science", "Python"],
    certified: false,
    myProgress: "قريباً 💪"
  },
  { 
    name: "Coursera", 
    desc: "دورات من جامعات Stanford, Yale, Google وغيرها", 
    url: "https://www.coursera.org", 
    icon: "🎯", 
    color: "border-indigo-400/30 bg-indigo-400/5",
    certified: false
  },
  { 
    name: "YouTube Coding", 
    desc: "قنوات برمجة مجانية - Traversy Media, Fireship, Net Ninja", 
    url: "https://youtube.com", 
    icon: "📺", 
    color: "border-red-400/30 bg-red-400/5",
    certified: false
  },
];

// ============================================
// CATEGORIES CONFIG
// ============================================
const toolCategories = [
  { id: "all", label: "الكل", icon: <Filter size={14} /> },
  { id: "تطوير", label: "تطوير", icon: <Code2 size={14} /> },
  { id: "تصميم", label: "تصميم", icon: <Palette size={14} /> },
  { id: "ذكاء اصطناعي", label: "AI", icon: <Cpu size={14} /> },
  { id: "Backend", label: "Backend", icon: <Database size={14} /> },
  { id: "الأداء", label: "الأداء", icon: <TrendingUp size={14} /> },
  { id: "موبايل", label: "موبايل", icon: <Smartphone size={14} /> },
];

const resourceCategories = ["الكل", "قوالب", "أدلة", "مكونات", "مراجع"];

// Tab types
type ActiveTab = 'tools' | 'resources' | 'learning';

export default function Tools() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tools');
  const [resourceCat, setResourceCat] = useState("الكل");

  // Filter tools
  const filteredTools = useMemo(() => {
    let result = tools.filter((t) => {
      const matchCat = activeCategory === "all" || t.category === activeCategory || 
                     (activeCategory === 'AI' && t.category === 'ذكاء اصطناعي');
      const matchSearch = !search || 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.desc.includes(search) || 
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
    if (showFavorites) result = result.filter(t => t.hot);
    return result;
  }, [search, activeCategory, showFavorites]);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = resourceCat === "الكل" || r.category === resourceCat;
      const matchSearch = !search || r.title.includes(search) || r.desc.includes(search);
      return matchCat && matchSearch;
    });
  }, [search, resourceCat]);

  const hotTools = tools.filter((t) => t.hot);
  const featuredTools = tools.filter((t) => t.featured);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-15" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-mono text-primary text-xs tracking-widest uppercase mb-4 block inline-flex items-center gap-2">
              <Wrench size={14} />
              toolbox.curated()
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              صندوق <span className="text-primary glow-cyan-text">الأدوات والموارد</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              أدوات خارجية + قوالب مجانية + منصات تعلم
              <br />
              <span className="text-sm text-primary/70">كل اللي تحتاجه في مشروعك الواحد</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { value: tools.length, label: "أداة خارجية", icon: <Wrench size={18} />, color: "text-primary" },
              { value: resources.length, label: "مورد مجاني", icon: <Download size={18} />, color: "text-green-400" },
              { value: learningPlatforms.length, label: "منصة تعلم", icon: <GraduationCap size={18} />, color: "text-blue-400" },
              { value: tools.filter(t => t.free).length + resources.filter(r => r.free).length, label: "مجاني", icon: <Heart size={18} />, color: "text-red-400" },
              { value: tools.filter(t => t.hot).length, label: "مفضلة 🔥", icon: <Star size={18} />, color: "text-yellow-400" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-center gap-2 p-3">
                <span className={`${stat.color}`}>{stat.icon}</span>
                <div>
                  <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <section className="py-6 px-4 sticky top-16 md:top-20 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'tools' as ActiveTab, label: '🛠️ أدوات خارجية', count: tools.length },
              { id: 'resources' as ActiveTab, label: '📦 موارد مجانية', count: resources.length },
              { id: 'learning' as ActiveTab, label: '🎓 تعلم وشهادات', count: learningPlatforms.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-primary glow-cyan shadow-lg shadow-primary/20"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:bg-card"
                }`}
              >
                {tab.label}
                <span className="text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TOOLS TAB ==================== */}
      {activeTab === 'tools' && (
        <>
          {/* Featured Tools */}
          <section className="pb-8 px-4">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-mono text-sm text-yellow-400">المفضلة لديّ</span>
              </motion.div>
              
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {featuredTools.map((t, i) => (
                  <motion.a
                    key={i}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex-shrink-0 flex items-center gap-3 bg-card border border-primary/20 hover:border-primary/40 rounded-xl p-4 transition-all group min-w-[200px]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:scale-110 transition-all">
                      {t.icon}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{t.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{t.useCase}</p>
                    </div>
                    <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0" />
                  </motion.a>
                ))}
              </div>
            </div>
          </section>

          {/* Search & Filter */}
          <section className="py-6 px-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث عن أداة... (VS Code, Figma, AI...)"
                    className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                  {toolCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all border whitespace-nowrap ${
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground border-primary glow-cyan shadow-lg shadow-primary/20"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-card"
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all border whitespace-nowrap ${
                    showFavorites
                      ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                      : "border-border text-muted-foreground hover:border-yellow-400/30"
                  }`}
                >
                  <Star size={14} className={showFavorites ? "fill-yellow-400" : ""} />
                  المفضلة فقط
                </button>
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          <section className="pb-24">
            <div className="container mx-auto px-4">
              <p className="text-xs text-muted-foreground font-mono mb-6">
                {showFavorites ? '🔥' : ''} عرض {filteredTools.length} أداة
                {activeCategory !== 'all' && ` في ${toolCategories.find(c => c.id === activeCategory)?.label}`}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTools.map((tool, i) => (
                  <motion.a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 group relative transition-all cursor-pointer"
                  >
                    {tool.hot && (
                      <span className="absolute -top-2 -right-2 text-[10px] font-mono bg-orange-400 text-white px-2 py-0.5 rounded-full shadow-lg z-10">
                        🔥
                      </span>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:scale-110 transition-all`}>
                        {tool.icon}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {tool.hot && <span className="text-[10px]">🔥</span>}
                        {tool.free ? (
                          <span className="text-[10px] font-mono bg-green-400/10 text-green-400 border border-green-400/20 px-1.5 py-0.5 rounded">مجاني</span>
                        ) : (
                          <span className="text-[10px] font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-1.5 py-0.5 rounded">$</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{tool.name}</h3>
                      <ExternalLink size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{tool.desc}</p>

                    {tool.useCase && (
                      <div className="mb-3 p-2 bg-primary/5 border border-primary/10 rounded-lg">
                        <p className="text-[10px] text-primary/80 flex items-start gap-1">
                          <Rocket size={8} className="flex-shrink-0 mt-0.5" />
                          {tool.useCase}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {tool.tags.slice(0, 2).map((tag, j) => (
                          <span key={j} className="text-[10px] font-mono bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        {tool.tags.length > 2 && (
                          <span className="text-[10px] font-mono text-muted-foreground">+{tool.tags.length - 2}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={11} className="fill-yellow-400" />
                        <span className="text-xs font-mono">{tool.rating}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-20">
                  <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">لا توجد أدوات</h3>
                  <button onClick={() => { setSearch(''); setActiveCategory('all'); setShowFavorites(false); }} className="text-primary hover:underline text-sm">
                    مسح الفلتر
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ==================== RESOURCES TAB ==================== */}
      {activeTab === 'resources' && (
        <section className="pb-24">
          <div className="container mx-auto px-4">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث في الموارد..."
                  className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {resourceCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setResourceCat(c)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${
                      resourceCat === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredResources.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`bg-gradient-to-br ${r.color} border border-border rounded-xl p-5 hover:border-primary/30 transition-all group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-background/80 border border-border rounded-xl flex items-center justify-center flex-shrink-0">
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
                        {r.free && (
                          <span className="text-[10px] font-mono text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full flex-shrink-0">
                            مجاني
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{r.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {r.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono text-muted-foreground bg-background/50 border border-border px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Download size={11} />{r.downloads.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Star size={11} className="fill-yellow-400 text-yellow-400" />{r.rating}</span>
                        </div>
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-7 px-3 font-mono glow-cyan rounded-lg flex items-center gap-1 transition-all">
                          <Download size={11} />
                          تنزيل
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-20">
                <Download size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">لا توجد موارد</h3>
                <button onClick={() => { setSearch(''); setResourceCat('الكل'); }} className="text-primary hover:underline text-sm">
                  مسح الفلتر
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== LEARNING TAB ==================== */}
      {activeTab === 'learning' && (
        <section className="pb-24">
          <div className="container mx-auto px-4">
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <GraduationCap size={48} className="mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">رحلتي التعليمية</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                "التعلم المستمر هو مفتاح النجاح" - هذه المنصات أساعدني في تطوير مهاراتي
                <br />
                <span className="text-primary font-mono text-sm">شهادتي الأولى (Python) قريبة جداً! 🎉</span>
              </p>
            </motion.div>

            {/* Certification Status Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20 rounded-2xl p-8 mb-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 cyber-grid opacity-5" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-primary/20 border-2 border-primary/30 rounded-2xl flex items-center justify-center">
                  <Certificate size={36} className="text-primary" />
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-xl font-bold mb-2">🎯 هدف الشهادات 2026</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Python من Sololearn ← نحن هنا تقريباً! | بعد كده: شهادات FreeCodeCamp
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-full text-xs font-mono">
                      🐍 Python (Sololearn) - 90%
                    </span>
                    <span className="px-3 py-1 bg-orange-400/10 text-orange-400 border border-orange-400/20 rounded-full text-xs font-mono">
                      🌐 Full Stack (FCC) - قريباً
                    </span>
                    <span className="px-3 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-full text-xs font-mono">
                      📊 Data Science (FCC) - مستقبل
                    </span>
                  </div>
                </div>
                <Trophy size={48} className="text-yellow-400/30 hidden md:block" />
              </div>
            </motion.div>

            {/* Platforms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {learningPlatforms.map((platform, i) => (
                <motion.a
                  key={i}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  className={`block bg-card border ${platform.color} rounded-xl p-5 hover:bg-card transition-all group relative`}
                >
                  {platform.myProgress && (
                    <span className="absolute -top-2 -left-2 text-[10px] font-mono bg-primary text-white px-2 py-0.5 rounded-full">
                      نشط 📍
                    </span>
                  )}
                  
                  <span className="text-4xl mb-3 block">{platform.icon}</span>
                  <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{platform.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{platform.desc}</p>
                  
                  {platform.myProgress && (
                    <div className="mb-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-[10px] font-mono text-primary">{platform.myProgress}</p>
                    </div>
                  )}
                  
                  {platform.courses && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">الدورات:</p>
                      {platform.courses.map((course, j) => (
                        <p key={j} className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen size={10} />
                          {course}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 mt-3 transition-opacity" />
                </motion.a>
              ))}
            </div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-card/50 border border-border rounded-2xl p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-400" />
                نصائح للتعلم
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "🎯", title: "حدد هدفاً واحداً", desc: "ركز على Python الآن، ما تكثر على نفسك" },
                  { icon: "⏰", title: "30 دقيقة يومياً", desc: "الاستمرارية أهم من الساعات الطويلة" },
                  { icon: "🏗️", title: "طبّق فوراً", desc: "كل ما تتعلمه طبّقه في مشروع حقيقي" },
                ].map((tip, i) => (
                  <div key={i} className="bg-background border border-border rounded-xl p-4">
                    <span className="text-2xl mb-2 block">{tip.icon}</span>
                    <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
