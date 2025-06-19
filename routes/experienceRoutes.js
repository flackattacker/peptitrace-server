const express = require('express');
const router = express.Router();
const ExperienceService = require('../services/experienceService');
const VoteService = require('../services/voteService');
const { 
  authenticateToken, 
  requireAuth, 
  requireDataPermission, 
  rateLimitExperienceSubmission 
} = require('../middleware/auth');

console.log('experienceRoutes.js: Loading experience routes file');

/**
 * @route GET /api/experiences/home/public
 * @desc Get public experience data for the home page
 * @access Public (no authentication required)
 */
router.get('/home/public', async (req, res) => {
  console.log('experienceRoutes: GET /home/public endpoint hit');
  try {
    const result = await ExperienceService.getAll(req.query);
    
    // Only return basic public data (limit to 3 most recent)
    const publicExperiences = result.experiences.slice(0, 3).map(exp => ({
      _id: exp._id,
      peptideName: exp.peptideName,
      createdAt: exp.createdAt,
      story: exp.story,
      dosage: exp.dosage,
      outcomes: exp.outcomes
    }));
    
    console.log('experienceRoutes: Public experiences retrieved successfully, count:', publicExperiences.length);
    
    res.status(200).json({
      success: true,
      data: {
        experiences: publicExperiences
      }
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /home/public:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/peptide/:peptideId
 * @desc Get experiences for a specific peptide
 * @access Public (no authentication required)
 */
router.get('/peptide/:peptideId', async (req, res) => {
  console.log('experienceRoutes: GET /peptide/:peptideId endpoint hit');
  try {
    const experiences = await ExperienceService.getByPeptideId(req.params.peptideId);
    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /peptide/:peptideId:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Apply authenticateToken middleware to routes that need authentication
router.use(authenticateToken);

/**
 * @route GET /api/experiences
 * @desc Get all experiences with optional filters
 * @access Public (authenticated users can read)
 */
router.get('/', requireDataPermission('read', 'experience'), async (req, res) => {
  console.log('experienceRoutes: GET / endpoint hit');
  try {
    const result = await ExperienceService.getAll(req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/tracking/:trackingId
 * @desc Get an experience by tracking ID
 * @access Public (authenticated users can read)
 */
router.get('/tracking/:trackingId', requireDataPermission('read', 'experience'), async (req, res) => {
  console.log('experienceRoutes: GET /tracking/:trackingId endpoint hit');
  try {
    const experience = await ExperienceService.getByTrackingId(req.params.trackingId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: { experience }
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /tracking/:trackingId:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/user/:userId
 * @desc Get experiences by user ID
 * @access Private (users can only see their own experiences, moderators can see all)
 */
router.get('/user/:userId', requireDataPermission('read', 'experience'), async (req, res) => {
  console.log('experienceRoutes: GET /user/:userId endpoint hit');
  try {
    const experiences = await ExperienceService.getByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      data: experiences
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /user/:userId:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/:id
 * @desc Get a single experience by ID
 * @access Public (authenticated users can read)
 */
router.get('/:id', requireDataPermission('read', 'experience'), async (req, res) => {
  console.log('experienceRoutes: GET /:id endpoint hit');
  try {
    const experience = await ExperienceService.getById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:id:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/experiences
 * @desc Create a new experience
 * @access Private (authenticated users can create, with rate limiting)
 */
router.post('/', 
  requireDataPermission('create', 'experience'),
  rateLimitExperienceSubmission,
  async (req, res) => {
    console.log('experienceRoutes: POST / endpoint hit');
    try {
      // Check honeypot field
      if (req.body.website) {
        console.log("Experience submission rejected: Honeypot field was filled");
        return res.status(400).json({ error: "Invalid submission" });
      }

      const experience = await ExperienceService.create(req.user?.userId, req.body);
      res.status(201).json({
        success: true,
        data: experience
      });
    } catch (error) {
      console.error('experienceRoutes: Error in POST /:', error);
      res.status(500).json({ error: "Failed to submit experience" });
    }
  }
);

/**
 * @route PUT /api/experiences/:id
 * @desc Update an experience
 * @access Private (users can only update their own experiences)
 */
router.put('/:id', requireDataPermission('update', 'experience'), async (req, res) => {
  console.log('experienceRoutes: PUT /:id endpoint hit');
  try {
    const experience = await ExperienceService.update(req.params.id, req.user.userId, req.body);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('experienceRoutes: Error in PUT /:id:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/experiences/:id
 * @desc Delete an experience
 * @access Private (users can only delete their own experiences)
 */
router.delete('/:id', requireDataPermission('delete', 'experience'), async (req, res) => {
  console.log('experienceRoutes: DELETE /:id endpoint hit');
  try {
    const result = await ExperienceService.deleteById(req.params.id, req.user.userId);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('experienceRoutes: Error in DELETE /:id:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/:id/votes
 * @desc Get votes for an experience
 * @access Public (authenticated users can read)
 */
router.get('/:id/votes', requireDataPermission('read', 'experience'), async (req, res) => {
  console.log('experienceRoutes: GET /:id/votes endpoint hit');
  try {
    const votes = await VoteService.getVotesForExperience(req.params.id);
    res.status(200).json({
      success: true,
      data: votes
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:id/votes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/experiences/:id/votes
 * @desc Vote on an experience
 * @access Private (authenticated users can vote)
 */
router.post('/:id/votes', requireDataPermission('create', 'vote'), async (req, res) => {
  console.log('experienceRoutes: POST /:id/votes endpoint hit');
  try {
    const vote = await VoteService.vote(req.params.id, req.user.userId, req.body.voteType);
    res.status(201).json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error('experienceRoutes: Error in POST /:id/votes:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

console.log('experienceRoutes.js: Routes defined successfully');

module.exports = router;