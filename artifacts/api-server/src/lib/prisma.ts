import { PrismaClient } from "@prisma/client";

// Single shared instance — reuses connection across hot-reloads in dev.
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.__prisma = prisma;

// ----------------------------------------------------------------------------
//  Secrets & admin bootstrap
// ----------------------------------------------------------------------------
export const JWT_SECRET =
  process.env.JWT_SECRET || "zero-dev-secret-change-in-production";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@zero.dev";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234##";

// ----------------------------------------------------------------------------
//  Upload config
// ----------------------------------------------------------------------------
export const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
export const UPLOAD_MAX_MB = Number(process.env.UPLOAD_MAX_MB || 10);
export const UPLOAD_MAX_BYTES = UPLOAD_MAX_MB * 1024 * 1024;

export const UPLOAD_ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
];

// ----------------------------------------------------------------------------
//  Security config
// ----------------------------------------------------------------------------
export const SECURITY_CONFIG = {
  MAX_FAILED_ATTEMPTS: Number(process.env.MAX_FAILED_ATTEMPTS || 5),
  LOCKOUT_MINUTES: Number(process.env.LOCKOUT_MINUTES || 15),
  IP_BAN_THRESHOLD: Number(process.env.IP_BAN_THRESHOLD || 20),
  IP_BAN_HOURS: Number(process.env.IP_BAN_HOURS || 24),
  RATE_LIMIT_AUTH_WINDOW_MS: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS || 15 * 60 * 1000),
  RATE_LIMIT_AUTH_MAX: Number(process.env.RATE_LIMIT_AUTH_MAX || 10),
  RATE_LIMIT_API_WINDOW_MS: Number(process.env.RATE_LIMIT_API_WINDOW_MS || 60 * 1000),
  RATE_LIMIT_API_MAX: Number(process.env.RATE_LIMIT_API_MAX || 120),
  RATE_LIMIT_CONTACT_WINDOW_MS: Number(process.env.RATE_LIMIT_CONTACT_WINDOW_MS || 60 * 60 * 1000),
  RATE_LIMIT_CONTACT_MAX: Number(process.env.RATE_LIMIT_CONTACT_MAX || 5),
  RATE_LIMIT_REDIRECT_WINDOW_MS: Number(process.env.RATE_LIMIT_REDIRECT_WINDOW_MS || 60 * 1000),
  RATE_LIMIT_REDIRECT_MAX: Number(process.env.RATE_LIMIT_REDIRECT_MAX || 30),
};
