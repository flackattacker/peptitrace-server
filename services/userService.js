const { randomUUID } = require('crypto');

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async createUser(userData) {
    try {
      console.log('UserService.createUser called with:', userData);

      const user = new User(userData);
      const savedUser = await user.save();
      console.log('UserService.createUser: User created successfully:', savedUser._id);

      return savedUser;
    } catch (error) {
      console.error('UserService.createUser error:', error);
      throw error;
    }
  }

  /**
   * Create a new user (alias for createUser for compatibility)
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async create(userData) {
    try {
      console.log('UserService.create called with:', userData);
      return await this.createUser(userData);
    } catch (error) {
      console.error('UserService.create error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  static async getUserById(userId) {
    try {
      console.log('UserService.getUserById called with:', userId);

      const user = await User.findById(userId).select('-password -refreshToken');
      console.log('UserService.getUserById: Found user:', user ? user._id : 'null');

      return user;
    } catch (error) {
      console.error('UserService.getUserById error:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  static async getUserByEmail(email) {
    try {
      console.log('UserService.getUserByEmail called with:', email);

      const user = await User.findOne({ email });
      console.log('UserService.getUserByEmail: Found user:', user ? user._id : 'null');

      return user;
    } catch (error) {
      console.error('UserService.getUserByEmail error:', error);
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  static async updateUser(userId, updateData) {
    try {
      console.log('UserService.updateUser called with:', userId, updateData);

      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password -refreshToken');

      console.log('UserService.updateUser: Updated user:', user ? user._id : 'null');

      return user;
    } catch (error) {
      console.error('UserService.updateUser error:', error);
      throw error;
    }
  }

  /**
   * Authenticate user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result
   */
  static async authenticateUser(email, password) {
    try {
      console.log('UserService.authenticateUser called with email:', email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log('UserService.authenticateUser: User not found');
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('UserService.authenticateUser: Invalid password');
        return null;
      }

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Update user with new refresh token and last login
      await User.findByIdAndUpdate(user._id, {
        refreshToken,
        lastLoginAt: new Date()
      });

      console.log('UserService.authenticateUser: Authentication successful');

      return {
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status,
          demographics: user.demographics,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken
      };
    } catch (error) {
      console.error('UserService.authenticateUser error:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with password (alias for authenticateUser for compatibility)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object if authentication successful, null otherwise
   */
  static async authenticateWithPassword(email, password) {
    try {
      console.log('UserService.authenticateWithPassword called with email:', email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log('UserService.authenticateWithPassword: User not found');
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('UserService.authenticateWithPassword: Invalid password');
        return null;
      }

      // Update last login
      await User.findByIdAndUpdate(user._id, {
        lastLoginAt: new Date()
      });

      console.log('UserService.authenticateWithPassword: Authentication successful');

      return {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        demographics: user.demographics,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('UserService.authenticateWithPassword error:', error);
      throw error;
    }
  }

  /**
   * Authenticate user (alias for authenticateWithPassword for compatibility)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object if authentication successful, null otherwise
   */
  static async authenticate(email, password) {
    try {
      console.log('UserService.authenticate called with email:', email);
      return await this.authenticateWithPassword(email, password);
    } catch (error) {
      console.error('UserService.authenticate error:', error);
      throw error;
    }
  }

  /**
   * Login user (alias for authenticateWithPassword for compatibility)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object if authentication successful, null otherwise
   */
  static async login(email, password) {
    try {
      console.log('UserService.login called with email:', email);
      return await this.authenticateWithPassword(email, password);
    } catch (error) {
      console.error('UserService.login error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Deletion result
   */
  static async deleteUser(userId) {
    try {
      console.log('UserService.deleteUser called with:', userId);

      const result = await User.findByIdAndDelete(userId);
      console.log('UserService.deleteUser: Deletion result:', result ? 'success' : 'not found');

      return !!result;
    } catch (error) {
      console.error('UserService.deleteUser error:', error);
      throw error;
    }
  }

  /**
   * Get all pending user registrations
   * @returns {Promise<Array>} Array of pending users
   */
  static async getPendingUsers() {
    try {
      console.log('UserService.getPendingUsers called');
      const users = await User.find({ status: 'pending' })
        .select('-password -refreshToken')
        .sort({ createdAt: -1 });
      console.log('UserService.getPendingUsers: Found', users.length, 'pending users');
      return users;
    } catch (error) {
      console.error('UserService.getPendingUsers error:', error);
      throw error;
    }
  }

  /**
   * Approve a pending user registration
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user
   */
  static async approveUser(userId) {
    try {
      console.log('UserService.approveUser called with:', userId);
      const user = await User.findByIdAndUpdate(
        userId,
        {
          status: 'approved',
          approvalDate: new Date()
        },
        { new: true, runValidators: true }
      ).select('-password -refreshToken');

      if (!user) {
        throw new Error('User not found');
      }

      console.log('UserService.approveUser: User approved:', user._id);
      return user;
    } catch (error) {
      console.error('UserService.approveUser error:', error);
      throw error;
    }
  }

  /**
   * Reject a pending user registration
   * @param {string} userId - User ID
   * @param {string} notes - Rejection notes
   * @returns {Promise<Object>} Updated user
   */
  static async rejectUser(userId, notes) {
    try {
      console.log('UserService.rejectUser called with:', userId, notes);
      const user = await User.findByIdAndUpdate(
        userId,
        {
          status: 'rejected',
          moderatorNotes: notes
        },
        { new: true, runValidators: true }
      ).select('-password -refreshToken');

      if (!user) {
        throw new Error('User not found');
      }

      console.log('UserService.rejectUser: User rejected:', user._id);
      return user;
    } catch (error) {
      console.error('UserService.rejectUser error:', error);
      throw error;
    }
  }
}

module.exports = UserService;