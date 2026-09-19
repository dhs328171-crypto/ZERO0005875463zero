import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { adminRequired, type AuthedRequest } from "../../middleware/zero-auth.js";
import { parsePaging } from "../../lib/zero/paging.js";

const router = Router();

// GET /api/certificates
router.get("/", async (req, res) => {
  try {
    const { page, limit, skip } = parsePaging(req);
    const q = (req.query.q as string) || "";
    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { issuer: { contains: q } },
        { category: { contains: q } },
      ];
    }
    if (req.query.featured === "true") where.featured = true;
    if (req.query.category) where.category = req.query.category as string;

    const [items, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.certificate.count({ where }),
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/certificates — admin
router.post("/", adminRequired, async (req: AuthedRequest, res) => {
  try {
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, image, category, featured, order } = req.body;
    if (!title || !issuer || !issueDate) {
      return res.status(400).json({ error: "title, issuer, issueDate مطلوبة" });
    }
    const cert = await prisma.certificate.create({
      data: {
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate.trim(),
        expiryDate: expiryDate?.trim() || null,
        credentialId: credentialId?.trim() || null,
        credentialUrl: credentialUrl?.trim() || null,
        image: image?.trim() || null,
        category: category?.trim() || "general",
        featured: Boolean(featured),
        order: Number(order) || 0,
      },
    });
    res.status(201).json(cert);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/certificates/:id — admin
router.put("/:id", adminRequired, async (req: AuthedRequest, res) => {
  try {
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, image, category, featured, order } = req.body;
    const cert = await prisma.certificate.update({
      where: { id: String(req.params.id) },
      data: {
        ...(title && { title: title.trim() }),
        ...(issuer && { issuer: issuer.trim() }),
        ...(issueDate && { issueDate: issueDate.trim() }),
        expiryDate: expiryDate?.trim() || null,
        credentialId: credentialId?.trim() || null,
        credentialUrl: credentialUrl?.trim() || null,
        image: image?.trim() || null,
        ...(category && { category: category.trim() }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });
    res.json(cert);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/certificates/:id — admin
router.delete("/:id", adminRequired, async (req: AuthedRequest, res) => {
  try {
    await prisma.certificate.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
