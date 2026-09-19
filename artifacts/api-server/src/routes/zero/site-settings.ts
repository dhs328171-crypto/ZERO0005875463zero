import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { adminRequired, type AuthedRequest } from "../../middleware/zero-auth.js";

const router = Router();

export const DEFAULT_SITE_SETTINGS = {
  accentColor: "#00D9FF",
  primaryFont: "IBM Plex Sans Arabic",
};

const ALLOWED_FONTS = new Set([
  "IBM Plex Sans Arabic",
  "Tajawal",
  "Cairo",
  "Almarai",
  "Noto Kufi Arabic",
]);

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function normalizeSettings(input: Record<string, unknown>) {
  const accentColor = isHexColor(input.accentColor)
    ? input.accentColor.toUpperCase()
    : DEFAULT_SITE_SETTINGS.accentColor;
  const primaryFont =
    typeof input.primaryFont === "string" && ALLOWED_FONTS.has(input.primaryFont)
      ? input.primaryFont
      : DEFAULT_SITE_SETTINGS.primaryFont;

  return { accentColor, primaryFont };
}

async function readSettings() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: "appearance" },
    take: 1,
  });

  if (!rows[0]) return DEFAULT_SITE_SETTINGS;

  try {
    return normalizeSettings(JSON.parse(rows[0].value) as Record<string, unknown>);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

// GET /api/site-settings — public settings used by the landing site.
router.get("/", async (_req, res) => {
  try {
    res.json(await readSettings());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/site-settings — admin-only update for the public visual system.
router.put("/", adminRequired, async (req: AuthedRequest, res) => {
  try {
    const current = await readSettings();
    const next = normalizeSettings({ ...current, ...req.body });

    const setting = await prisma.siteSetting.upsert({
      where: { key: "appearance" },
      update: { value: JSON.stringify(next) },
      create: { key: "appearance", value: JSON.stringify(next) },
    });

    res.json({ ...next, updatedAt: setting.updatedAt });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;