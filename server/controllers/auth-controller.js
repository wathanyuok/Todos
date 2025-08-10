import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.create({ username, email, password });
  return res.status(201).json({ id: user._id, username, email });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.compare(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: String(user._id), expiresIn: '7d' });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
};
