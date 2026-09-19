// ZERO API client — connects to Express backend via /api
const API_BASE = "/api";

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
  if (!url) return "/zero-logo.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/")) return url;
  if (url.startsWith("/uploads/")) return `/api${url}`;
  if (url.startsWith("uploads/")) return `/api/${url}`;
  if (url.startsWith("/")) return url;
  return `/api/uploads/${url}`;
}

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
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
