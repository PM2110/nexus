import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import { initDb } from './config/db';
import { config } from './config/env';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, backend to backend, or local tests)
    if (!origin) return callback(null, true);
    if (config.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Standard logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Nexus API is running smoothly' });
});

// 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'NotFound', message: 'The requested resource does not exist' });
});

// Global central error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred on the server',
  });
});

// Bootstrap server after database connection check
initDb()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Nexus API Server is listening on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Fatal database initialization failed. Exiting process.', err);
    process.exit(1);
  });
