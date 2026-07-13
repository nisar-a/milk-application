const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const milkRoutes = require('./routes/milkRoutes');
const priceRoutes = require('./routes/priceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const billingRoutes = require('./routes/billingRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS blocked: origin not allowed.'));
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Dairy API running. Use /api/health for health check.'
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/milk', milkRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/billing', billingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
