import {
  SiReact, SiNodedotjs, SiTypescript, SiNextdotjs, SiTailwindcss,
  SiMongodb, SiPostgresql, SiGit, SiFirebase, SiDocker,
  SiVuedotjs, SiPython, SiGraphql, SiRedis, SiFigma
} from "react-icons/si";
import { Marquee } from "@/components/ui/marquee";
import { useT } from "@/contexts/i18n-context";
import { BrainCircuit, Code2, Film, Handshake, Megaphone, ShieldCheck, BarChart3, Bot, Database, Gauge, LayoutDashboard, LockKeyhole, MessageSquare, MonitorPlay, Network, Rocket, SearchCheck, Workflow } from "lucide-react";
import { Link } from "wouter";

const techs = [
  { icon: <SiReact size={30} className="text-cyan-400" />, name: "React" },
  { icon: <SiNextdotjs size={30} className="text-white" />, name: "Next.js" },
  { icon: <SiTypescript size={30} className="text-blue-400" />, name: "TypeScript" },
  { icon: <SiNodedotjs size={30} className="text-green-400" />, name: "Node.js" },
  { icon: <SiTailwindcss size={30} className="text-cyan-300" />, name: "Tailwind" },
  { icon: <SiPostgresql size={30} className="text-blue-300" />, name: "PostgreSQL" },
  { icon: <SiMongodb size={30} className="text-green-500" />, name: "MongoDB" },
  { icon: <SiGit size={30} className="text-orange-400" />, name: "Git" },
  { icon: <SiFirebase size={30} className="text-yellow-400" />, name: "Firebase" },
  { icon: <SiDocker size={30} className="text-blue-500" />, name: "Docker" },
  { icon: <SiVuedotjs size={30} className="text-green-400" />, name: "Vue.js" },
  { icon: <SiPython size={30} className="text-yellow-300" />, name: "Python" },
  { icon: <SiGraphql size={30} className="text-pink-400" />, name: "GraphQL" },
  { icon: <SiRedis size={30} className="text-red-500" />, name: "Redis" },
  { icon: <SiFigma size={30} className="text-purple-400" />, name: "Figma" },
  { icon: <Code2 size={30} className="text-orange-300" />, name: "Java" },
  { icon: <Code2 size={30} className="text-blue-300" />, name: "C / C++" },
  { icon: <Code2 size={30} className="text-violet-300" />, name: "C#" },
  { icon: <Code2 size={30} className="text-orange-400" />, name: "HTML5" },
  { icon: <Code2 size={30} className="text-blue-400" />, name: "CSS3" },
  { icon: <Code2 size={30} className="text-yellow-300" />, name: "JavaScript" },
];

const specialties = [
  { icon: Megaphone, title: "Digital Marketing", description: "محتوى، حملات، Branding، وتحويل الحضور الرقمي إلى نتائج قابلة للقياس.", tone: "text-orange-300" },
  { icon: ShieldCheck, title: "Cyber Security", description: "وعي أمني، حماية تطبيقات، مراجعة صلاحيات، وتقليل مخاطر المنتجات الرقمية.", tone: "text-cyan-300" },
  { icon: BrainCircuit, title: "AI & Automation", description: "أدوات الذكاء الاصطناعي، أتمتة سير العمل، ودمج AI داخل التجارب الرقمية.", tone: "text-violet-300" },
  { icon: Film, title: "AI Video Editing", description: "مونتاج، قص، إيقاع بصري، وإخراج محتوى فيديو مناسب للعرض والتسويق.", tone: "text-pink-300" },
  { icon: Handshake, title: "Sales & Growth", description: "فهم احتياج العميل، تقديم الحل، وبناء تجربة تساعد على تحويل الاهتمام إلى فرصة.", tone: "text-lime-300" },
  { icon: Code2, title: "Software Engineering", description: "React، Next.js، TypeScript، JavaScript، Python، Java، C، C#، HTML وCSS.", tone: "text-blue-300" },
];

