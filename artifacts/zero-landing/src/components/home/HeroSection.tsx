import { motion, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TypingEffect } from "@/components/ui/typing-effect";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/contexts/i18n-context";
import { useReducedMotion } from "framer-motion";
import { type PointerEvent } from "react";
import { ParticleField } from "@/components/ui/particle-field";

function FloatingOrbs() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-orbits absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        className="hero-orbit hero-orbit-one absolute top-1/4 right-1/4 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 70%)" }}
        animate={reduceMotion ? { opacity: 0.5 } : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="hero-orbit hero-orbit-two absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,217,255,0.06) 0%, transparent 70%)" }}
        animate={reduceMotion ? { opacity: 0.4 } : { scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="hero-orbit hero-orbit-three absolute top-1/2 left-1/2 w-32 h-32 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,217,255,0.04) 0%, transparent 70%)" }}
        animate={reduceMotion ? { opacity: 0.3 } : { scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

function HologramHud() {
  return (
    <div className="hero-hud absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="hero-hud-corner hero-hud-corner-tl" />
      <div className="hero-hud-corner hero-hud-corner-br" />
      <div className="hero-hud-readout hero-hud-readout-left">
        <span className="hero-hud-dot" />
        <span>CORE / ONLINE</span>
        <small>LAT 00.217 / DEPTH 03.8</small>
      </div>
      <div className="hero-hud-readout hero-hud-readout-right">
        <span>SCAN // 100%</span>
        <small>ZERO SYSTEMS / 2026</small>
      </div>
      <div className="hero-hud-axis hero-hud-axis-x" />
      <div className="hero-hud-axis hero-hud-axis-y" />
    </div>
  );
}

function ZeroBoxVisual() {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.5 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.5 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateY.set(x * 10);
    rotateX.set(y * -10);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      className="hero-stage relative flex items-center justify-center"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      data-testid="hero-zero-visual"
    >
      <div className="hero-stage-grid absolute inset-0" aria-hidden="true" />
      <HologramHud />
      <div className="hologram-rig absolute inset-[4%] pointer-events-none" aria-hidden="true">
        <div className="hologram-ring hologram-ring-one" />
        <div className="hologram-ring hologram-ring-two" />
        <div className="hologram-ring hologram-ring-three" />
        <div className="hologram-beam" />
        <div className="hologram-label hologram-label-top">HOLO / 3D CORE</div>
        <div className="hologram-label hologram-label-bottom">LIVE PROJECTION</div>
      </div>
      <div className="hero-stage-marker hero-stage-marker-top absolute" aria-hidden="true">ARCH / 01</div>
      <div className="hero-stage-marker hero-stage-marker-bottom absolute" aria-hidden="true">ZERO SYSTEMS</div>

      <motion.div
        className="hero-halo absolute inset-[8%] rounded-[2rem]"
        animate={reduceMotion ? { opacity: 0.75 } : { opacity: [0.55, 0.9, 0.55], scale: [0.98, 1.02, 0.98] }}
        transition={reduceMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <motion.div
        animate={reduceMotion ? undefined : { y: [-8, 8, -8] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="hero-box-frame relative z-10"
        style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      >
        <div className="hero-box-shadow absolute inset-[8%]" aria-hidden="true" />
        <motion.img
          src="/zero-logo.jpg"
          alt="ZERO — Software Architect Solutions"
          className="hero-box-image relative z-10 w-full max-w-md lg:max-w-lg xl:max-w-xl rounded-[1.35rem] border border-primary/30 object-cover"
          style={{ filter: "drop-shadow(0 18px 35px rgba(0, 15, 30, .7)) drop-shadow(0 0 32px rgba(0,217,255,.28))" }}
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      <motion.div
        className="hero-scan-sweep absolute inset-[5%] pointer-events-none rounded-[2rem] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={reduceMotion ? { opacity: 0.2 } : { opacity: [0, 0.4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
        aria-hidden="true"
      >
        <div className="hero-scan-line absolute left-0 right-0 h-px" />
      </motion.div>

      {[["top-4 left-4", "rotate-0"], ["top-4 right-4", "rotate-90"], ["bottom-4 right-4", "rotate-180"], ["bottom-4 left-4", "-rotate-90"]].map(([pos, rot], i) => (
        <motion.div
          key={i}
          className={`hero-corner absolute ${pos} w-7 h-7 border-primary opacity-60`}
          style={{ borderWidth: "2px 0 0 2px", transform: `rotate(${rot.replace("rotate-", "")}deg)` }}
          animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.3, 0.8, 0.3] }}
          transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, delay: i * 0.3 }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function HeroSection({ publicMode = false }: { publicMode?: boolean }) {
  const t = useT();
  const reduceMotion = useReducedMotion();

  const words = t("home.heroTitle1") === "أحوّل أفكارك إلى"
    ? ["احترافي", "مبدع", "موثوق", "مميز", "متكامل"]
    : ["professional", "creative", "trusted", "premium", "complete"];

  return (
    <section className="hero-shell relative pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden min-h-[100dvh] flex items-center">
      <div
        className="hero-backdrop absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/zero-preview.png')", filter: "blur(2px)" }}
        aria-hidden="true"
      />
      <div className="hero-veil absolute inset-0 z-0" aria-hidden="true" />
      <div className="hero-grid absolute inset-0 z-0" aria-hidden="true" />
      <div className="hero-scanlines absolute inset-0 z-0" aria-hidden="true" />
      <ParticleField />

      <FloatingOrbs />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="hero-copy">
            <motion.div
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5 }}
              className="hero-eyebrow inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full"
              data-testid="text-hero-badge"
            >
              <span className="hero-status-dot w-2 h-2 rounded-full" aria-hidden="true" />
              <span className="hero-status-label text-primary text-[0.72rem] sm:text-sm font-semibold">{t("home.heroBadge")}</span>
              <span className="hero-eyebrow-code font-mono text-[0.6rem] tracking-widest" aria-hidden="true">SYS.ONLINE</span>
            </motion.div>

            <motion.h1
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
              className="hero-title text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold mb-5 leading-[1.12] tracking-[-0.045em]"
              data-testid="text-hero-title"
            >
              <span className="block">{t("home.heroTitle1")}</span>
              <span className="hero-title-highlight block text-primary">{t("home.heroTitleHighlight")}</span>
              <span className="hero-typing-line mt-2 block min-h-[1.2em]">
                <span className="text-muted-foreground/70">// </span>
                <TypingEffect words={words} className="text-primary" speed={72} deleteSpeed={34} pauseTime={2100} />
              </span>
            </motion.h1>

            <motion.p
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
              className="hero-subtitle text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
              data-testid="text-hero-subtitle"
            >
              {t("home.heroSubtitle")}
            </motion.p>

            <motion.div
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-10"
            >
              <Button
                size="lg"
                className="hero-primary-button bg-primary text-primary-foreground hover:bg-primary/90 text-base px-7 sm:px-8 h-12"
                asChild
              >
                <Link href={publicMode ? "/register" : "/portfolio"} data-testid="link-hero-portfolio">
                  {publicMode ? t("lg.ctaPrimary") : t("home.heroCtaSecondary")} <ArrowLeft size={16} className="mr-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hero-secondary-button border-border hover:border-primary/50 text-base px-7 sm:px-8 h-12"
                asChild
              >
                <Link href={publicMode ? "/login" : "/pricing"} data-testid="link-hero-pricing">
                  {publicMode ? t("lg.ctaSecondary") : t("nav.pricing")}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.5 }}
              className="hero-proof-list flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground"
            >
              {[
                t("home.why2Title"),
                t("home.why3Title"),
                t("home.statsSatisfaction"),
                t("home.why4Title"),
              ].map((x, index) => (
                <span key={x} className="hero-proof-item text-xs font-mono text-primary/70" data-testid={`text-hero-proof-${index}`}>
                  <span className="hero-proof-mark" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{x}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.2 }}
            className="hero-visual-column block"
          >
            <ZeroBoxVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
