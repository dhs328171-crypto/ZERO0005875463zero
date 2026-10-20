import { useMemo, useState } from "react";
import { Download, Film, Instagram, Layers3, Play, Sparkles, Youtube, Facebook, Clapperboard } from "lucide-react";

const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts", "Facebook Reels"];
const concepts = [
  ["01", "المشكلة التي يحلها ZERO", "Hook: بتضيع وقتك في إدارة مشروعك؟", "استعرض المشكلة في 3 ثوانٍ ثم أظهر كيف يحول ZERO الفوضى إلى نظام واضح."],
  ["02", "جولة سريعة داخل الموقع", "شوف اللي تقدر تعمله من مكان واحد", "لقطات شاشة سريعة: المشاريع، العملاء، التحليلات، ثم دعوة لتجربة المنصة."],
  ["03", "قبل وبعد استخدام ZERO", "نفس المشروع. فرق النتيجة.", "قسّم الشاشة إلى فوضى مقابل لوحة تحكم مرتبة مع انتقال سريع وموسيقى حماسية."],
  ["04", "3 أسباب تبدأ اليوم", "ثلاث حاجات هتخلي شغلك أسهل", "اعرض المزايا ككروت متتابعة: تنظيم، سرعة، احترافية."],
  ["05", "قصة مشروعك", "مش مجرد موقع — ده مركز شغلك", "سرد قصير عن كيف يجمع ZERO حضورك الرقمي وأعمالك في تجربة واحدة."],
  ["06", "رد على سؤال شائع", "هل ZERO مناسب لمشروعي؟", "أجب عن السؤال بثلاث حالات استخدام واضحة مع نصوص كبيرة على الشاشة."],
  ["07", "دعوة مباشرة للتجربة", "جاهز تخلي مشروعك يبان؟", "فيديو ختامي قوي يوجّه المشاهد إلى زيارة الموقع أو إرسال رسالة."],
];

function PlatformIcon({ name }: { name: string }) {
  if (name.includes("TikTok")) return <Clapperboard className="size-4" />;
  if (name.includes("Instagram")) return <Instagram className="size-4" />;
  if (name.includes("YouTube")) return <Youtube className="size-4" />;
  return <Facebook className="size-4" />;
}

export default function ContentStudio() {
  const [platform, setPlatform] = useState("TikTok");
  const [active, setActive] = useState(0);
  const selected = useMemo(() => concepts[active], [active]);

  return (
    <main dir="rtl" className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary"><Sparkles className="size-4" /> content studio</div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">استوديو تسويق ZERO</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">حزمة محتوى جاهزة للتصوير والمونتاج والنشر. 7 أفكار لكل منصة، مبنية من بيانات الموقع وتجربة المشروع.</p>
          </div>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"><Download className="size-4" /> تحميل الحزمة كاملة</button>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          {[{ label: "فيديوهات مخططة", value: "28" }, { label: "منصات مستهدفة", value: "04" }, { label: "جاهز للمونتاج", value: "100%" }].map((item) => <div key={item.label} className="rounded-2xl border border-border bg-card p-5"><div className="text-3xl font-extrabold text-primary">{item.value}</div><div className="mt-1 text-sm text-muted-foreground">{item.label}</div></div>)}
        </section>

        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="منصات النشر">
          {platforms.map((item) => <button key={item} type="button" onClick={() => setPlatform(item)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${platform === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}><PlatformIcon name={item} />{item}</button>)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="grid gap-3 sm:grid-cols-2">
            {concepts.map((item, index) => <button key={item[0]} type="button" onClick={() => setActive(index)} className={`group rounded-2xl border p-5 text-right transition-all ${active === index ? "border-primary bg-primary/10 shadow-[0_0_28px_rgba(0,217,255,.08)]" : "border-border bg-card hover:border-primary/40"}`}><div className="mb-8 flex items-start justify-between"><span className="font-mono text-xs text-primary">{item[0]} / 07</span><span className="rounded-lg border border-border p-2 text-muted-foreground transition-colors group-hover:text-primary"><Play className="size-4" /></span></div><h2 className="text-lg font-bold">{item[1]}</h2><p className="mt-2 text-sm text-primary">{item[2]}</p><p className="mt-3 text-xs leading-6 text-muted-foreground">{item[3]}</p><div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><Film className="size-3.5" /> 9:16 · 20–35 ثانية</div></button>)}
          </section>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
            <div className="mb-5 flex items-center justify-between"><span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">VIDEO {selected[0]}</span><Layers3 className="size-5 text-primary" /></div>
            <h2 className="text-2xl font-extrabold">{selected[1]}</h2>
            <div className="mt-6 space-y-5 text-sm"><div><p className="mb-2 font-bold text-primary">السكريبت / Hook</p><p className="leading-7 text-muted-foreground">{selected[2]}<br />هنا يبدأ التحول الحقيقي في طريقة إدارة شغلك مع ZERO.</p></div><div><p className="mb-2 font-bold text-primary">Storyboard</p><ol className="space-y-2 text-muted-foreground"><li>01 — لقطة افتتاحية سريعة للهوية.</li><li>02 — عرض المشكلة بصريًا.</li><li>03 — تسجيل شاشة للميزة.</li><li>04 — CTA: جرّب ZERO الآن.</li></ol></div><div><p className="mb-2 font-bold text-primary">كابشن مقترح</p><p className="rounded-xl border border-border bg-background p-3 leading-6 text-muted-foreground">خلي مشروعك يشتغل بذكاء، مش بمجهود أكتر. اكتشف ZERO اليوم.</p></div></div>
            <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><Download className="size-4" /> تصدير السكريبت وStoryboard</button>
            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">الفيديوهات الفعلية تحتاج لقطات شاشة أو مواد تصويرية إضافية. هذه الحزمة جاهزة للتنفيذ والمونتاج.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
