import { useEffect } from "react";
import { useLocation } from "wouter";

const metadata: Record<string, { title: string; description: string }> = {
  "/": { title: "ZERO — Software Architect Solutions | مطور Full Stack احترافي", description: "أحوّل أفكارك إلى واقع رقمي عبر مواقع وتطبيقات ولوحات تحكم متقنة." },
  "/portfolio": { title: "أعمال ZERO — مشاريع ويب احترافية", description: "شاهد مشاريع ZERO وفيديوهات الأعمال الحقيقية في الويب والتطبيقات والتجارب الرقمية." },
  "/services": { title: "خدمات ZERO — تطوير مواقع ومتاجر وتطبيقات", description: "خدمات تطوير مواقع وتطبيقات ومتاجر ولوحات تحكم مخصصة." },
  "/about": { title: "من أنا — ZERO | مطور Full Stack", description: "تعرف على خبرة ZERO ومهاراته ورحلته في بناء المنتجات الرقمية." },
  "/certificates": { title: "الشهادات والاعتمادات — ZERO", description: "شهادات واعتمادات ZERO المهنية، ومنها شهادة Python من SoloLearn." },
  "/cv": { title: "السيرة الذاتية — ZERO", description: "السيرة الذاتية والخبرات والمهارات التقنية لـ ZERO." },
  "/blog": { title: "مدونة ZERO — مقالات تقنية", description: "مقالات وأفكار عملية عن React وTypeScript وتطوير المنتجات الرقمية." },
  "/contact": { title: "تواصل مع ZERO", description: "تواصل مع ZERO لمناقشة مشروعك والحصول على استشارة أولية." },
  "/pricing": { title: "الأسعار والباقات — ZERO", description: "باقات واضحة لتطوير المواقع والتطبيقات بدون رسوم مخفية." },
};

export function SiteSeo() {
  const [location] = useLocation();
  useEffect(() => {
    if (location.startsWith("/admin") || location === "/login" || location === "/register") return;
    const key = Object.keys(metadata).find((path) => path === location) || (location.startsWith("/blog/") ? "/blog" : "/");
    const data = metadata[key];
    document.title = data.title;
    const setMeta = (selector: string, attr: string, value: string) => {
      let node = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!node) {
        node = document.createElement(selector.startsWith("link") ? "link" : "meta") as HTMLMetaElement | HTMLLinkElement;
        if (selector.startsWith("link")) (node as HTMLLinkElement).rel = "canonical";
        document.head.appendChild(node);
      }
      node.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", data.description);
    setMeta('meta[property="og:title"]', "content", data.title);
    setMeta('meta[property="og:description"]', "content", data.description);
    setMeta('meta[property="og:url"]', "content", `${window.location.origin}${location}`);
    setMeta('link[rel="canonical"]', "href", `${window.location.origin}${location}`);
  }, [location]);
  return null;
}
