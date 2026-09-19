import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Zap, Bug, Wrench, Star, Calendar, Download, Filter, Search, ChevronUp, GitBranch, Eye, Clock, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";

// Enhanced releases with more details
interface Change {
  type: 'new' | 'improve' | 'fix' | 'security' | 'breaking';
  text: string;
  issue?: string;
}

interface Release {
  version: string;
  date: string;
  label: 'latest' | 'stable' | 'legacy';
  changes: Change[];
  highlights?: string[];
  downloads?: number;
}

const releases: Release[] = [
  {
    version: "v3.0.0",
    date: "يوليو 2026",
    label: "latest",
    highlights: ["🎉 أضخم 6 صفحات جديدة", "🔐 حماية متعددة الطبقات", "📱 PWA Support", "🛠️ دمج الأدوات والموارد"],
    changes: [
      { type: "new", text: "نظام تسجيل المستخدمين الجديد مع صفحات Login وRegister" },
      { type: "new", text: "صفحات جديدة: الشركاء، خارطة الطريق، التغييرات، المجتمع" },
      { type: "new", text: "صفحات الشروط والأحكام وسياسة الخصوصية" },
      { type: "new", text: "صفحة التقييمات العامة مع فلتر وتصفح" },
      { type: "new", text: "نظام صلاحيات متكامل (Admin/User/Guest)" },
      { type: "new", text: "دمج صفحة Tools + Resources في صفحة واحدة متكاملة" },
      { type: "new", text: "تحسين صفحة CV مع قسم الشهادات والكورسات البارز" },
      { type: "improve", text: "Footer محسّن مع روابط شاملة لكل الصفحات" },
      { type: "improve", text: "Navbar محدّث مع زر تسجيل الدخول/الخروج" },
      { type: "fix", text: "إصلاح PageLoader ليظهر على الصفحة الرئيسية فقط" },
    ],
    downloads: 245,
  },
  {
    version: "v2.5.0",
    date: "أبريل 2026",
    label: "stable",
    highlights: ["📝 نظام المدونة", "🛒️ CRM System", "📊 Kanban Board"],
    changes: [
      { type: "new", text: "صفحة تواصل معي مع نموذج ذكي وsidebar" },
      { type: "new", text: "مدونة ZERO مع 9 مقالات وبحث وفلتر" },
      { type: "new", text: "صفحة تفاصيل المقال مع TOC وCode Blocks" },
      { type: "new", text: "صفحة الخدمات مع 6 خدمات وTabs" },
      { type: "new", text: "5 صفحات أدمن: التقييمات، FAQ، المهارات، الوسائط، SEO" },
      { type: "new", text: "SearchModal بـ Cmd+K للبحث السريع" },
      { type: "new", text: "CookieConsent GDPR مع تخصيص التفضيلات" },
      { type: "improve", text: "AdminLayout بـ 4 مجموعات و16 رابط" },
    ],
    downloads: 189,
  },
  {
    version: "v2.0.0",
    date: "مارس 2026",
    label: "stable",
    highlights: ["🚀 لوحة الأدمن الكاملة", "📊 Analytics Dashboard", "💬 CRM"],
    changes: [
      { type: "new", text: "لوحة التحكم الإدارية الكاملة مع Dashboard" },
      { type: "new", text: "إدارة المشاريع مع Kanban Board" },
      { type: "new", text: "نظام إدارة العملاء CRM" },
      { type: "new", text: "لوحة التحليلات مع Charts تفاعلية" },
      { type: "new", text: "سجل الأنشطة Activity Log" },
      { type: "new", text: "نظام الرسائل والإشعارات" },
      { type: "improve", text: "تحسينات شاملة على الأداء وسرعة التحميل" },
      { type: "fix", text: "إصلاح مشكلة RTL في بعض المكونات" },
    ],
    downloads: 156,
  },
  {
    version: "v1.5.0",
    date: "فبراير 2026",
    label: "legacy",
    highlights: ["🛒️ معرض أعمال", "💰 أسعار تفاعلية", "📱 دعم فني"],
    changes: [
      { type: "new", text: "صفحة معرض الأعمال مع فلتر متقدم" },
      { type: "new", text: "صفحة العملاء مع إحصائيات وشهادات" },
      { type: "new", text: "صفحة الأسعار التفاعلية مع مقارنة الباقات" },
      { type: "new", text: "صفحة الدعم الفني مع نموذج وFAQ" },
      { type: "new", text: "ScrollProgress و FloatingCTA" },
      { type: "improve", text: "تحسين التصميم العام وإضافة تأثيرات Cyberpunk" },
    ],
    downloads: 98,
  },
  {
    version: "v1.0.0",
    date: "يناير 2026",
    label: "legacy",
    highlights: ["🚀 الإطلاق الأول", "🎨 Dark Theme", "⚡ Core Features"],
    changes: [
      { type: "new", text: "إطلاق موقع ZERO الأول" },
      { type: "new", text: "الصفحة الرئيسية مع Hero وStats وخدمات" },
      { type: "new", text: "صفحة من أنا مع Timeline والمهارات" },
      { type: "new", text: "نظام المصادقة الأساسي للمدير" },
      { type: "new", text: "تصميم Dark Cyberpunk مع نيون سيان" },
    ],
    downloads: 45,
  },
];

