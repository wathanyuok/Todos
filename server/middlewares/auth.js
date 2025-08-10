// server/middlewares/auth.js
import { verifyToken } from "../utils/jwt.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyToken(token); 
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = { id: user.id, username: user.username, email: user.email };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
