const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Admin controllers
const userController = require('../controllers/admin/userController');
const categoryController = require('../controllers/admin/categoryController');
const inventoryController = require('../controllers/admin/inventoryController');

// Apply authentication middleware to all admin routes
router.use(protect);

// Users
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.post('/users/:id/update', userController.updateUser);
router.post('/users/:id/delete', userController.deleteUser);

// Categories
router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.createCategory);
router.post('/categories/:id/update', categoryController.updateCategory);
router.post('/categories/:id/delete', categoryController.deleteCategory);

// Inventory
router.get('/inventory', inventoryController.getInventory);
router.post('/inventory', inventoryController.createItem);
router.post('/inventory/:id/update', inventoryController.updateItem);
router.post('/inventory/:id/delete', inventoryController.deleteItem);

// Redirect root to inventory
router.get('/', (req, res) => res.redirect('/admin/inventory'));

module.exports = router;