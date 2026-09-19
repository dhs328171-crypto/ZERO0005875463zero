import express, { type Express } from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import helmet from "helmet";
import router from "./routes";

// Zero routes
import authRoutes from "./routes/zero/auth";
import projectRoutes from "./routes/zero/projects";
import blogRoutes from "./routes/zero/blog";
import messageRoutes from "./routes/zero/messages";
import testimonialRoutes from "./routes/zero/testimonials";
import faqRoutes from "./routes/zero/faq";
import serviceRoutes from "./routes/zero/services";
import statsRoutes from "./routes/zero/stats";
import mediaRoutes from "./routes/zero/media";
import adminUserRoutes from "./routes/zero/admin-users";
import linkMaskRoutes from "./routes/zero/link-mask";
import adminSecurityRoutes from "./routes/zero/admin-security";
import adminFileRoutes from "./routes/zero/admin-files";
import certificateRoutes from "./routes/zero/certificates";
import siteVersionRoutes from "./routes/zero/site-versions";
import siteSettingsRoutes from "./routes/zero/site-settings";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.set("trust proxy", 1);

// Security headers — applied before any routes
app.use(
  helmet({
    contentSecurityPolicy: false, // disabled: API only, no HTML
    crossOriginEmbedderPolicy: false,
  }),
);
// Prevent clickjacking and sniffing on the API
app.use((_req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=()");
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
const uploadDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
// Keep uploaded assets behind the API artifact path so the web proxy can
// serve them to the landing app in development and production.
app.use("/api/uploads", express.static(uploadDir, { maxAge: "30d" }));
app.use("/uploads", express.static(uploadDir, { maxAge: "30d" }));

// Existing health routes
app.use("/api", router);

// Zero application routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/r", linkMaskRoutes);
app.use("/api/link-mask", linkMaskRoutes); // alias for admin panel
app.use("/api/admin/security", adminSecurityRoutes);
app.use("/api/admin/files", adminFileRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin/versions", siteVersionRoutes);
app.use("/api/site-settings", siteSettingsRoutes);

export default app;
