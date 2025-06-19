const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { validatePassword, isPasswordHash } = require('../utils/password.js');
const {randomUUID} = require("crypto");

// Helper function to convert height between units
const convertHeight = (height, fromUnit, toUnit) => {
  if (!height) return height;
  if (fromUnit === toUnit) return height;
  
  if (fromUnit === 'ft' && toUnit === 'cm') {
    return Math.round(height * 30.48); // Convert feet to cm
  } else if (fromUnit === 'cm' && toUnit === 'ft') {
    return Math.round((height / 30.48) * 100) / 100; // Convert cm to feet
  }
  return height;
};

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderatorNotes: {
    type: String,
    default: ''
  },
  approvalDate: {
    type: Date
  },
  demographics: {
    age: {
      type: Number,
      min: 18,
      max: 120,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },
    weight: {
      type: Number,
      min: 30,
      max: 500,
    },
    height: {
      type: Number,
      min: 100, // 3.28 ft
      max: 250, // 8.2 ft
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'],
    },
    fitnessGoals: [{
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'strength', 'endurance', 'general-health', 'recovery', 'anti-aging'],
    }],
    medicalConditions: [{
      type: String,
    }],
    allergies: [{
      type: String,
    }],
  },
  preferences: {
    units: {
      weight: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg',
      },
      height: {
        type: String,
        enum: ['cm', 'ft'],
        default: 'cm',
      },
    },
    privacy: {
      shareAge: {
        type: Boolean,
        default: true,
      },
      shareGender: {
        type: Boolean,
        default: true,
      },
      shareWeight: {
        type: Boolean,
        default: false,
      },
      shareHeight: {
        type: Boolean,
        default: false,
      },
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      newExperiences: {
        type: Boolean,
        default: false,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  profileUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    unique: true,
    index: true,
    default: () => randomUUID(),
  },
}, {
  versionKey: false,
});

// Update the updatedAt timestamp before saving
schema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Hash password if it's modified and not already hashed
  if (this.isModified('password') && !isPasswordHash(this.password)) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  
  // Convert height to cm for storage if it's in feet
  if (this.isModified('demographics.height') && this.preferences?.units?.height === 'ft') {
    this.demographics.height = convertHeight(this.demographics.height, 'ft', 'cm');
  }
  
  next();
});

// Convert height back to feet when retrieving if that's the preferred unit
schema.methods.toJSON = function() {
  const obj = this.toObject();
  
  if (obj.preferences?.units?.height === 'ft' && obj.demographics?.height) {
    obj.demographics.height = convertHeight(obj.demographics.height, 'cm', 'ft');
  }
  
  return obj;
};

const User = mongoose.model('User', schema);

module.exports = User;