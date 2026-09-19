import { motion } from "framer-motion";
import { Link } from "wouter";
import { Zap, Code, Smartphone, ShoppingCart, BarChart3, Star, Users, Briefcase, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT, useI18n } from "@/contexts/i18n-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { HeroSection } from "@/components/home/HeroSection";

export default function LandingGate() {
  const t = useT();
  const { dir } = useI18n();

  const features = [
    { icon: Code, title: t("lg.f1t"), desc: t("lg.f1d") },
    { icon: Smartphone, title: t("lg.f2t"), desc: t("lg.f2d") },
    { icon: ShoppingCart, title: t("lg.f3t"), desc: t("lg.f3d") },
    { icon: BarChart3, title: t("lg.f4t"), desc: t("lg.f4d") },
  ];

  const testimonials = [
    { name: t("lg.t1n"), text: t("lg.t1"), rating: 5 },
    { name: t("lg.t2n"), text: t("lg.t2"), rating: 5 },
    { name: t("lg.t3n"), text: t("lg.t3"), rating: 5 },
  ];

  const whyPoints = [
    t("lg.w1"), t("lg.w2"), t("lg.w3"), t("lg.w4"), t("lg.w5"), t("lg.w6"),
  ];

  return (
    <div className="zero-page min-h-screen bg-background text-foreground" dir={dir}>
      {/* Navbar for guests */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-primary/15">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/zero-logo.png" alt="ZERO" className="h-9 w-auto drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]" />
            <span className="font-mono font-bold text-primary">ZERO</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 font-mono text-xs" asChild>
              <Link href="/login">{t("nav.login")}</Link>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-mono text-xs" asChild>
              <Link href="/register">{t("nav.register")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* The public hero shares the same visual system as the authenticated home. */}
        <HeroSection publicMode />

        {/* Services Preview */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <p className="font-mono text-xs text-primary mb-2">()SERVICES.PREVIEW //</p>
              <h2 className="text-3xl font-bold">{t("lg.servicesTitle")}</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="holo-card rounded-xl p-5 text-center group"
                >
                  <f.icon size={28} className="text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-sm text-foreground mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <p className="font-mono text-xs text-primary mb-2">()TESTIMONIALS.PREVIEW //</p>
              <h2 className="text-3xl font-bold">{t("home.testimonialsTitle")}</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((tm, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="holo-surface rounded-xl p-5"
                >
                  <div className="flex mb-3">
                    {Array.from({ length: tm.rating }).map((_, j) => (
                      <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">"{tm.text}"</p>
                  <p className="text-sm font-semibold text-foreground">{tm.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Register */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
                <p className="font-mono text-xs text-primary mb-2">()WHY.REGISTER //</p>
                <h2 className="text-3xl font-bold mb-4">{t("lg.whyTitle")}</h2>
                <div className="space-y-3">
                  {whyPoints.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={15} className="text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{p}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
                <div className="holo-surface border-primary/20 rounded-2xl p-8 relative">
                  <div className="absolute inset-0 cyber-grid opacity-5" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 text-center">{t("lg.registerNow")}</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-mono" asChild>
                        <Link href="/register">
                          <Zap size={15} className="ml-2" />
                          {t("lg.createAccount")}
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full border-border hover:border-primary/50 text-muted-foreground font-mono" asChild>
                        <Link href="/login">{t("nav.login")}</Link>
                      </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users size={11} />{t("lg.free")}</span>
                      <span className="flex items-center gap-1"><Briefcase size={11} />{t("lg.noCard")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
              <div className="holo-surface border-green-500/20 rounded-2xl p-8">
              <MessageCircle size={32} className="text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">{t("lg.contactDirect")}</h3>
              <p className="text-muted-foreground text-sm mb-5">{t("lg.contactDesc")}</p>
              <Button className="bg-green-500 hover:bg-green-600 text-white" asChild>
                <a href="https://chat.whatsapp.com/LkJJ5CIyE0mFdFIupB33J9" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={15} className="ml-2" />
                  {t("lg.whatsappCta")}
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 px-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
            <span>© {new Date().getFullYear()} ZERO — Software Architect Solutions</span>
            <div className="flex gap-4">
              <Link href="/terms"><span className="hover:text-primary transition-colors cursor-pointer">{t("lg.terms")}</span></Link>
              <Link href="/privacy"><span className="hover:text-primary transition-colors cursor-pointer">{t("lg.privacy")}</span></Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
