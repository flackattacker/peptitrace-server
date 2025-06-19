const mongoose = require('mongoose');

const effectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['positive', 'negative'],
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Physical Performance',
      'Recovery',
      'Mental/Cognitive',
      'Appearance',
      'Sleep',
      'Metabolic',
      'Side Effect'
    ]
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'mild'
  },
  frequency: {
    type: String,
    enum: ['rare', 'uncommon', 'common', 'very_common'],
    default: 'common'
  },
  isCommon: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
effectSchema.index({ name: 'text', description: 'text', category: 'text' });
effectSchema.index({ type: 1, category: 1 });

module.exports = mongoose.model('Effect', effectSchema);