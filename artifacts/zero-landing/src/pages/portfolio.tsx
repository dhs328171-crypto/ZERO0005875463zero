import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbox } from "@/components/ui/lightbox";
import { ExternalLink, Eye, Filter, Search, Loader2, Play, CheckCircle2, X, ArrowUpLeft } from "lucide-react";
import { useT } from "@/contexts/i18n-context";
import { useProjects } from "@/lib/queries";
import { getImageUrl } from "@/lib/api";
import { Pager } from "@/components/ui/pager";

const workVideos = [
  { video: "438c100d-dc79-47b3-8c83-83c8c4f6b35e-watermark.mp4", poster: "438c100d-dc79-47b3-8c83-83c8c4f6b35e-watermark.jpg", title: "ZeusControl — AI-GP 1.0", description: "مركز قيادة عربي لإدارة أنظمة الذكاء الاصطناعي والبنية التحتية وتوليد مخرجات دورة تطوير البرمجيات.", category: "AI Orchestration", focus: "AI/ML · Code Generation · Infrastructure", tech: "AI/ML · SQL · Regex · Git", role: "تصميم تجربة مركز القيادة وتوثيق قدرات النظام", repo: "مطابقة GitHub غير مثبتة", repoUrl: "", confidence: "غير مؤكد", features: ["أنماط Learning وExecution وAutonomous وSafe", "توليد الكود وإصلاح الأخطاء واستعلامات SQL", "توليد Regex والتوثيق والاختبارات", "مراقبة CPU والذاكرة وسجل الاتصالات", "Workflow وأدوات VR/AR وشبكات عصبية"] },
  { video: "4b131442-4226-487c-b44b-392f480e92eb-watermark.mp4", poster: "4b131442-4226-487c-b44b-392f480e92eb-watermark.jpg", title: "GLORY STORE", description: "منصة عربية لشحن الألعاب والخدمات الرقمية مع عضويات وأسعار متعددة العملات.", category: "Game Top-up", focus: "E-commerce · Game Services · Arabic RTL", tech: "React · Express · PostgreSQL · JWT", role: "تطوير واجهة المتجر والعمليات الرقمية", repo: "glory-store-updated", repoUrl: "https://github.com/dhs328171-crypto/glory-store-updated", confidence: "مطابقة قوية", features: ["تحويل عملات بين الجنيه والدينار والريال", "مستويات عضوية VIP من عادي إلى ماسي", "اختيار الألعاب وباقات الشحن", "تسجيل حساب ودخول المستخدم", "شحن فوري وأسعار تنافسية وحماية ودعم ونقاط"] },
  { video: "827b2ca4-cca0-4774-a48e-9e5bd7563935-watermark.mp4", poster: "827b2ca4-cca0-4774-a48e-9e5bd7563935-watermark.jpg", title: "Game Shop", description: "واجهة متجر عربية لخدمات شحن الألعاب مع شبكة ألعاب ولوحة إدارة للباقات والطلبات.", category: "Game Shop", focus: "Game Catalog · Orders · Admin CRUD", tech: "React · Tailwind · REST API", role: "تصميم تجربة المتجر ولوحة الإدارة", repo: "game-charge-platform — مرشح", repoUrl: "https://github.com/dhs328171-crypto/game-charge-platform", confidence: "مرشح بصري", features: ["تصنيف الألعاب حسب النوع", "شبكة ألعاب مع الأكثر طلباً", "إدارة الألعاب والباقات والأسعار", "متابعة الطلبات وحالاتها", "صفحة هبوط عربية RTL مع معلومات الدفع والدعم"] },
  { video: "VID_20260904_104319_1.mp4", poster: "VID_20260904_104319_1.jpg", title: "Moataz Sobhi Lawi — LMS", description: "نظام إدارة تعليمي عربي بلوحة تحكم للكورسات والامتحانات والطلاب وسجلات التدقيق.", category: "Education Platform", focus: "LMS · Admin Dashboard · Python", tech: "Python · Git · REST API", role: "تطوير نظام التعليم وإدارة المحتوى", repo: "project-001 — غير موجود في مستودعات GitHub المفحوصة", repoUrl: "", confidence: "اسم المشروع ظاهر في الفيديو فقط", features: ["تسجيل الطلاب والملف التعريفي", "إدارة الكورسات والامتحانات والمحاضرات", "لوحة شرف للطلاب", "سجل تدقيق لعمليات الدفع والأمان", "إدارة المجموعات وبنك الأسئلة والكوبونات"] },
  { video: "VID_20260904_110540.mp4", poster: "VID_20260904_110540.jpg", title: "WaBot Pro", description: "منصة SaaS لإدارة WhatsApp وTelegram والبوتات والعملاء والعمليات التجارية.", category: "Automation SaaS", focus: "WhatsApp · Telegram · CRM · AI", tech: "Node.js · React · PostgreSQL · REST API", role: "تطوير لوحة التحكم وخدمات الأتمتة", repo: "wabot-pro-source", repoUrl: "https://github.com/dhs328171-crypto/wabot-pro-source", confidence: "مطابقة مباشرة", features: ["ربط WhatsApp عبر QR ومراقبة الجلسة", "إدارة الأوامر والبوتات والرسائل", "جهات اتصال وحملات Broadcast وقوالب", "جدولة الرسائل والإحصائيات", "إدارة الاشتراكات والمنتجات والطلبات"] },
  { video: "VID_20260905_091913.mp4", poster: "VID_20260905_091913.jpg", title: "Moalim Khowsosi Online", description: "منصة تعليمية بنظام نقاط وتحديات ولوحات تحكم للطلاب والكورسات والعمليات المالية.", category: "Learning Management", focus: "LMS · Gamification · Student Management", tech: "Next.js · Prisma · Tailwind · REST API", role: "بناء تجربة التعلم ولوحات الإدارة", repo: "educenter-platform — مرشح قريب", repoUrl: "https://github.com/dhs328171-crypto/educenter-platform", confidence: "مرشح وظيفي", features: ["إدارة الطلاب والكورسات والامتحانات", "متجر مكافآت وAvatars ونقاط XP", "اختبار RIASEC للتوجيه المهني", "تحديات 1v1 ولوحة ترتيب", "إعدادات Accessibility وTTS ولوحة ولي الأمر"] },
  { video: "a4f03d08-207b-4665-be91-b9b45ee1a898-watermark.mp4", poster: "a4f03d08-207b-4665-be91-b9b45ee1a898-watermark.jpg", title: "منصة التعلم — Learning Paths", description: "منصة لتعلم البرمجة والتصميم بمكتبة كورسات ومسارات مهنية وتقدم واختبارات.", category: "Learning Platform", focus: "Courses · Learning Paths · Progress", tech: "Next.js · React · Node.js · GraphQL", role: "تصميم تجربة الكورسات ومسارات التعلم", repo: "educenter-platform", repoUrl: "https://github.com/dhs328171-crypto/educenter-platform", confidence: "مطابقة بنيوية قوية", features: ["كتالوج كورسات بمستويات مختلفة", "تفاصيل المنهج والمدربين", "مسارات مطور ويب ومهندس بيانات وDevOps", "لوحة طالب وترتيب XP", "اختبارات ومؤشرات تقدم وشهادات"] },
  { video: "b17de822-6a64-4b0a-82fc-1e63d90fcfc0-watermark.mp4", poster: "b17de822-6a64-4b0a-82fc-1e63d90fcfc0-watermark.jpg", title: "MEGASTORE", description: "متجر إلكتروني متعدد الفئات بواجهة إنجليزية وفلترة متقدمة للمنتجات والعلامات والأسعار.", category: "E-commerce", focus: "Catalog · Filtering · Storefront", tech: "React · Vite · TypeScript · REST API", role: "تطوير تجربة المتجر والكتالوج", repo: "ZERO-Store-Frontend — مرشح قريب", repoUrl: "https://github.com/dhs328171-crypto/ZERO-Store-Frontend", confidence: "مرشح وظيفي", features: ["Hero وعروض وTestimonials", "كتالوج شبكي للمنتجات والأسعار", "تصنيفات Electronics وFashion وغيرها", "فلترة بالعلامة والسعر والتوفر", "سلة وWishlist وCheckout وطلبات"] },
  { video: "c59d3357-f5d0-4874-83d1-0d4b690d7b6b-watermark.mp4", poster: "c59d3357-f5d0-4874-83d1-0d4b690d7b6b-watermark.jpg", title: "سنتر تعليمي v7", description: "نظام إدارة تعليمي عربي متعدد الأدوار مع حماية للمحتوى واشتراكات وتقارير.", category: "Education Security", focus: "HLS · AES-256 · PWA · LMS", tech: "React · Vue-style UI · REST API", role: "تصميم منصة تعليمية آمنة", repo: "secondary-platform-v4 — مرشح قوي", repoUrl: "https://github.com/dhs328171-crypto/secondary-platform-v4", confidence: "مطابقة ميزات قوية", features: ["تشفير فيديو HLS وحماية المحتوى", "AES-256 وTwo-Factor Authentication", "أكواد اشتراك وخطط واشتراكات", "لوحات المالك والمعلم وولي الأمر", "PWA وغرف دردشة وتقارير أداء"] },
  { video: "ef991ea5-35ed-46b9-9dfe-b64ae4bd66a8-watermark.mp4", poster: "ef991ea5-35ed-46b9-9dfe-b64ae4bd66a8-watermark.jpg", title: "Zeraki — AI/MLOps Dashboard", description: "لوحة عربية لإدارة البيانات وتدريب نماذج الذكاء الاصطناعي ومراقبة الأداء.", category: "AI / MLOps", focus: "Python · OCR · Model Training · Analytics", tech: "Python · OCR · Machine Learning", role: "تصميم لوحة تشغيل نماذج الذكاء الاصطناعي", repo: "Zeraki / Zeraki-AI غير موجود في المستودعات المفحوصة", repoUrl: "", confidence: "اسم المنتج ظاهر؛ المستودع غير مثبت", features: ["Overview بإحصائيات ورسوم نشاط", "رفع ملفات واستيراد من روابط", "ضبط Hyperparameters وBase Model", "متابعة Loss وAccuracy أثناء التدريب", "تقارير وStore وPython scripts مثل open_ocr"] },
] as const;