// Type configuration with icons and colors
const typeConfig = {
  new: { 
    icon: Plus, 
    color: "text-green-400", 
    bg: "bg-green-400/10 border-green-400/20", 
    label: "جديد 🆕" 
  },
  improve: { 
    icon: Zap, 
    color: "text-primary", 
    bg: "bg-primary/10 border-primary/20", 
    label: "تحسين ⚡" 
  },
  fix: { 
    icon: Bug, 
    color: "text-red-400", 
    bg: "bg-red-400/10 border-red-400/20", 
    label: "إصلاح 🔧" 
  },
  security: { 
    icon: Shield, 
    color: "text-purple-400", 
    bg: "bg-purple-400/10 border-purple-400/20", 
    label: "أمان 🔐" 
  },
  breaking: { 
    icon: AlertTriangle, 
    color: "text-orange-400", 
    bg: "bg-orange-400/10 border-orange-400/20", 
    label: "تغيير جذري ⚠️" 
  },
};

const labelConfig = {
  latest: "bg-primary/20 text-primary border-primary/30 shadow-lg shadow-primary/5 animate-pulse",
  stable: "bg-green-400/10 text-green-400 border-green-400/20",
  legacy: "bg-muted/50 text-muted-foreground border-border",
};

export default function Changelog() {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  
  const { dir } = useI18n();

  // Filter logic
  const filteredReleases = releases.filter(rel => {
    const matchesSearch = !searchQuery || 
      rel.version.includes(searchQuery) || 
      rel.changes.some(c => c.text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = activeTypeFilter === 'all' || rel.changes.some(c => c.type === activeTypeFilter);
    
    return matchesSearch && matchesType;
  });

  // Stats
  const totalChanges = releases.reduce((acc, rel) => acc + rel.changes.length, 0);
  const newFeatures = releases.reduce((acc, rel) => acc + rel.changes.filter(c => c.type === 'new').length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Navbar />
      <main className="pt-24">
        
        {/* Hero */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="container mx-auto max-w-3xl relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-xs text-primary mb-3 tracking-widest uppercase inline-flex items-center gap-2">
                <GitBranch size={14} />
                changelog.history()
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                سجل <span className="text-primary glow-cyan-text">التغييرات</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                تاريخ كامل لكل تحديث وتطوير — شفافية ومفتوحة
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="bg-card/50 border border-border rounded-lg px-4 py-2 text-center">
                  <span className="text-2xl font-bold font-mono text-primary">{releases.length}</span>
                  <span className="text-xs text-muted-foreground block">إصدار</span>
                </div>
                <div className="bg-card/50 border border-border rounded-lg px-4 py-2 text-center">
                  <span className="text-2xl font-bold font-mono text-green-400">{totalChanges}</span>
                  <span className="text-xs text-muted-foreground block">تغيير</span>
                </div>
                <div className="bg-card/50 border border-border rounded-lg px-4 py-2 text-center">
                  <span className="text-2xl font-bold font-mono text-blue-400">{newFeatures}</span>
                  <span className="text-xs text-muted-foreground block">ميزة جديدة</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Type Filters */}
        <section className="px-4 pb-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveTypeFilter('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                  activeTypeFilter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                <Eye size={12} /> الكل ({totalChanges})
              </button>
              {Object.entries(typeConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveTypeFilter(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                    activeTypeFilter === key
                      ? `${config.bg} ${config.color}`
                      : 'border-border text-muted-foreground hover:border-border/30'
                  }`}
                >
                  <config.icon size={12} className={config.color} />
                  {config.label}
                  ({releases.filter(r => r.changes.some(c => c.type === key)).length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-xl">
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في التحديثات... (v3.0, bug, security)..."
                className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Releases */}
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-3xl space-y-6">
            {filteredReleases.map((rel, i) => {
              const s = labelConfig[rel.label as keyof typeof labelConfig];
              
              return (
                <motion.div
                  key={rel.version}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all ${
                    selectedVersion === rel.version ? 'ring-2 ring-primary/30 scale-[1.02]' : ''
                  }`}
                >
                  {/* Header - Clickable to expand/collapse */}
                  <div 
                    onClick={() => setSelectedVersion(selectedVersion === rel.version ? null : rel.version)}
                    className={`flex items-center justify-between px-5 py-4 border-b ${s.split(' ')[0]} cursor-pointer hover:bg-card/50 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <Tag size={14} className="text-primary" />
                      <span className="font-mono font-bold text-foreground">{rel.version}</span>
                      
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${s}`}>
                        {rel.label === 'latest' ? '🔥 الأحدث' : rel.label === 'stable' ? '✅ مستقر' : '📜 قديم'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {rel.date}
                      </span>
                      {rel.downloads && (
                        <span className="flex items-center gap-1">
                          <Download size={10} /> {rel.downloads.toLocaleString()}
                        </span>
                      )}
                      <ChevronUp 
                        size={14} 
                        className={`transition-transform ${selectedVersion === rel.version ? '' : 'rotate-180'}`} 
                      />
                    </div>
                  </div>

                  {/* Highlights - Show when collapsed */}
                  {!selectedVersion && rel.highlights && (
                    <div className="px-5 pb-3 flex flex-wrap gap-2 border-b border-dashed border-border/30">
                      {rel.highlights.map((h, j) => (
                        <span key={j} className="text-[10px] font-mono bg-background px-2 py-0.5 rounded text-muted-foreground">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Changes List - Always visible or expandable */}
                  <AnimatePresence>
                    <motion.div
                      initial={false}
                      animate={{ height: selectedVersion === rel.version || rel.label === 'latest' ? 'auto' : '0', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 space-y-2">
                        {rel.changes.map((change, j) => {
                          const t = typeConfig[change.type];
                          return (
                            <div key={j} className="flex items-start gap-3 group/item">
                              <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${t.bg}`}>
                                <t.icon size={9} className={t.color} />
                                <span className={t.color}>{t.label}</span>
                              </span>
                              <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                                {change.text}
                              </span>
                              
                              {change.issue && (
                                <span className="text-[10px] font-mono text-red-400 ml-2 opacity-60">
                                  ({change.issue})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded Stats */}
                      {selectedVersion === rel.version && (
                        <div className="px-5 pb-5 border-t border-dashed border-border/30">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            <div className="text-center p-2 bg-background rounded-lg">
                              <div className="text-lg font-bold text-primary font-mono">{rel.changes.length}</div>
                              <div className="text-[10px] text-muted-foreground">إجمالي التغييرات</div>
                            </div>
                            <div className="text-center p-2 bg-background rounded-lg">
                              <div className="text-lg font-bold text-green-400 font-mono">
                                {rel.changes.filter(c => c.type === 'new').length}
                              </div>
                              <div className="text-[10px] text-muted-foreground">جديد</div>
                            </div>
                            <div className="text-center p-2 bg-background rounded-lg">
                              <div className="text-lg font-bold text-blue-400 font-mono">
                                {rel.changes.filter(c => c.type === 'improve').length}
                              </div>
                              <div className="text-[10px] text-muted-foreground">تحسينات</div>
                            </div>
                            <div className="text-center p-2 bg-background rounded-lg">
                              <div className="text-lg font-bold text-red-400 font-mono">
                                {rel.changes.filter(c => c.type === 'fix').length}
                              </div>
                              <div className="text-[10px] text-muted-foreground">إصلاحات</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Empty State */}
            {filteredReleases.length === 0 && (
              <div className="text-center py-20">
                <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-mono">لا توجد نتائج مطابقة للبحث</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveTypeFilter('all'); }}
                  className="mt-4 text-primary hover:underline text-sm"
                >
                  مسح الفلتر
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-5" />
              <div className="relative z-10">
                <Download size={32} className="mx-auto text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">حمّل أحدث إصدار</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  احصل على ملف PDF بكل التحديثات والتعديلات
                </p>
                
                <Button 
                  variant="outline" 
                  className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary-foreground font-mono"
                  asChild
                >
                  <a href="#" download className="inline-flex items-center gap-2">
                    <Download size={14} />
                    تحميل CHANGES.md
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
