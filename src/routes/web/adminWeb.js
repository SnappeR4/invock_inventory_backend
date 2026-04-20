const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');

// Admin auth controller
const authController = require('../../controllers/admin/authController');

// Admin CRUD controllers
const userController = require('../../controllers/admin/userController');
const categoryController = require('../../controllers/admin/categoryController');
const inventoryController = require('../../controllers/admin/inventoryController');

// Public login pages
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes below
router.use(protect);

// Dashboard
router.get('/dashboard', authController.getDashboard);

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

// Root redirect
router.get('/', (req, res) => res.redirect('/admin/dashboard'));

module.exports = router;