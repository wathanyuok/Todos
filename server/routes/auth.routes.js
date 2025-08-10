import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signToken } from "../utils/jwt.js";
import auth from "../middlewares/auth.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const dup = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true },
    });
    if (dup) return res.status(409).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hash },
      select: { id: true, username: true, email: true },
    });
    return res.status(201).json({ user });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ message: "User already exists" });
    }
    return next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await prisma.user.findFirst({
      where: username ? { username } : { email },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ sub: user.id });
    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (e) {
    return next(e);
  }
});

router.get("/me", auth, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;
