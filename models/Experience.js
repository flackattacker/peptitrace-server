const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  peptideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Peptide',
    required: true,
    index: true
  },
  peptideName: {
    type: String,
    required: true
  },
  trackingId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'every-other-day', 'twice-weekly', 'weekly', 'as-needed']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  routeOfAdministration: {
    type: String,
    required: true,
    enum: ['subcutaneous', 'intramuscular', 'oral', 'nasal']
  },
  primaryPurpose: [{
    type: String,
    required: true
  }],
  demographics: {
    ageRange: {
      type: String,
      enum: ['18-25', '25-30', '30-35', '35-40', '40-45', '45-50', '50+']
    },
    biologicalSex: {
      type: String,
      enum: ['male', 'female', 'prefer-not-to-say']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'moderate', 'active', 'athletic']
    }
  },
  outcomes: {
    type: Map,
    of: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Map && v.size > 0;
      },
      message: 'Outcomes must be a non-empty Map'
    }
  },
  effects: [{
    type: String
  }],
  timeline: {
    type: String,
    required: true,
    enum: ['immediately', '1-3-days', '1-week', '2-weeks', '3-4-weeks', '1-2-months', 'no-effects']
  },
  story: {
    type: String,
    maxlength: 1000
  },
  stack: [{
    type: String
  }],
  sourcing: {
    vendorUrl: String,
    batchId: String,
    purityPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    volumeMl: {
      type: Number,
      min: 0
    }
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  totalVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Vendor Information
  vendor: {
    name: {
      type: String,
      trim: true
    },
    quantity: {
      type: String,
      trim: true
    },
    batchId: {
      type: String,
      trim: true
    }
  }
}, {
  versionKey: false,
  timestamps: { updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
experienceSchema.index({ peptideId: 1, createdAt: -1 });
experienceSchema.index({ userId: 1, createdAt: -1 });
experienceSchema.index({ createdAt: -1 });
experienceSchema.index({ trackingId: 1 });

// Transform output to match frontend expectations
experienceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.submittedAt = ret.createdAt;
    return ret;
  }
});

experienceSchema.virtual('averageRating').get(function() {
  const outcomes = this.outcomes;
  if (!outcomes) return 0;
  
  const values = Array.from(outcomes.values());
  if (values.length === 0) return 0;
  
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;