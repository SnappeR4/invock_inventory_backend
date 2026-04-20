const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// @desc    Show users list page
// @route   GET /admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('users/index', {
      title: 'Users',
      currentPage: 'users',
      users,
      user: req.user,
      messages: req.flash?.() || {}, // if you use flash, else ignore
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /admin/users
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.redirect('/admin/users?error=Email already exists');
    }

    await User.create({ name, email, password });
    res.redirect('/admin/users?success=User created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   POST /admin/users/:id/update
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;

    const updateData = { name, email };
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await User.findByIdAndUpdate(userId, updateData, { runValidators: true });
    res.redirect('/admin/users?success=User updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   POST /admin/users/:id/delete
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users?success=User deleted successfully');
  } catch (error) {
    next(error);
  }
};