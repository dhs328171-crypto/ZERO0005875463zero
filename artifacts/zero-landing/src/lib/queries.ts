/**
 * Convenience hooks for fetching public data from the API.
 * Uses @tanstack/react-query so we get caching, deduplication, and refetch
 * for free across all pages that consume the same data.
 */
import { useQuery } from "@tanstack/react-query";
import { apiGet, qs, type Paginated } from "@/lib/api";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string; // JSON string
  price: string | null;
  active: boolean;
  order: number;
}
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  tech: string;
  category: string;
  image: string;
  url: string | null;
  featured: boolean;
  createdAt: string;
}

// Keep the public portfolio useful when the optional Manus API is unavailable.
// These are presentation records only; the API remains the source of truth when it responds.
export const FALLBACK_PROJECTS: Project[] = [
  { id: "fallback-bacc", title: "BACC", slug: "bacc", description: "منصة رقمية متكاملة بواجهة حديثة وتجربة استخدام سريعة ومتجاوبة.", tech: "React · Vite · TypeScript", category: "Web Platform", image: "", url: "https://bacc-alpha.vercel.app/", featured: true, createdAt: "2026-01-01" },
  { id: "fallback-glory-store", title: "GLORY STORE", slug: "glory-store", description: "منصة عربية لشحن الألعاب والخدمات الرقمية مع عضويات وأسعار متعددة العملات.", tech: "React · Express · PostgreSQL · JWT", category: "Game Top-up", image: "", url: "https://glory-store-updated.vercel.app/", featured: true, createdAt: "2026-01-02" },
  { id: "fallback-wabot", title: "WaBot Pro", slug: "wabot-pro", description: "منصة SaaS لإدارة WhatsApp وTelegram والبوتات والعملاء والعمليات التجارية.", tech: "Node.js · React · PostgreSQL · REST API", category: "Automation SaaS", image: "", url: "https://wabot-pro-full.vercel.app/", featured: true, createdAt: "2026-01-03" },
  { id: "fallback-center", title: "سنتر تعليمي v7", slug: "education-center-v7", description: "نظام إدارة تعليمي عربي متعدد الأدوار مع حماية للمحتوى واشتراكات وتقارير.", tech: "React · REST API · PWA", category: "Education Security", image: "", url: "https://secondary-platform-v4-b-a4xz.vercel.app/", featured: true, createdAt: "2026-01-04" },
  { id: "fallback-lms", title: "EduCenter Platform", slug: "educenter-platform", description: "منصة تعليمية لإدارة الكورسات والطلاب والامتحانات والمحتوى الرقمي.", tech: "React · Python · REST API", category: "Education Platform", image: "", url: "https://educenter-platform.vercel.app/", featured: true, createdAt: "2026-01-05" },
  { id: "fallback-qitta", title: "Qitta", slug: "qitta", description: "تجربة ويب عربية حديثة لخدمة رقمية مع واجهة واضحة وسهلة الاستخدام.", tech: "React · Vite · TypeScript", category: "Web Platform", image: "", url: "https://qitta-frontend.vercel.app/", featured: false, createdAt: "2026-01-06" },
  { id: "fallback-academy", title: "Academy Green", slug: "academy-green", description: "منصة أكاديمية لإدارة المحتوى التعليمي ومسارات التعلم وتجربة الطلاب.", tech: "React · Next.js · Tailwind", category: "Learning Platform", image: "", url: "https://academy-green-mu.vercel.app/", featured: false, createdAt: "2026-01-07" },
  { id: "fallback-talib", title: "Talib Track", slug: "talib-track", description: "نظام لمتابعة الطلاب والتقدم التعليمي والعمليات اليومية بشكل منظم.", tech: "React · TypeScript · REST API", category: "Education Platform", image: "", url: "https://talib-track.vercel.app/", featured: false, createdAt: "2026-01-08" },
  { id: "fallback-tawba", title: "Tawba", slug: "tawba", description: "منصة رقمية بتصميم هادئ وتجربة متجاوبة على الهاتف والحاسوب.", tech: "React · Vite · TypeScript", category: "Web Platform", image: "", url: "https://tawba-psi.vercel.app/", featured: false, createdAt: "2026-01-09" },
  { id: "fallback-clinic", title: "Zero Clinic OS", slug: "zero-clinic-os", description: "نظام تشغيل وإدارة للعيادات لتنظيم الخدمات والبيانات وتجربة المراجعين.", tech: "React · Node.js · REST API", category: "Healthcare Platform", image: "", url: "https://zer-0-clinic-os.vercel.app/", featured: false, createdAt: "2026-01-10" },
  { id: "fallback-megastore", title: "MEGASTORE", slug: "megastore", description: "متجر إلكتروني متعدد الفئات بواجهة إنجليزية وفلترة متقدمة للمنتجات والعلامات والأسعار.", tech: "React · Vite · TypeScript · REST API", category: "E-commerce", image: "", url: "https://megastore-lac.vercel.app/", featured: true, createdAt: "2026-01-11" },
];

