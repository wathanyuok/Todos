import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';

const app = express();

const allowList = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',').map(s => s.trim());
console.log('CORS allowList:', allowList);

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowList.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],   // สำคัญ
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));                   // สำคัญ: ตอบ preflight

app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err);
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(500).json({ error: err.message || 'Internal Server Error', stack: isDev ? err.stack : undefined });
});

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`API running at http://localhost:${port}`));
