import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middlewares/auth.js";

const prisma = new PrismaClient();
const router = Router();

const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(auth);

router.get("/", ah(async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id },              
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    select: { id: true, title: true, dueDate: true, done: true }
  });
  res.json(tasks);
}));

router.post("/", ah(async (req, res) => {
  const { title, dueDate } = req.body || {};
  if (!title || !dueDate) return res.status(400).json({ message: "Missing fields" });

  const d = new Date(dueDate);
  if (isNaN(d.getTime())) return res.status(400).json({ message: "Invalid date" });

  const task = await prisma.task.create({
    data: { title, dueDate: d, userId: req.user.id }, 
    select: { id: true, title: true, dueDate: true, done: true }
  });
  res.status(201).json(task);
}));

router.patch("/:id", ah(async (req, res) => {
  const { id } = req.params;

  const found = await prisma.task.findFirst({ where: { id, userId: req.user.id } }); 
  if (!found) return res.status(404).json({ message: "Task not found" });

  const data = {};
  if (req.body.title !== undefined) data.title = req.body.title;
  if (req.body.dueDate !== undefined) {
    const d = new Date(req.body.dueDate);
    if (isNaN(d.getTime())) return res.status(400).json({ message: "Invalid date" });
    data.dueDate = d;
  }
  if (req.body.done !== undefined) data.done = Boolean(req.body.done);

  const updated = await prisma.task.update({
    where: { id },
    data,
    select: { id: true, title: true, dueDate: true, done: true }
  });
  res.json(updated);
}));

router.delete("/:id", ah(async (req, res) => {
  const { id } = req.params;
  const found = await prisma.task.findFirst({ where: { id, userId: req.user.id } }); 
  if (!found) return res.status(404).json({ message: "Task not found" });

  await prisma.task.delete({ where: { id } });
  res.status(204).end();
}));

export default router;