const realCapabilities = [
  { icon: LayoutDashboard, title: "لوحات تحكم كاملة", output: "إدارة مشاريع، مستخدمين، رسائل، خدمات ومحتوى من مكان واحد.", tag: "ADMIN SYSTEMS" },
  { icon: Network, title: "ربط API وقواعد البيانات", output: "بيانات حقيقية، CRUD، تسجيل دخول، صلاحيات ومزامنة بين الواجهة والخادم.", tag: "FULL STACK" },
  { icon: LockKeyhole, title: "طبقة أمان وصلاحيات", output: "حماية مسارات الأدمن، جلسات آمنة، منع الوصول غير المصرح ومراجعة المدخلات.", tag: "CYBER SECURITY" },
  { icon: Gauge, title: "تحسين السرعة", output: "تحميل كسول، تقسيم الكود، ضغط الأصول وتجربة أسرع على الهاتف.", tag: "PERFORMANCE" },
  { icon: SearchCheck, title: "SEO فعلي", output: "Metadata، Canonical، Open Graph، robots.txt وSitemap جاهزة للفهرسة.", tag: "SEO" },
  { icon: Megaphone, title: "صفحات تسويق وتحويل", output: "Hero واضح، CTA، عرض قيمة، Social Proof ومسارات تقود العميل للإجراء.", tag: "MARKETING" },
  { icon: BarChart3, title: "تحليلات وقياس", output: "أحداث ومؤشرات تساعدك تعرف ما الذي ينجح وأين يتوقف المستخدم.", tag: "ANALYTICS" },
  { icon: MessageSquare, title: "نماذج ورسائل عملاء", output: "نماذج تواصل، استقبال رسائل، حالات قراءة وإدارة من لوحة الأدمن.", tag: "LEADS" },
  { icon: MonitorPlay, title: "عرض فيديو وميديا", output: "فيديوهات، صور Preview، بطاقات Case Study وLightbox مرتبط بكل عمل.", tag: "MEDIA" },
  { icon: Bot, title: "دمج AI وأتمتة", output: "مساعدات، تصنيف، محتوى وأتمتة خطوات متكررة داخل سير العمل.", tag: "AI" },
  { icon: Workflow, title: "تجربة متعددة اللغات", output: "دعم عربي/إنجليزي، اتجاه RTL/LTR وتبديل لغة بدون كسر التصميم.", tag: "I18N" },
  { icon: Rocket, title: "جاهز للنشر والتوسع", output: "Build نظيف، إعدادات بيئة، فحص مسارات وتجهيز المشروع للاستضافة.", tag: "DEPLOYMENT" },
];

export function TechStackSection() {
  const t = useT();

  return (
    <section className="section-ambient py-16 border-y border-primary/15 overflow-hidden">
      <div className="mb-4 text-center">
        <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">// {t("home.techStackTitle")}</span>
      </div>
      <Marquee speed={25} className="py-4">
        {techs.map((tch) => (
             <div key={tch.name} className="holo-card flex items-center gap-3 px-5 py-3 rounded-xl mx-2 group">
            <div className="group-hover:scale-110 transition-transform">{tch.icon}</div>
            <span className="font-mono text-sm text-muted-foreground">{tch.name}</span>
          </div>
        ))}
      </Marquee>
      <Marquee speed={20} reverse className="py-4 mt-2">
        {[...techs].reverse().map((tch) => (
           <div key={tch.name + "-r"} className="holo-surface flex items-center gap-3 px-5 py-3 rounded-xl mx-2">
            <div>{tch.icon}</div>
            <span className="font-mono text-sm text-muted-foreground/60">{tch.name}</span>
          </div>
        ))}
      </Marquee>
      <div className="container mx-auto px-4 mt-12">
        <div className="text-center mb-7"><span className="font-mono text-xs text-primary tracking-widest uppercase">// capabilities.beyond.code()</span><h3 className="text-2xl font-bold mt-2">أشتغل على المنتج من كل الزوايا</h3><p className="text-sm text-muted-foreground mt-2">تطوير، أمان، تسويق، مبيعات، ومحتوى في منظومة واحدة.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map(({ icon: Icon, title, description, tone }) => (
            <div key={title} className="holo-card rounded-2xl border border-border bg-card/50 p-5">
              <Icon size={22} className={`${tone} mb-4`} />
              <h4 className="font-bold">{title}</h4>
              <p className="text-xs leading-6 text-muted-foreground mt-2">{description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div><span className="font-mono text-xs text-primary tracking-widest uppercase">// delivered.features[12]</span><h3 className="text-2xl font-bold mt-2">ميزات تتنفذ فعليًا</h3><p className="text-sm text-muted-foreground mt-2">مش مجرد أسماء تقنيات؛ هذه مخرجات حقيقية يمكن استخدامها داخل المنتج.</p></div>
          <Link href="/portfolio" className="text-xs font-mono text-primary hover:underline">مشاهدة الأدلة والفيديوهات ←</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {realCapabilities.map(({ icon: Icon, title, output, tag }, index) => (
            <article key={title} className="holo-card relative rounded-2xl border border-border bg-card/55 p-5 min-h-[190px]">
              <div className="flex items-start justify-between gap-3"><div className="rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary"><Icon size={19} /></div><span className="font-mono text-[9px] text-muted-foreground/60">{String(index + 1).padStart(2, "0")}</span></div>
              <p className="font-mono text-[9px] tracking-[.16em] text-primary/70 mt-5">{tag}</p><h4 className="font-bold mt-2">{title}</h4><p className="text-xs leading-6 text-muted-foreground mt-2">{output}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
