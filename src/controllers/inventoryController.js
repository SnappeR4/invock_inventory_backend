const InventoryItem = require('../models/InventoryItem');
const Category = require('../models/Category');

// @desc    Create a new inventory item
// @route   POST /api/inventory
// @access  Private
const createItem = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
    }

    const item = await InventoryItem.create({
      name,
      description,
      price,
      category,
    });

    // Populate category for response
    await item.populate('category', 'name');

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inventory items with pagination, search, and category filter
// @route   GET /api/inventory
// @access  Private
const getItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const categoryId = req.query.category || null;

    const query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (categoryId && categoryId !== 'all') {
      query.category = categoryId;
    }

    const total = await InventoryItem.countDocuments(query);
    const items = await InventoryItem.find(query)
      .populate('category', 'name')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
const getItemById = async (req, res, next) => {
  try {
    const item = await InventoryItem.findById(req.params.id).populate('category', 'name');
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
const updateItem = async (req, res, next) => {
  try {
    let item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const { name, description, price, category } = req.body;

    // If category is being updated, verify it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID',
        });
      }
    }

    item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category },
      { new: true, runValidators: true }
    ).populate('category', 'name');

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
};