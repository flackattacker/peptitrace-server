const mongoose = require('mongoose');

// Regular expression for validating peptide sequences
// Allows for standard amino acid codes (single letter or three letter)
// Also allows for common modifications and terminal groups
const PEPTIDE_SEQUENCE_REGEX = /^[A-Za-z0-9\-\[\]\(\)\.]+(?:-[A-Za-z0-9\-\[\]\(\)\.]+)*$/;

const peptideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  peptide_sequence: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return PEPTIDE_SEQUENCE_REGEX.test(v);
      },
      message: props => `${props.value} is not a valid peptide sequence!`
    }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Healing & Recovery',
      'Growth Hormone',
      'Anti-Aging',
      'Performance & Enhancement',
      'Cognitive Enhancement',
      'GLP-1 Agonist',
      'GLP-1/GIP Agonist',
      'GLP-1/GIP/Glucagon Agonist',
      'Immune Support',
      'Fat Loss',
      'Metabolic Control',
      'Weight Management',
      'Glycemic Control',
      'Appetite Regulation'
    ]
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String,
    required: true
  },
  mechanism: {
    type: String,
    required: true
  },
  commonDosage: {
    type: String,
    required: true
  },
  commonFrequency: {
    type: String,
    required: true
  },
  commonEffects: [{
    type: String,
    required: true
  }],
  sideEffects: [{
    type: String,
    required: true
  }],
  dosageRanges: {
    low: {
      type: String,
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    high: {
      type: String,
      required: true
    }
  },
  timeline: {
    onset: {
      type: String,
      required: true
    },
    peak: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Add text index for search functionality
peptideSchema.index({
  name: 'text',
  description: 'text',
  detailedDescription: 'text',
  mechanism: 'text',
  commonEffects: 'text'
});

const Peptide = mongoose.model('Peptide', peptideSchema);

module.exports = Peptide;