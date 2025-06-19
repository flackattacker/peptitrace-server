const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const { 
  authenticateToken, 
  requireAuth, 
  requireModerator, 
  requireDataPermission 
} = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('userRoutes.js: Loading user routes file');

// Add logging middleware for all user routes
router.use((req, res, next) => {
  console.log(`userRoutes: ${req.method} ${req.originalUrl} called`);
  console.log('userRoutes: Request headers:', req.headers);
  console.log('userRoutes: Request body:', req.body);
  console.log('userRoutes: Request query:', req.query);
  next();
});

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private (users can read their own profile)
 */
router.get('/me', authenticateToken, requireDataPermission('read', 'user'), async (req, res) => {
  console.log('userRoutes: GET /me endpoint hit');
  console.log('userRoutes: User from token:', req.user);
  
  // Check if user exists in request
  if (!req.user) {
    console.log('userRoutes: No user found in request');
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  console.log('userRoutes: User ID from token:', req.user.userId);
  console.log('userRoutes: User ID type:', typeof req.user.userId);
  try {
    const user = await UserService.getUserById(req.user.userId);
    console.log('userRoutes: User found:', user);

    if (!user) {
      console.log('userRoutes: User not found in database');
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('userRoutes: Error in GET /me:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route PUT /api/users/me
 * @desc Update current user profile
 * @access Private (users can update their own profile)
 */
router.put('/me', authenticateToken, requireDataPermission('update', 'user'), async (req, res) => {
  console.log('userRoutes: PUT /me endpoint hit');
  console.log('userRoutes: User from token:', req.user);
  
  // Check if user exists in request
  if (!req.user) {
    console.log('userRoutes: No user found in request');
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  console.log('userRoutes: User ID from token:', req.user.userId);
  console.log('userRoutes: Update data:', req.body);
  try {
    const updatedUser = await UserService.updateUser(req.user.userId, req.body);
    console.log('userRoutes: User updated:', updatedUser);

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('userRoutes: Error in PUT /me:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  console.log('userRoutes: POST /register endpoint hit');
  try {
    let { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Generate username from email
    const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 8);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with pending status
    const user = await UserService.createUser({
      username,
      email,
      password: hashedPassword,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending approval.',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('userRoutes: Error in POST /register:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/users/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  console.log('userRoutes: POST /login endpoint hit');
  try {
    const { email, password } = req.body;
    console.log('userRoutes: Login attempt for email:', email);

    const authResult = await UserService.authenticateUser(email, password);
    if (!authResult) {
      console.log('userRoutes: Authentication failed');
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    console.log('userRoutes: Authentication successful, sending response');
    res.json({
      success: true,
      data: authResult
    });
  } catch (error) {
    console.error('userRoutes: Error in POST /login:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/users/pending
 * @desc Get all pending user registrations
 * @access Private (moderators and admins only)
 */
router.get('/pending', authenticateToken, requireDataPermission('moderate', 'user'), async (req, res) => {
  console.log('userRoutes: GET /pending endpoint hit');
  try {
    const pendingUsers = await UserService.getPendingUsers();
    res.status(200).json({
      success: true,
      users: pendingUsers
    });
  } catch (error) {
    console.error('userRoutes: Error in GET /pending:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/users/:id/approve
 * @desc Approve a pending user registration
 * @access Private (moderators and admins only)
 */
router.post('/:id/approve', authenticateToken, requireDataPermission('moderate', 'user'), async (req, res) => {
  console.log('userRoutes: POST /:id/approve endpoint hit');
  try {
    const user = await UserService.approveUser(req.params.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('userRoutes: Error in POST /:id/approve:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/users/:id/reject
 * @desc Reject a pending user registration
 * @access Private (moderators and admins only)
 */
router.post('/:id/reject', authenticateToken, requireDataPermission('moderate', 'user'), async (req, res) => {
  console.log('userRoutes: POST /:id/reject endpoint hit');
  try {
    const { notes } = req.body;
    const user = await UserService.rejectUser(req.params.id, notes);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('userRoutes: Error in POST /:id/reject:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private (users can read their own profile, moderators can read all)
 */
router.get('/:id', authenticateToken, requireDataPermission('read', 'user'), async (req, res) => {
  console.log('userRoutes: GET /:id endpoint hit');
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('userRoutes: Error in GET /:id:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route PUT /api/users/:id
 * @desc Update user by ID
 * @access Private (users can update their own profile, moderators can update all)
 */
router.put('/:id', authenticateToken, requireDataPermission('update', 'user'), async (req, res) => {
  console.log('userRoutes: PUT /:id endpoint hit');
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('userRoutes: Error in PUT /:id:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/users/:id
 * @desc Delete user by ID
 * @access Private (admins only)
 */
router.delete('/:id', authenticateToken, requireDataPermission('delete', 'user'), async (req, res) => {
  console.log('userRoutes: DELETE /:id endpoint hit');
  try {
    const result = await UserService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('userRoutes: Error in DELETE /:id:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/users/analytics/overview
 * @desc Get user analytics overview
 * @access Private (moderators and admins only)
 */
router.get('/analytics/overview', authenticateToken, requireDataPermission('read', 'analytics'), async (req, res) => {
  console.log('userRoutes: GET /analytics/overview endpoint hit');
  try {
    const analytics = await UserService.getUserAnalytics();
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('userRoutes: Error in GET /analytics/overview:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

console.log('userRoutes.js: Routes defined successfully');

module.exports = router;