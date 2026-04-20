const InventoryItem = require('../../models/InventoryItem');
const Category = require('../../models/Category');

// @desc    Show inventory list page with filters and pagination
exports.getInventory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';
    const categoryId = req.query.category || '';

    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (categoryId) {
      query.category = categoryId;
    }

    const total = await InventoryItem.countDocuments(query);
    const items = await InventoryItem.find(query)
      .populate('category', 'name')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const categories = await Category.find().sort({ name: 1 });

    res.render('inventory/index', {
      title: 'Inventory',
      currentPage: 'inventory',
      items,
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: { search, category: categoryId },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory item
exports.createItem = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    await InventoryItem.create({ name, description, price, category });
    res.redirect('/admin/inventory?success=Item created');
  } catch (error) {
    if (error.code === 11000) {
      return res.redirect('/admin/inventory?error=Item name already exists');
    }
    next(error);
  }
};

// @desc    Update inventory item
exports.updateItem = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category },
      { runValidators: true }
    );
    res.redirect('/admin/inventory?success=Item updated');
  } catch (error) {
    if (error.code === 11000) {
      return res.redirect('/admin/inventory?error=Item name already exists');
    }
    next(error);
  }
};

// @desc    Delete inventory item
exports.deleteItem = async (req, res, next) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.redirect('/admin/inventory?success=Item deleted');
  } catch (error) {
    next(error);
  }
};