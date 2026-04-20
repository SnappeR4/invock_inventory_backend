const express = require('express');
const router = express.Router();

// Import route modules
const apiAuthRoutes = require('./api/authRoutes');
const apiCategoryRoutes = require('./api/categoryRoutes');
const apiInventoryRoutes = require('./api/inventoryRoutes');
const webAdminRoutes = require('./web/adminWeb');

// API Routes (JSON)
router.use('/api/auth', apiAuthRoutes);
router.use('/api/categories', apiCategoryRoutes);
router.use('/api/inventory', apiInventoryRoutes);

// Web Routes (EJS Admin Panel)
router.use('/admin', webAdminRoutes);

// Optional: Health check
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

module.exports = router;