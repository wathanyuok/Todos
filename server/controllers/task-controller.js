import Task from '../models/Task.js';

export const list = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
  res.json(tasks);
};

export const create = async (req, res) => {
  const { title, dueDate } = req.body;
  const task = await Task.create({ user: req.user.id, title, dueDate });
  res.status(201).json(task);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json(task);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const ok = await Task.deleteOne({ _id: id, user: req.user.id });
  if (!ok.deletedCount) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
};