export default function Portfolio() {
  const t = useT();
  const [activeFilter, setActiveFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<(typeof workVideos)[number] | null>(null);

  useEffect(() => {
    const x = setTimeout(() => setPage(1), 350);
    return () => clearTimeout(x);
  }, [search, activeFilter]);

  const projectsQ = useProjects({ page, limit: 9, q: search, category: activeFilter });
  const projects = projectsQ.data?.items ?? [];
  const total = projectsQ.data?.total ?? 0;
  const pages = projectsQ.data?.pages ?? 1;

  // Build categories from current page (cheap, decent UX)
  const categories = Array.from(new Set(projects.map((p) => p.category))).filter(Boolean);

  const lightboxImages = projects.map((p) => ({
    src: p.image,
    title: p.title,
    desc: p.description,
    url: p.url || "#",
  }));

  return (
    <div className="zero-page min-h-screen">
      <Navbar />

      <section className="section-ambient pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-mono text-primary text-xs tracking-widest uppercase mb-4 block">// portfolio.showcase()</span>
            <h1 className="text-5xl font-bold mb-4">
              {t("portfolio.title").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-primary glow-cyan-text">{t("portfolio.title").split(" ").slice(-1)}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              {total} {t("home.statsProjects")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="sticky top-[4.5rem] z-30 bg-background/78 backdrop-blur-xl border-b border-primary/15 py-4">
        <div className="container mx-auto px-4 space-y-3">
          <div className="relative max-w-md">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("portfolio.searchPlaceholder")}
               data-testid="input-portfolio-search"
               className="w-full bg-card/70 border border-border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={14} className="text-primary flex-shrink-0" />
            <button
              onClick={() => setActiveFilter("")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-mono transition-all border ${
                activeFilter === ""
                  ? "bg-primary text-primary-foreground border-primary glow-cyan"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {t("portfolio.allCategories")}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveFilter(activeFilter === c ? "" : c)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-mono transition-all border ${
                  activeFilter === c
                    ? "bg-primary text-primary-foreground border-primary glow-cyan"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {projectsQ.isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 size={20} className="animate-spin mr-2" /> {t("common.loading")}
            </div>
          ) : projects.length === 0 ? (
            <div className="holo-surface text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
              {t("portfolio.noProjects")}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className={`holo-card group relative rounded-2xl ${
                      project.featured ? "border-primary/20" : "border-border"
                    }`}
                  >
                    {project.featured && (
                      <div className="absolute top-3 right-3 z-20 bg-primary text-primary-foreground text-[10px] font-mono px-2 py-0.5 rounded-full">
                        {t("blog.featured")}
                      </div>
                    )}
                    <div className="relative h-52 overflow-hidden">
                      {project.image ? (
                        <img
                          src={getImageUrl(project.image)}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center text-6xl text-muted-foreground/20">{"</>"}</div>
                      )}
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <button
                          onClick={() => setLightboxIdx(i)}
                          className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:glow-border transition-all"
                          title={t("portfolio.viewProject")}
                        >
                          <Eye size={18} />
                        </button>
                        {project.url && project.url !== "#" && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all"
                            title={t("portfolio.visitSite")}
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        {project.category}
                      </span>
                      <h3 className="font-bold text-lg mt-3 mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.split(/[+,/]/).map((tch, ti) => (
                          <span key={ti} className="text-[10px] font-mono bg-background border border-border rounded px-1.5 py-0.5 text-muted-foreground">
                            {tch.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!projectsQ.isLoading && pages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pager page={page} pages={pages} total={total} onChange={setPage} />
            </div>
          )}
        </div>
      </section>

      <section className="py-16 border-t border-border bg-card/20" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-7">
            <div><span className="font-mono text-primary text-xs">// project.videos()</span><h2 className="text-3xl font-bold mt-2">فيديوهات من المشاريع</h2></div>
            <span className="text-xs text-muted-foreground font-mono">{workVideos.length} نماذج</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workVideos.map((item) => (
              <article key={item.video} className="holo-card overflow-hidden rounded-2xl border border-border bg-card group">
                <div className="relative aspect-video bg-background overflow-hidden">
                  <video controls preload="metadata" poster={`/work-media/${item.poster}`} className="w-full h-full object-cover"><source src={`/work-media/${item.video}`} type="video/mp4" /></video>
                  <span className="absolute top-2 right-2 pointer-events-none rounded-full bg-black/60 text-white p-1.5"><Play size={12} fill="currentColor" /></span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">{item.category}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">CASE / {String(workVideos.indexOf(item) + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="text-xs leading-5 text-muted-foreground min-h-10">{item.description}</p>
                  <p className="text-[10px] leading-5 text-primary/80 font-mono">{item.focus}</p>
                  <div className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
                    <p className="text-[10px] font-mono text-muted-foreground/70 mb-1">// github.repository</p>
                    {item.repoUrl ? <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-primary hover:underline break-all">{item.repo}</a> : <p className="text-xs font-mono text-muted-foreground">{item.repo}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{item.confidence}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tech.split(" · ").map((tech) => <span key={tech} className="text-[10px] font-mono bg-background border border-border rounded px-1.5 py-0.5 text-muted-foreground">{tech}</span>)}
                  </div>
                  <div className="border-t border-border/70 pt-3">
                    <p className="text-[10px] font-mono text-muted-foreground/70 mb-2">// key.features</p>
                    <ul className="space-y-1.5">
                      {item.features.slice(0, 2).map((feature) => <li key={feature} className="flex items-start gap-1.5 text-xs text-foreground/80"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-primary" />{feature}</li>)}
                    </ul>
                  </div>
                  <button type="button" onClick={() => setSelectedVideo(item)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/5 px-3 py-2 text-xs font-mono text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    بطاقة المشروع كاملة <ArrowUpLeft size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedVideo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/85 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label={selectedVideo.title} onClick={() => setSelectedVideo(null)}>
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-primary/25 bg-card shadow-2xl shadow-primary/10" dir="rtl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-card/95 backdrop-blur z-10">
              <div><span className="text-[10px] font-mono text-primary">// project.brief()</span><h2 className="text-xl font-bold mt-1">{selectedVideo.title}</h2></div>
              <button type="button" onClick={() => setSelectedVideo(null)} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="إغلاق"><X size={18} /></button>
            </div>
            <div className="grid md:grid-cols-[1.1fr_.9fr] gap-0">
              <div className="bg-background p-4 md:p-6"><video controls autoPlay preload="metadata" poster={`/work-media/${selectedVideo.poster}`} className="w-full rounded-xl border border-border"><source src={`/work-media/${selectedVideo.video}`} type="video/mp4" /></video></div>
              <div className="p-5 md:p-7 space-y-5">
                <div><span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">{selectedVideo.category}</span><p className="text-sm leading-7 text-muted-foreground mt-4">{selectedVideo.description}</p></div>
                <div><p className="text-[10px] font-mono text-muted-foreground mb-2">// role</p><p className="text-sm font-medium">{selectedVideo.role}</p><p className="text-xs text-primary/80 font-mono mt-2">{selectedVideo.focus}</p></div>
                <div className="rounded-lg border border-primary/15 bg-primary/5 p-3"><p className="text-[10px] font-mono text-muted-foreground mb-1">// github.repository</p>{selectedVideo.repoUrl ? <a href={selectedVideo.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-primary hover:underline break-all">{selectedVideo.repo}</a> : <p className="text-sm font-mono text-muted-foreground">{selectedVideo.repo}</p>}<p className="text-xs text-muted-foreground mt-1">درجة المطابقة: {selectedVideo.confidence}</p></div>
                <div><p className="text-[10px] font-mono text-muted-foreground mb-2">// technology.stack</p><div className="flex flex-wrap gap-2">{selectedVideo.tech.split(" · ").map((tech) => <span key={tech} className="rounded-md border border-border bg-background px-2 py-1 text-xs font-mono text-primary">{tech}</span>)}</div></div>
                <div><p className="text-[10px] font-mono text-muted-foreground mb-2">// all.features</p><ul className="space-y-2">{selectedVideo.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm text-foreground/85"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />{feature}</li>)}</ul></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-card/30 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.ctaTitle")}</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{t("home.ctaSubtitle")}</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-mono text-sm hover:bg-primary/90 glow-cyan transition-all"
          >
            {t("home.ctaButton")} ←
          </a>
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onNext={() => setLightboxIdx((i) => (i !== null ? (i + 1) % projects.length : 0))}
        onPrev={() => setLightboxIdx((i) => (i !== null ? (i - 1 + projects.length) % projects.length : 0))}
      />
      <Footer />
    </div>
  );
}
