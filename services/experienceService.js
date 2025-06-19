const Experience = require('../models/Experience');
const Peptide = require('../models/Peptide');
const { randomUUID } = require('crypto');

class ExperienceService {
  static async create(userId, experienceData) {
    try {
      console.log('ExperienceService.create called with userId:', userId);
      console.log('Experience data:', JSON.stringify(experienceData, null, 2));

      // Validate peptide exists
      const peptide = await Peptide.findById(experienceData.peptideId);
      if (!peptide) {
        throw new Error('Peptide not found');
      }

      // Generate a tracking ID - use full UUID without hyphens for consistency
      const uuid = randomUUID().replace(/-/g, '');
      const trackingId = 'TRK-' + uuid.substring(0, 12);
      console.log('ExperienceService.create: Generated tracking ID:', trackingId);

      // Create experience with user ID, peptide name, and tracking ID
      const experience = new Experience({
        ...experienceData,
        userId,
        peptideName: peptide.name,
        trackingId
      });

      const savedExperience = await experience.save();
      console.log('Experience created successfully:', savedExperience._id);
      console.log('Experience saved with tracking ID:', savedExperience.trackingId);

      return {
        success: true,
        experienceId: savedExperience._id,
        trackingId: trackingId
      };
    } catch (error) {
      console.error('ExperienceService.create error:', error.message);
      throw new Error(`Failed to create experience: ${error.message}`);
    }
  }

  static async getByTrackingId(trackingId) {
    try {
      console.log('ExperienceService.getByTrackingId called with:', trackingId);

      if (!trackingId || typeof trackingId !== 'string') {
        throw new Error('Invalid tracking ID format');
      }

      // Add more detailed logging to debug the search
      console.log('ExperienceService.getByTrackingId: Searching for exact tracking ID:', trackingId);
      
      // First, let's see what tracking IDs exist in the database
      const allExperiences = await Experience.find({ isActive: true }).select('trackingId').exec();
      console.log('ExperienceService.getByTrackingId: All existing tracking IDs:', allExperiences.map(e => e.trackingId));

      const experience = await Experience.findOne({
        trackingId,
        isActive: true
      })
        .populate('peptideId', 'name category')
        .exec();

      if (!experience) {
        console.log('ExperienceService.getByTrackingId: No experience found with tracking ID:', trackingId);
        console.log('ExperienceService.getByTrackingId: Available tracking IDs for comparison:', allExperiences.map(e => e.trackingId));
        throw new Error('Experience not found with this tracking ID');
      }

      console.log('Experience found by tracking ID:', experience._id);
      return experience;
    } catch (error) {
      console.error('ExperienceService.getByTrackingId error:', error.message);
      throw new Error(`Failed to retrieve experience: ${error.message}`);
    }
  }

  static async getByPeptideId(peptideId, filters = {}) {
    try {
      console.log('ExperienceService.getByPeptideId called with peptideId:', peptideId);

      const query = {
        peptideId,
        isActive: true
      };

      const { limit = 50, offset = 0 } = filters;

      const experiences = await Experience.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .populate('peptideId', 'name')
        .exec();

      const total = await Experience.countDocuments(query);

      console.log(`Found ${experiences.length} experiences for peptide ${peptideId}`);

      return {
        experiences,
        total
      };
    } catch (error) {
      console.error('ExperienceService.getByPeptideId error:', error.message);
      throw new Error(`Failed to retrieve experiences: ${error.message}`);
    }
  }

  static async getAll(filters = {}) {
    try {
      console.log('ExperienceService.getAll called with filters:', filters);

      const query = { isActive: true };

      if (filters.peptideId) {
        query.peptideId = filters.peptideId;
      }

      const { limit = 50, offset = 0 } = filters;

      const experiences = await Experience.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .populate('peptideId', 'name')
        .exec();

      const total = await Experience.countDocuments(query);

      console.log(`Found ${experiences.length} total experiences`);

      return {
        experiences,
        total
      };
    } catch (error) {
      console.error('ExperienceService.getAll error:', error.message);
      throw new Error(`Failed to retrieve experiences: ${error.message}`);
    }
  }

  static async getById(experienceId) {
    try {
      console.log('ExperienceService.getById called with id:', experienceId);

      const experience = await Experience.findById(experienceId)
        .populate('peptideId', 'name')
        .exec();

      if (!experience) {
        throw new Error('Experience not found');
      }

      console.log('Experience found:', experience._id);
      return experience;
    } catch (error) {
      console.error('ExperienceService.getById error:', error.message);
      throw new Error(`Failed to retrieve experience: ${error.message}`);
    }
  }

  static async updateVotes(experienceId, voteType) {
    try {
      console.log('ExperienceService.updateVotes called with:', experienceId, voteType);

      // Use findByIdAndUpdate to avoid validation issues
      const updateFields = {
        $inc: {
          totalVotes: 1,
          ...(voteType === 'helpful' && { helpfulVotes: 1 })
        }
      };

      const updatedExperience = await Experience.findByIdAndUpdate(
        experienceId,
        updateFields,
        { new: true, runValidators: false } // Skip validation to avoid trackingId requirement
      );

      if (!updatedExperience) {
        throw new Error('Experience not found');
      }

      console.log('Experience votes updated successfully');

      return {
        success: true,
        helpfulVotes: updatedExperience.helpfulVotes,
        totalVotes: updatedExperience.totalVotes
      };
    } catch (error) {
      console.error('ExperienceService.updateVotes error:', error.message);
      throw new Error(`Failed to update votes: ${error.message}`);
    }
  }

  static async deleteById(experienceId, userId) {
    try {
      console.log('ExperienceService.deleteById called with:', experienceId, userId);

      const experience = await Experience.findById(experienceId);
      if (!experience) {
        throw new Error('Experience not found');
      }

      // Check if user owns this experience
      if (experience.userId.toString() !== userId.toString()) {
        throw new Error('Unauthorized to delete this experience');
      }

      // Soft delete by setting isActive to false
      experience.isActive = false;
      await experience.save();

      console.log('Experience soft deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('ExperienceService.deleteById error:', error.message);
      throw new Error(`Failed to delete experience: ${error.message}`);
    }
  }
}

module.exports = ExperienceService;