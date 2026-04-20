const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require('../../controllers/inventoryController');
const { protect } = require('../../middlewares/authMiddleware');
const { validateInventoryItem } = require('../../middlewares/validationMiddleware');

router.use(protect);

router.route('/')
  .post(validateInventoryItem, createItem)
  .get(getItems);

router.route('/:id')
  .get(getItemById)
  .put(validateInventoryItem, updateItem)
  .delete(deleteItem);

module.exports = router;