function fallbackProjects({ page, limit, q, category }: { page: number; limit: number; q: string; category: string }): Paginated<Project> {
  const needle = q.trim().toLocaleLowerCase();
  const filtered = FALLBACK_PROJECTS.filter((project) => {
    const matchesSearch = !needle || `${project.title} ${project.description} ${project.tech}`.toLocaleLowerCase().includes(needle);
    return matchesSearch && (!category || project.category === category);
  });
  const start = (page - 1) * limit;
  return { items: filtered.slice(start, start + limit), page, limit, total: filtered.length, pages: Math.max(1, Math.ceil(filtered.length / limit)) };
}
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  tag: string;
  hot: boolean;
  published: boolean;
  views: number;
  authorId: string | null;
  createdAt: string;
}
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  rating: number;
  text: string;
  avatar: string | null;
  approved: boolean;
  featured: boolean;
  createdAt: string;
}
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  visible: boolean;
  createdAt: string;
}
export interface Stats {
  projects: number;
  posts: number;
  testimonials: number;
  messages: number;
  users: number;
  media: number;
}

/** Parse a JSON-encoded feature list, falling back to []. */
export function parseFeatures(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Map icon string from DB → emoji; allows admin to store either an emoji or a name. */
export function iconToEmoji(icon: string | null | undefined): string {
  if (!icon) return "⚡";
  // If it's already a single emoji (or short emoji sequence), return as-is.
  if (/^\p{Extended_Pictographic}/u.test(icon) || icon.length <= 4) return icon;
  // Fallback map for common lucide icon names used in seed.
  const map: Record<string, string> = {
    Code: "💻",
    Palette: "🎨",
    ShoppingCart: "🛒",
    Smartphone: "📱",
    Database: "🗄️",
    BarChart3: "📊",
    Cloud: "☁️",
    Zap: "⚡",
    Star: "⭐",
  };
  return map[icon] || "⚡";
}

// ---------------------------------------------------------------------------
//  Hooks
// ---------------------------------------------------------------------------

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: () => apiGet<Stats>("/stats"),
    staleTime: 60_000,
  });
}

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await apiGet<{ items: Service[] }>("/services");
      return res.items;
    },
    staleTime: 60_000,
  });
}

export function useProjects(opts: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  featured?: boolean;
} = {}) {
  const { page = 1, limit = 12, q = "", category = "", featured } = opts;
  const query = qs({ page, limit, q, category, featured: featured ? true : "" });
  return useQuery<Paginated<Project>>({
    queryKey: ["projects", page, limit, q, category, featured],
    queryFn: async () => {
      try {
        const response = await apiGet<Paginated<Project>>(`/projects${query}`);
        return response.items?.length || response.total > 0
          ? response
          : fallbackProjects({ page, limit, q, category });
      } catch {
        return fallbackProjects({ page, limit, q, category });
      }
    },
    staleTime: 30_000,
  });
}

export function useProject(slug: string | null) {
  return useQuery<Project>({
    queryKey: ["project", slug],
    queryFn: async () => {
      const res = await apiGet<{ item: Project }>(`/projects/${slug}`);
      return res.item;
    },
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function useBlog(opts: {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
  all?: boolean;
} = {}) {
  const { page = 1, limit = 9, q = "", tag = "", all = false } = opts;
  const query = qs({ page, limit, q, tag, all: all ? true : "" });
  return useQuery<Paginated<BlogPost>>({
    queryKey: ["blog", page, limit, q, tag, all],
    queryFn: () => apiGet<Paginated<BlogPost>>(`/blog${query}`),
    staleTime: 30_000,
  });
}

export function useBlogPost(slug: string | null) {
  return useQuery<BlogPost>({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      const res = await apiGet<{ item: BlogPost }>(`/blog/${slug}`);
      return res.item;
    },
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function useTestimonials(opts: {
  page?: number;
  limit?: number;
  q?: string;
  all?: boolean;
  featured?: boolean;
} = {}) {
  const { page = 1, limit = 50, q = "", all = false, featured } = opts;
  const query = qs({ page, limit, q, all: all ? true : "", featured: featured ? true : "" });
  return useQuery<Paginated<Testimonial>>({
    queryKey: ["testimonials", page, limit, q, all, featured],
    queryFn: () => apiGet<Paginated<Testimonial>>(`/testimonials${query}`),
    staleTime: 30_000,
  });
}

export function useFAQs(opts: { q?: string; category?: string; all?: boolean } = {}) {
  const { q = "", category = "", all = false } = opts;
  const query = qs({ page: 1, limit: 100, q, category, all: all ? true : "" });
  return useQuery<FAQ[]>({
    queryKey: ["faqs", q, category, all],
    queryFn: async () => {
      const res = await apiGet<Paginated<FAQ>>(`/faq${query}`);
      return res.items;
    },
    staleTime: 60_000,
  });
}
