const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/analyticsService');
const { 
  authenticateToken, 
  requireDataPermission 
} = require('../middleware/auth');

/**
 * @route GET /api/analytics
 * @desc Get usage analytics and peptide effectiveness data
 * @access Private (moderators and admins only)
 */
router.get('/', authenticateToken, requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('analyticsRoutes: GET / endpoint hit');
    
    const usageData = await AnalyticsService.getUsageAnalytics();
    const effectivenessData = await AnalyticsService.getPeptideEffectiveness();
    
    console.log('analyticsRoutes: Usage data retrieved:', usageData);
    console.log('analyticsRoutes: Effectiveness data retrieved:', effectivenessData);

    const response = {
      success: true,
      data: {
        ...usageData,
        effectivenessData
      }
    };

    console.log('analyticsRoutes: Sending response with real data');
    res.status(200).json(response);
  } catch (error) {
    console.error('Analytics general error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/peptide-effectiveness
 * @desc Get peptide effectiveness data
 * @access Private (moderators and admins only)
 */
router.get('/peptide-effectiveness', authenticateToken, requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /peptide-effectiveness endpoint hit');
    
    const data = await AnalyticsService.getPeptideEffectiveness();
    
    console.log('analyticsRoutes: Peptide effectiveness data retrieved, count:', data.length);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics peptide effectiveness error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/peptide-trends
 * @desc Get peptide trends data
 * @access Private (moderators and admins only)
 */
router.get('/peptide-trends', authenticateToken, requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /peptide-trends endpoint hit');
    
    const { period = 'monthly', limit = 12 } = req.query;
    const data = await AnalyticsService.getPeptideTrends(period, parseInt(limit));
    
    console.log('analyticsRoutes: Peptide trends data retrieved');
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics peptide trends error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/peptide-comparison
 * @desc Compare multiple peptides
 * @access Private (moderators and admins only)
 */
router.get('/peptide-comparison', authenticateToken, requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /peptide-comparison endpoint hit');
    
    const { peptideIds } = req.query;
    
    if (!peptideIds) {
      return res.status(400).json({
        success: false,
        error: 'Peptide IDs are required'
      });
    }
    
    const ids = Array.isArray(peptideIds) ? peptideIds : peptideIds.split(',');
    const data = await AnalyticsService.getPeptideComparison(ids);
    
    console.log('analyticsRoutes: Peptide comparison data retrieved, count:', data.length);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics peptide comparison error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/trends
 * @desc Get general trends data
 * @access Private (moderators and admins only)
 */
router.get('/trends', authenticateToken, requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /trends endpoint hit');
    
    const data = await AnalyticsService.getTrends();
    
    console.log('analyticsRoutes: Trends data retrieved, count:', data.length);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics trends error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/export
 * @desc Export analytics data
 * @access Private (moderators and admins only)
 */
router.get('/export', authenticateToken, requireDataPermission('export', 'analytics'), async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /export endpoint hit');
    
    const { format = 'json', type = 'all' } = req.query;
    const data = await AnalyticsService.exportData(format, type);
    
    console.log('analyticsRoutes: Analytics data exported');
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics export error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/dashboard
 * @desc Get dashboard analytics data
 * @access Private (moderators and admins only)
 */
router.get('/dashboard', authenticateToken, requireDataPermission('read', 'analytics'), async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /dashboard endpoint hit');
    
    const dashboardData = await AnalyticsService.getDashboardData();
    
    console.log('analyticsRoutes: Dashboard data retrieved');
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/public
 * @desc Get public analytics data for the home page
 * @access Public (no authentication required)
 */
router.get('/public', async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /public endpoint hit');
    
    const usageData = await AnalyticsService.getUsageAnalytics();
    const effectivenessData = await AnalyticsService.getPeptideEffectiveness();
    
    // Only return basic public data
    const publicData = {
      totalExperiences: usageData.totalExperiences || 0,
      totalPeptides: usageData.totalPeptides || 0,
      averageRating: usageData.averageRating || 0,
      activeUsers: usageData.activeUsers || 0,
      topPeptides: effectivenessData.slice(0, 6).map(item => ({
        name: item.peptide,
        experiences: item.experiences,
        rating: item.effectiveness.energy || 0
      }))
    };
    
    console.log('analyticsRoutes: Public data retrieved:', publicData);

    res.status(200).json({
      success: true,
      data: publicData
    });
  } catch (error) {
    console.error('Analytics public error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;