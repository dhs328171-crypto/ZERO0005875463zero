// ZERO API client — use the managed Manus backend in production and same-origin locally.
const configuredApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
const API_ORIGIN = configuredApiUrl.replace(/\/$/, "").replace(/\/api$/, "");
const API_BASE = `${API_ORIGIN}/api`;
const REQUEST_TIMEOUT_MS = 15_000;

function apiUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getToken(): string | null {
  return localStorage.getItem("zero_token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("zero_token", token);
  else localStorage.removeItem("zero_token");
}

export interface ApiError {
  error: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Build a query string from a flat object — skips null/undefined/empty values
export function qs(params: Record<string, any>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// Resolve an image URL — handles /uploads/ paths from the backend
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return "/zero-logo.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/")) return `${API_ORIGIN}${url}`;
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  if (url.startsWith("uploads/")) return `${API_BASE}/${url}`;
  if (url.startsWith("/")) return url;
  return `${API_BASE}/uploads/${url}`;
}

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      ...options,
      headers,
      credentials: "include",
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("انتهت مهلة الاتصال بالخادم. تحقق من رابط الـ API ثم حاول مرة أخرى.");
    }
    throw new Error("تعذر الاتصال بالخادم. تأكد أن خدمة الـ API تعمل.");
  } finally {
    window.clearTimeout(timeout);
  }
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data as ApiError).error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const apiGet    = <T = any>(path: string)               => api<T>(path);
export const apiPost   = <T = any>(path: string, body?: any)   => api<T>(path, { method: "POST",   body: JSON.stringify(body ?? {}) });
export const apiPut    = <T = any>(path: string, body?: any)   => api<T>(path, { method: "PUT",    body: JSON.stringify(body ?? {}) });
export const apiDelete = <T = any>(path: string, body?: any)   => api<T>(path, { method: "DELETE", body: body ? JSON.stringify(body) : undefined });

// Upload one or more files via multipart/form-data
export async function apiUpload<T = any>(
  path: string,
  files: File | File[],
  fieldName = "files"
): Promise<T> {
  const fd = new FormData();
  for (const f of Array.isArray(files) ? files : [files]) {
    fd.append(fieldName, f);
  }
  return api<T>(path, { method: "POST", body: fd });
}
