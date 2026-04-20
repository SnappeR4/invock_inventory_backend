const User = require('../../models/User');
const generateToken = require('../../utils/generateToken');

// @desc    Show login page
// @route   GET /admin/login
exports.getLoginPage = (req, res) => {
  // If already logged in, redirect to dashboard
  const token = req.cookies?.token;
  if (token) {
    return res.redirect('/admin/dashboard');
  }
  res.render('auth/login', {
    title: 'Admin Login',
    layout: false, // Use standalone layout without header/footer
    error: req.query.error || null,
  });
};

// @desc    Authenticate admin
// @route   POST /admin/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.redirect('/admin/login?error=Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.redirect('/admin/login?error=Invalid email or password');
    }

    // Generate token and set as HTTP-only cookie
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect('/admin/dashboard');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout admin
// @route   GET /admin/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
};

// @desc    Show dashboard
// @route   GET /admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const Category = require('../../models/Category');
    const InventoryItem = require('../../models/InventoryItem');
    const User = require('../../models/User');

    const [userCount, categoryCount, itemCount] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      InventoryItem.countDocuments(),
    ]);

    res.render('dashboard/index', {
      title: 'Dashboard',
      currentPage: 'dashboard',
      user: req.user, // from auth middleware
      counts: {
        users: userCount,
        categories: categoryCount,
        items: itemCount,
      },
    });
  } catch (error) {
    next(error);
  }
};