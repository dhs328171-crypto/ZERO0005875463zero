import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useT } from "@/contexts/i18n-context";
import { Play } from "lucide-react";

const featuredVideos = [
  { video: "VID_20260904_110540.mp4", poster: "VID_20260904_110540.jpg", title: "تفاصيل من داخل المشروع", tag: "هندسة برمجيات", description: "تفاصيل عملية من مراحل بناء المشروع وتطويره.", tech: "Full Stack · API" },
  { video: "438c100d-dc79-47b3-8c83-83c8c4f6b35e-watermark.mp4", poster: "438c100d-dc79-47b3-8c83-83c8c4f6b35e-watermark.jpg", title: "تجربة واجهة تفاعلية", tag: "واجهة وتجربة مستخدم", description: "استعراض لحركة الواجهة وتفاعل العناصر مع المستخدم.", tech: "React · Framer Motion" },
] as const;

export function FeaturedProjectsSection() {
  const t = useT();
  return (
    <section className="section-ambient py-24 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="font-mono text-primary text-xs tracking-widest uppercase mb-3 block">// portfolio.featured()</span>
            <h2 className="system-heading text-4xl font-bold">{t("home.latestWork")}</h2>
            <p className="text-muted-foreground mt-3">نماذج فيديو حقيقية من أحدث أعمالي</p>
          </div>
          <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground hidden md:flex" asChild>
            <Link href="/portfolio">{t("home.latestWorkCta")} ←</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {featuredVideos.map((item, index) => (
            <motion.article key={item.video} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="holo-card group relative overflow-hidden rounded-2xl">
              <div className="relative aspect-video overflow-hidden bg-background">
                <video controls preload="metadata" poster={`/work-media/${item.poster}`} className="w-full h-full object-cover">
                  <source src={`/work-media/${item.video}`} type="video/mp4" />
                </video>
                <div className="absolute top-3 right-3 pointer-events-none inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm"><Play size={11} fill="currentColor" /> فيديو مشروع</div>
              </div>
              <div className="p-5"><span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">{item.tag}</span><h3 className="text-lg font-bold mt-3">{item.title}</h3><p className="text-sm text-muted-foreground leading-6 mt-2">{item.description}</p><p className="text-[10px] font-mono text-muted-foreground/70 mt-3">{item.tech}</p></div>
            </motion.article>
          ))}
        </div>
        <div className="mt-8 md:hidden"><Button variant="outline" className="w-full border-primary/40 text-primary" asChild><Link href="/portfolio">{t("home.latestWorkCta")} ←</Link></Button></div>
      </div>
    </section>
  );
}
