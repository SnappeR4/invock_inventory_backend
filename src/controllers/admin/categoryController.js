const Category = require('../../models/Category');
const InventoryItem = require('../../models/InventoryItem');

// @desc    Show categories list page
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('categories/index', {
      title: 'Categories',
      currentPage: 'categories',
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Category.create({ name });
    res.redirect('/admin/categories?success=Category created');
  } catch (error) {
    if (error.code === 11000) {
      return res.redirect('/admin/categories?error=Category name already exists');
    }
    next(error);
  }
};

// @desc    Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { name }, { runValidators: true });
    res.redirect('/admin/categories?success=Category updated');
  } catch (error) {
    if (error.code === 11000) {
      return res.redirect('/admin/categories?error=Category name already exists');
    }
    next(error);
  }
};

// @desc    Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    // Check if used in inventory
    const count = await InventoryItem.countDocuments({ category: req.params.id });
    if (count > 0) {
      return res.redirect('/admin/categories?error=Cannot delete category that is used by inventory items');
    }
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/categories?success=Category deleted');
  } catch (error) {
    next(error);
  }
};