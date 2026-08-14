const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are all required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one number.",
      });
    }
    
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      // Same message for "no such user" and "wrong password" - don't leak which one it was
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getProfile };
