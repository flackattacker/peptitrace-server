const express = require('express');
const router = express.Router();
const Effect = require('../models/Effect');

/**
 * @route GET /api/effects
 * @desc Get all effects with optional filtering
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    console.log('effectRoutes: GET / endpoint hit');
    
    const { type, category } = req.query;
    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    const effects = await Effect.find(query);
    
    console.log('effectRoutes: Effects retrieved successfully, count:', effects.length);
    
    res.status(200).json({
      success: true,
      data: {
        effects
      }
    });
  } catch (error) {
    console.error('Get effects error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 