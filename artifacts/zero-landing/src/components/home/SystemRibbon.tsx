import { motion } from "framer-motion";
import { Activity, Cpu, Globe2, Radio, ShieldCheck } from "lucide-react";

const signals = [
  { icon: Activity, label: "SYSTEM STATUS", value: "ONLINE", tone: "cyan" },
  { icon: Cpu, label: "CREATIVE ENGINE", value: "ACTIVE", tone: "lime" },
  { icon: Globe2, label: "DIGITAL PRESENCE", value: "GLOBAL", tone: "cyan" },
  { icon: ShieldCheck, label: "SECURITY LAYER", value: "READY", tone: "lime" },
];

export function SystemRibbon() {
  return (
    <section className="system-ribbon border-y border-primary/10 bg-background/70 backdrop-blur-xl" aria-label="حالة النظام">
      <div className="container mx-auto px-4 py-3 overflow-hidden">
        <div className="flex min-w-max items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[.22em] text-primary/60">
            <Radio size={13} className="animate-pulse" /> ZERO / SIGNALS
          </div>
          <div className="flex items-center gap-7">
            {signals.map(({ icon: Icon, label, value, tone }, index) => (
              <motion.div key={label} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className={`system-signal system-signal-${tone}`}>
                <Icon size={13} />
                <span className="system-signal-label">{label}</span>
                <strong>{value}</strong>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
