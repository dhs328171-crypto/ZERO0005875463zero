import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { apiGet, getImageUrl } from "@/lib/api";

interface Certificate {
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
}

const categoryLabels: Record<string, string> = {
  cloud: "Cloud",
  security: "Security",
  development: "Development",
  design: "Design",
  database: "Database",
  devops: "DevOps",
  ai: "AI",
  general: "Professional",
};

const categoryStyles: Record<string, string> = {
  cloud: "text-sky-300 bg-sky-300/10 border-sky-300/20",
  security: "text-red-300 bg-red-300/10 border-red-300/20",
  development: "text-primary bg-primary/10 border-primary/20",
  design: "text-violet-300 bg-violet-300/10 border-violet-300/20",
  database: "text-orange-300 bg-orange-300/10 border-orange-300/20",
  devops: "text-emerald-300 bg-emerald-300/10 border-emerald-300/20",
  ai: "text-amber-300 bg-amber-300/10 border-amber-300/20",
  general: "text-muted-foreground bg-muted/20 border-border",
};

const pythonCertificate = {
  title: "Python Developer",
  issuer: "SoloLearn",
  credentialId: "CC-2F2FE49H",
  url: "https://api2.sololearn.com/v2/certificates/CC-2F2FE49H/image/png?t=639207855602386520",
};

function formatDate(value: string) {
  if (!value) return "غير محدد";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export default function Certificates() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<{ items: Certificate[] }>(
        "/certificates?limit=100",
      );
      setItems(response.items);
    } catch {
      setError("تعذر تحميل الشهادات حاليًا. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 right-1/4 w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute top-96 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-[0.2em] uppercase mb-5">
              <ShieldCheck size={14} />
              credentials.index()
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-5">
              الشهادات <span className="text-primary glow-cyan-text">والاعتمادات</span>
            </h1>
            <p className="text-muted-foreground leading-8 max-w-2xl mx-auto">
              سجل موثق للإنجازات المهنية والشهادات التي تدعم الخبرة التقنية
              والحلول التي يقدمها ZERO.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { label: "إجمالي الشهادات", value: items.length, icon: Award },
              {
                label: "شهادات مميزة",
                value: items.filter((item) => item.featured).length,
                icon: CheckCircle2,
              },
              {
                label: "جهات مانحة",
                value: new Set(items.map((item) => item.issuer)).size,
                icon: ShieldCheck,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card/70 border border-border rounded-2xl p-5 text-center backdrop-blur-sm"
              >
                <stat.icon size={18} className="text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold font-mono text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mb-14 rounded-2xl border border-primary/35 bg-card/70 p-5 md:p-7 shadow-lg shadow-primary/5"
          >
            <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-7 items-center">
              <a href="/work-media/python-sololearn.png" target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-border bg-background">
                <img src="/work-media/python-sololearn.png" alt="شهادة Python Developer من SoloLearn" className="w-full h-auto hover:scale-[1.02] transition-transform" />
              </a>
              <div>
                <span className="inline-flex items-center gap-2 text-primary text-xs font-mono mb-3"><Award size={15} /> شهادة مضافة من المصدر الأصلي</span>
                <h2 className="text-2xl font-bold mb-2">{pythonCertificate.title}</h2>
                <p className="text-primary font-mono mb-4">{pythonCertificate.issuer}</p>
                <p className="text-sm text-muted-foreground leading-7 mb-5">شهادة Python موثقة، معروضة هنا داخل قسم الشهادات ورابط مباشر لفتح النسخة الأصلية.</p>
                <a href={pythonCertificate.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><ExternalLink size={14} /> فتح الشهادة الأصلية</a>
                <div className="text-xs text-muted-foreground font-mono mt-4" dir="ltr">ID: {pythonCertificate.credentialId}</div>
              </div>
            </div>
          </motion.article>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-primary">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center bg-card border border-red-400/20 rounded-2xl p-8">
              <p className="text-sm text-red-300 mb-5">{error}</p>
              <button
                onClick={loadCertificates}
                className="inline-flex items-center gap-2 border border-primary/30 text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors"
              >
                <RefreshCw size={14} /> إعادة المحاولة
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="max-w-xl mx-auto text-center bg-card/70 border border-border rounded-2xl p-10">
              <Award size={42} className="mx-auto text-primary/50 mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                لا توجد شهادات أخرى منشورة بعد
              </h2>
              <p className="text-sm text-muted-foreground leading-7">
                ستظهر الشهادات هنا تلقائيًا بمجرد إضافتها من لوحة التحكم.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((certificate, index) => (
                <motion.article
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`group relative overflow-hidden bg-card border rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/50 ${
                    certificate.featured
                      ? "border-primary/40 shadow-lg shadow-primary/10"
                      : "border-border"
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden">
                      {certificate.image ? (
                        <img
                          src={getImageUrl(certificate.image)}
                          alt={certificate.issuer}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Award size={25} className="text-primary" />
                      )}
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <span
                        className={`text-[10px] font-mono border rounded-full px-2 py-1 ${
                          categoryStyles[certificate.category] ||
                          categoryStyles.general
                        }`}
                      >
                        {categoryLabels[certificate.category] ||
                          certificate.category}
                      </span>
                      {certificate.featured && (
                        <span className="text-[10px] font-mono border border-amber-300/20 bg-amber-300/10 text-amber-300 rounded-full px-2 py-1">
                          مميزة
                        </span>
                      )}
                    </div>
                  </div>

                  {certificate.image && (
                    <a
                      href={getImageUrl(certificate.image)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-5 block overflow-hidden rounded-xl border border-border bg-background/80"
                      aria-label={`فتح صورة شهادة ${certificate.title}`}
                    >
                      <img
                        src={getImageUrl(certificate.image)}
                        alt={`صورة شهادة ${certificate.title}`}
                        className="h-44 w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </a>
                  )}

                  <h2 className="text-lg font-bold text-foreground mb-2">
                    {certificate.title}
                  </h2>
                  <p className="text-sm text-primary font-mono mb-5">
                    {certificate.issuer}
                  </p>

                  <div className="space-y-2 text-xs text-muted-foreground font-mono border-t border-border/70 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-primary" />
                      <span>صدرت في {formatDate(certificate.issueDate)}</span>
                    </div>
                    {certificate.expiryDate && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={13} className="text-amber-300" />
                        <span>صالحة حتى {formatDate(certificate.expiryDate)}</span>
                      </div>
                    )}
                    {certificate.credentialId && (
                      <div className="truncate pt-1" dir="ltr">
                        ID: {certificate.credentialId}
                      </div>
                    )}
                  </div>

                  {certificate.credentialUrl && (
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-5"
                    >
                      <ExternalLink size={14} /> التحقق من الشهادة
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
