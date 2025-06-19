const express = require('express');
const VoteService = require('../services/voteService');
const { authenticateToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply authenticateToken middleware to all routes
router.use(authenticateToken);

// POST /api/experiences/:experienceId/votes - Submit or update a vote
router.post('/experiences/:experienceId/votes', requireAuth, async (req, res) => {
  try {
    console.log('POST /api/experiences/:experienceId/votes called');
    console.log('Experience ID:', req.params.experienceId);
    console.log('User ID:', req.user._id);
    console.log('Vote type:', req.body.type);

    const { type } = req.body;
    
    if (!type || !['helpful', 'detailed', 'concerning'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type. Must be helpful, detailed, or concerning.'
      });
    }

    const result = await VoteService.submitVote(req.user._id, req.params.experienceId, type);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('POST /api/experiences/:experienceId/votes error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/experiences/:experienceId/votes - Get votes for an experience
router.get('/experiences/:experienceId/votes', async (req, res) => {
  try {
    console.log('GET /api/experiences/:experienceId/votes called');
    console.log('Experience ID:', req.params.experienceId);

    const votes = await VoteService.getVotesForExperience(req.params.experienceId);

    res.status(200).json({
      success: true,
      data: votes
    });
  } catch (error) {
    console.error('GET /api/experiences/:experienceId/votes error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/experiences/:experienceId/votes/user - Get user's vote for an experience
router.get('/experiences/:experienceId/votes/user', requireAuth, async (req, res) => {
  try {
    console.log('GET /api/experiences/:experienceId/votes/user called');
    console.log('Experience ID:', req.params.experienceId);
    console.log('User ID:', req.user._id);

    const vote = await VoteService.getUserVote(req.user._id, req.params.experienceId);

    res.status(200).json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error('GET /api/experiences/:experienceId/votes/user error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/experiences/:experienceId/votes - Delete user's vote
router.delete('/experiences/:experienceId/votes', requireAuth, async (req, res) => {
  try {
    console.log('DELETE /api/experiences/:experienceId/votes called');
    console.log('Experience ID:', req.params.experienceId);
    console.log('User ID:', req.user._id);

    await VoteService.deleteVote(req.user._id, req.params.experienceId);

    res.status(200).json({
      success: true,
      message: 'Vote deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/experiences/:experienceId/votes error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;