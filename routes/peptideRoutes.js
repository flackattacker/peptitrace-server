const express = require('express');
const router = express.Router();
const PeptideService = require('../services/peptideService');
const { 
  authenticateToken, 
  requireDataPermission 
} = require('../middleware/auth');

/**
 * @route GET /api/peptides/public
 * @desc Get public peptide data for the home page
 * @access Public (no authentication required)
 */
router.get('/public', async (req, res) => {
  try {
    console.log('peptideRoutes: GET /public endpoint hit');
    
    const peptides = await PeptideService.getAll();
    
    // Only return basic public data
    const publicPeptides = peptides.slice(0, 6).map(peptide => ({
      _id: peptide._id,
      name: peptide.name,
      category: peptide.category,
      totalExperiences: peptide.totalExperiences || 0,
      averageRating: peptide.averageRating || 0
    }));
    
    console.log('peptideRoutes: Public peptides retrieved successfully, count:', publicPeptides.length);
    
    res.status(200).json({
      success: true,
      data: {
        peptides: publicPeptides
      }
    });
  } catch (error) {
    console.error('Get public peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/peptides
 * @desc Get all peptides
 * @access Public (no authentication required)
 */
router.get('/', async (req, res) => {
  try {
    console.log('peptideRoutes: GET / endpoint hit');
    
    const peptides = await PeptideService.getAll();
    
    console.log('peptideRoutes: Peptides retrieved successfully, count:', peptides.length);
    
    res.status(200).json({
      success: true,
      data: {
        peptides
      }
    });
  } catch (error) {
    console.error('Get peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/peptides/:id
 * @desc Get peptide by ID
 * @access Public (no authentication required)
 */
router.get('/:id', async (req, res) => {
  try {
    console.log('peptideRoutes: GET /:id endpoint hit with id:', req.params.id);
    
    const peptide = await PeptideService.getById(req.params.id);
    
    console.log('peptideRoutes: Peptide retrieved successfully:', peptide._id);
    
    res.status(200).json({
      success: true,
      data: {
        peptide
      }
    });
  } catch (error) {
    console.error('Get peptide by ID error:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/peptides
 * @desc Create a new peptide
 * @access Private (moderators and admins only)
 */
router.post('/', authenticateToken, requireDataPermission('create', 'peptide'), async (req, res) => {
  try {
    console.log('peptideRoutes: POST / endpoint hit');
    
    const peptide = await PeptideService.create(req.body);
    
    console.log('peptideRoutes: Peptide created successfully:', peptide._id);
    
    res.status(201).json({
      success: true,
      data: {
        peptide
      }
    });
  } catch (error) {
    console.error('Create peptide error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route PUT /api/peptides/:id
 * @desc Update a peptide
 * @access Private (moderators and admins only)
 */
router.put('/:id', authenticateToken, requireDataPermission('update', 'peptide'), async (req, res) => {
  try {
    console.log('peptideRoutes: PUT /:id endpoint hit with id:', req.params.id);
    
    const peptide = await PeptideService.update(req.params.id, req.body);
    
    console.log('peptideRoutes: Peptide updated successfully:', peptide._id);
    
    res.status(200).json({
      success: true,
      data: {
        peptide
      }
    });
  } catch (error) {
    console.error('Update peptide error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/peptides/:id
 * @desc Delete a peptide
 * @access Private (admins only)
 */
router.delete('/:id', authenticateToken, requireDataPermission('delete', 'peptide'), async (req, res) => {
  try {
    console.log('peptideRoutes: DELETE /:id endpoint hit with id:', req.params.id);
    
    const result = await PeptideService.deleteById(req.params.id);
    
    console.log('peptideRoutes: Peptide deleted successfully');
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Delete peptide error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/peptides/search/:query
 * @desc Search peptides
 * @access Public (authenticated users can search)
 */
router.get('/search/:query', authenticateToken, requireDataPermission('read', 'peptide'), async (req, res) => {
  try {
    console.log('peptideRoutes: GET /search/:query endpoint hit with query:', req.params.query);
    
    const peptides = await PeptideService.search(req.params.query);
    
    console.log('peptideRoutes: Peptide search completed, found:', peptides.length);
    
    res.status(200).json({
      success: true,
      data: {
        peptides
      }
    });
  } catch (error) {
    console.error('Search peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/peptides/analytics/popular
 * @desc Get popular peptides analytics
 * @access Private (moderators and admins only)
 */
router.get('/analytics/popular', requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('peptideRoutes: GET /analytics/popular endpoint hit');
    
    const popularPeptides = await PeptideService.getPopularPeptides();
    
    res.status(200).json({
      success: true,
      data: {
        popularPeptides
      }
    });
  } catch (error) {
    console.error('Get popular peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/peptides/analytics/trending
 * @desc Get trending peptides analytics
 * @access Private (moderators and admins only)
 */
router.get('/analytics/trending', requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('peptideRoutes: GET /analytics/trending endpoint hit');
    
    const trendingPeptides = await PeptideService.getTrendingPeptides();
    
    res.status(200).json({
      success: true,
      data: {
        trendingPeptides
      }
    });
  } catch (error) {
    console.error('Get trending peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;