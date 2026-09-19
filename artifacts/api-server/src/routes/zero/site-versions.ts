import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { adminRequired, type AuthedRequest } from "../../middleware/zero-auth.js";

const router = Router();

// GET /api/admin/versions
router.get("/", adminRequired, async (_req, res) => {
  try {
    const versions = await prisma.siteVersion.findMany({ orderBy: { createdAt: "asc" } });
    const master = versions.find((v) => v.isMaster) ?? null;
    res.json({ versions, master });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/versions
router.post("/", adminRequired, async (req: AuthedRequest, res) => {
  try {
    const { label, url, isMaster, note } = req.body;
    if (!label || !url) return res.status(400).json({ error: "label و url مطلوبان" });

    // only one master at a time
    if (isMaster) {
      await prisma.siteVersion.updateMany({ data: { isMaster: false } });
    }

    const v = await prisma.siteVersion.create({
      data: { label: label.trim(), url: url.trim(), isMaster: Boolean(isMaster), note: note?.trim() || null },
    });
    res.status(201).json(v);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/admin/versions/:id
router.put("/:id", adminRequired, async (req: AuthedRequest, res) => {
  try {
    const { label, url, isMaster, isActive, note } = req.body;

    if (isMaster) {
      await prisma.siteVersion.updateMany({ data: { isMaster: false } });
    }

    const v = await prisma.siteVersion.update({
      where: { id: String(req.params.id) },
      data: {
        ...(label && { label: label.trim() }),
        ...(url && { url: url.trim() }),
        ...(isMaster !== undefined && { isMaster: Boolean(isMaster) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        note: note?.trim() || null,
      },
    });
    res.json(v);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/versions/:id
router.delete("/:id", adminRequired, async (req: AuthedRequest, res) => {
  try {
    await prisma.siteVersion.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/versions/:id/set-master — promote to master
router.post("/:id/set-master", adminRequired, async (req: AuthedRequest, res) => {
  try {
    await prisma.siteVersion.updateMany({ data: { isMaster: false } });
    const v = await prisma.siteVersion.update({
      where: { id: String(req.params.id) },
      data: { isMaster: true },
    });
    res.json(v);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
