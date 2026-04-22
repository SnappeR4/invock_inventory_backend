const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../../controllers/categoryController');
const { protect } = require('../../middlewares/authMiddleware');
const { validateCategory } = require('../../middlewares/validationMiddleware');

router.use(protect);

router.route('/')
  .post(validateCategory, createCategory)
  .get(getCategories);

router.route('/:id')
  .put(validateCategory, updateCategory)
  .delete(deleteCategory);


module.exports = router;