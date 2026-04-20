const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');
const { validateCategory } = require('../middlewares/validationMiddleware');

router.use(protect); // All category routes require authentication

router.route('/')
  .post(validateCategory, createCategory)
  .get(getCategories);

router.route('/:id')
  .delete(deleteCategory);

module.exports = router;