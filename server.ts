import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './backend/routes/authRoutes.js';
import complaintRoutes from './backend/routes/complaintRoutes.js';
import aiRoutes from './backend/routes/aiRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';
import technicianRoutes from './backend/routes/technicianRoutes.js';
import notificationRoutes from './backend/routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware configuration
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// CORS headers for development/production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'FixMate API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount Modular Backend REST APIs
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/notifications', notificationRoutes);

// Global API error handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Frontend Server & Vite Middleware Configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FixMate Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
