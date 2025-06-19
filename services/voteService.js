const Vote = require('../models/Vote');
const Experience = require('../models/Experience');

class VoteService {
  static async submitVote(userId, experienceId, voteType) {
    try {
      console.log('VoteService.submitVote called with:', {
        userId,
        experienceId,
        voteType
      });

      // Validate voteType - map frontend values to backend enum values
      let mappedVoteType = voteType;
      if (voteType === 'not-helpful') {
        mappedVoteType = 'not-helpful'; // Keep as is since it should be valid
      }

      // Check if vote already exists
      const existingVote = await Vote.findOne({
        userId,
        experienceId
      });

      if (existingVote) {
        console.log('Updating existing vote from', existingVote.voteType, 'to', mappedVoteType);
        
        // Update existing vote
        existingVote.voteType = mappedVoteType;
        existingVote.updatedAt = new Date();
        
        const updatedVote = await existingVote.save();
        console.log('Vote updated successfully:', updatedVote._id);
        
        return {
          success: true,
          voteId: updatedVote._id,
          voteType: mappedVoteType,
          action: 'updated'
        };
      } else {
        console.log('Creating new vote');
        
        // Create new vote
        const newVote = new Vote({
          userId,
          experienceId,
          voteType: mappedVoteType
        });

        const savedVote = await newVote.save();
        console.log('Vote submitted successfully:', savedVote._id);

        return {
          success: true,
          voteId: savedVote._id,
          voteType: mappedVoteType,
          action: 'created'
        };
      }
    } catch (error) {
      console.error('VoteService.submitVote error:', error.message);
      throw new Error(`Failed to submit vote: ${error.message}`);
    }
  }

  static async getUserVote(userId, experienceId) {
    try {
      console.log('VoteService.getUserVote called with:', {
        userId,
        experienceId
      });

      const vote = await Vote.findOne({
        userId,
        experienceId
      });

      if (vote) {
        console.log('Vote found:', vote.voteType);
        return {
          success: true,
          voteType: vote.voteType
        };
      } else {
        console.log('No vote found');
        return {
          success: true,
          voteType: null
        };
      }
    } catch (error) {
      console.error('VoteService.getUserVote error:', error.message);
      throw new Error(`Failed to get user vote: ${error.message}`);
    }
  }

  static async deleteVote(userId, experienceId) {
    try {
      console.log('VoteService.deleteVote called with:', {
        userId,
        experienceId
      });

      const deletedVote = await Vote.findOneAndDelete({
        userId,
        experienceId
      });

      if (!deletedVote) {
        throw new Error('Vote not found');
      }

      console.log('Vote deleted successfully');
      return {
        success: true,
        voteType: deletedVote.voteType
      };
    } catch (error) {
      console.error('VoteService.deleteVote error:', error.message);
      throw new Error(`Failed to delete vote: ${error.message}`);
    }
  }
}

module.exports = VoteService;