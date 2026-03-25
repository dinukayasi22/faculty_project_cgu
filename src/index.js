import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { env } from './config/env.js';
import { testConnection } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const app = express();

// Request logging middleware
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// CORS configuration
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CGU Portal API is running' });
});

// API routes
app.use('/auth', authLimiter, authRoutes);
app.use('/students', studentRoutes);
app.use('/companies', companyRoutes);
app.use('/admin', adminRoutes);
app.use('/jobs', jobRoutes);
app.use('/blog', blogRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    // Multer file upload errors
    if (err.message.includes('Invalid file type')) {
        res.status(400).json({ error: err.message });
        return;
    }

    // CORS errors
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ error: 'CORS policy violation' });
        return;
    }

    // Default error response
    res.status(500).json({
        error: env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});

// Start server
const PORT = parseInt(env.PORT) || 3000;

async function startServer() {
    try {
        // Test database connection
        await testConnection();

        app.listen(PORT, () => {
            console.log(` CGU Portal API server running on port ${PORT}`);
            console.log(` Environment: ${env.NODE_ENV}`);
            console.log(` Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error(' Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

export default app;
