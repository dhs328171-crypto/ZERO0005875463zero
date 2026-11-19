import bcrypt from "bcryptjs";
import { prisma, ADMIN_EMAIL, ADMIN_PASSWORD } from "../prisma.js";
import { encryptPassword } from "./vault.js";

// Creates the admin account on boot if missing. The password is only applied
// on creation, so changing it from the admin panel is not overwritten later.
export async function ensureAdmin() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    if (existing.role !== "admin") {
      await prisma.user.update({ where: { email: ADMIN_EMAIL }, data: { role: "admin", verified: true } });
    }
    return;
  }
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      name: "ZERO Admin",
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      passwordVault: encryptPassword(ADMIN_PASSWORD),
      role: "admin",
      verified: true,
    },
  });
}
