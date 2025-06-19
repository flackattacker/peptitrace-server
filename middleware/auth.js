const jwt = require('jsonwebtoken');
const AuthService = require('../services/AuthService');
const User = require('../models/User');

console.log('Loading auth middleware...');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      console.error('JWT_ACCESS_SECRET not configured');
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Check if user exists and is approved
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'approved') {
      return res.status(401).json({
        success: false,
        message: user?.status === 'pending' ? 'Account pending approval' : 'Account not active'
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
  }
  next();
};

// Enhanced moderator middleware with role checking
const requireModerator = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
  }
  
  const user = await User.findById(req.user.userId);
  if (!user || user.role !== 'moderator') {
    return res.status(403).json({
      success: false,
      message: 'Moderator access required'
    });
  }
  
  next();
};

// New admin middleware
const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
  }
  
  const user = await User.findById(req.user.userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  next();
};

// Enhanced permission middleware for data operations
const requireDataPermission = (operation, resource) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Define permission matrix
    const permissions = {
      // Experience permissions
      'experience': {
        'create': ['user', 'moderator', 'admin'],
        'read': ['user', 'moderator', 'admin'],
        'update': ['user', 'moderator', 'admin'], // Users can only update their own
        'delete': ['user', 'moderator', 'admin'], // Users can only delete their own
        'moderate': ['moderator', 'admin']
      },
      // Peptide permissions
      'peptide': {
        'create': ['moderator', 'admin'],
        'read': ['user', 'moderator', 'admin'],
        'update': ['moderator', 'admin'],
        'delete': ['admin'],
        'moderate': ['moderator', 'admin']
      },
      // User management permissions
      'user': {
        'create': ['moderator', 'admin'],
        'read': ['user', 'moderator', 'admin'], // Users can only read their own
        'update': ['user', 'moderator', 'admin'], // Users can only update their own
        'delete': ['admin'],
        'moderate': ['moderator', 'admin']
      },
      // Analytics permissions
      'analytics': {
        'read': ['moderator', 'admin'],
        'export': ['moderator', 'admin']
      }
    };

    const allowedRoles = permissions[resource]?.[operation];
    if (!allowedRoles) {
      return res.status(403).json({
        success: false,
        message: `Operation ${operation} on ${resource} not defined`
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions for ${operation} on ${resource}`
      });
    }

    // Special case: Users can only modify their own data
    if (operation === 'update' || operation === 'delete') {
      if (resource === 'experience' || resource === 'user') {
        const resourceId = req.params.id || req.params.userId;
        if (resourceId && resourceId !== req.user.userId.toString()) {
          // Check if user owns the resource
          if (resource === 'experience') {
            const Experience = require('../models/Experience');
            const experience = await Experience.findById(resourceId);
            if (!experience || experience.userId.toString() !== req.user.userId.toString()) {
              return res.status(403).json({
                success: false,
                message: 'You can only modify your own data'
              });
            }
          } else if (resource === 'user') {
            if (resourceId !== req.user.userId.toString()) {
              return res.status(403).json({
                success: false,
                message: 'You can only modify your own data'
              });
            }
          }
        }
      }
    }

    next();
  };
};

// Rate limiting middleware for experience submissions
const rateLimitExperienceSubmission = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required for rate limiting' 
    });
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check user's recent submissions (last 24 hours)
  const Experience = require('../models/Experience');
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const recentSubmissions = await Experience.countDocuments({
    userId: req.user.userId,
    createdAt: { $gte: oneDayAgo }
  });

  // Different limits based on user role
  const limits = {
    'user': 5,
    'moderator': 20,
    'admin': 50
  };

  const limit = limits[user.role] || limits['user'];

  if (recentSubmissions >= limit) {
    return res.status(429).json({
      success: false,
      message: `Rate limit exceeded. Maximum ${limit} submissions per 24 hours.`
    });
  }

  next();
};

console.log('authenticateToken function defined:', typeof authenticateToken);
console.log('About to export auth middleware:', { 
  authenticateToken, 
  requireAuth, 
  requireModerator, 
  requireAdmin,
  requireDataPermission,
  rateLimitExperienceSubmission
});
console.log('Export keys:', Object.keys({ 
  authenticateToken, 
  requireAuth, 
  requireModerator, 
  requireAdmin,
  requireDataPermission,
  rateLimitExperienceSubmission
}));
console.log('Export authenticateToken type:', typeof authenticateToken);

module.exports = {
  authenticateToken,
  requireAuth,
  requireModerator,
  requireAdmin,
  requireDataPermission,
  rateLimitExperienceSubmission
};

console.log('Auth middleware exported successfully'); 