const Peptide = require('../models/Peptide');
const Experience = require('../models/Experience');

class PeptideService {
  static async getAll() {
    try {
      console.log('PeptideService.getAll called');
      
      // Get all peptides
      const peptides = await Peptide.find({});
      
      // Get experience counts, average ratings, and recency for each peptide
      const peptideStats = await Experience.aggregate([
        {
          $group: {
            _id: '$peptideName',
            totalExperiences: { $sum: 1 },
            // Calculate average of all outcome values for each experience
            averageRating: {
              $avg: {
                $avg: {
                  $map: {
                    input: { $objectToArray: '$outcomes' },
                    as: 'outcome',
                    in: '$$outcome.v'
                  }
                }
              }
            },
            // Get the most recent experience date
            lastExperienceDate: { $max: '$createdAt' }
          }
        }
      ]);
      
      // Create a map of peptide stats for easy lookup
      const statsMap = new Map(
        peptideStats.map(stat => [stat._id, {
          totalExperiences: stat.totalExperiences,
          averageRating: stat.averageRating || 0,
          lastExperienceDate: stat.lastExperienceDate
        }])
      );
      
      // Calculate popularity score for each peptide
      const now = new Date();
      const peptidesWithStats = peptides.map(peptide => {
        const stats = statsMap.get(peptide.name) || { 
          totalExperiences: 0, 
          averageRating: 0,
          lastExperienceDate: null
        };
        
        // Calculate popularity score based on:
        // 1. Number of experiences (weight: 0.4)
        // 2. Average rating (weight: 0.4)
        // 3. Recency of experiences (weight: 0.2)
        const experienceScore = Math.min(stats.totalExperiences / 10, 1) * 0.4; // Cap at 10 experiences
        const ratingScore = (stats.averageRating / 10) * 0.4; // Assuming 10 is max rating
        const recencyScore = stats.lastExperienceDate 
          ? Math.max(0, 1 - (now - new Date(stats.lastExperienceDate)) / (30 * 24 * 60 * 60 * 1000)) * 0.2 // 30 days decay
          : 0;
        
        const popularityScore = Math.round((experienceScore + ratingScore + recencyScore) * 100);
        
        return {
          ...peptide.toObject(),
          _id: peptide._id.toString(),
          totalExperiences: stats.totalExperiences,
          averageRating: stats.averageRating,
          popularity: popularityScore
        };
      });
      
      console.log('PeptideService.getAll completed successfully with real data, count:', peptidesWithStats.length);
      console.log('PeptideService.getAll peptide stats:', peptidesWithStats.map(p => ({
        name: p.name,
        totalExperiences: p.totalExperiences,
        averageRating: p.averageRating,
        popularity: p.popularity
      })));
      
      return peptidesWithStats;
    } catch (error) {
      console.error('PeptideService.getAll error:', error);
      throw error;
    }
  }

  static async getById(peptideId) {
    try {
      console.log('PeptideService.getById called with id:', peptideId);

      const peptide = await Peptide.findById(peptideId);
      if (!peptide) {
        throw new Error('Peptide not found');
      }

      // Get real stats for this peptide
      const stats = await Experience.aggregate([
        { 
          $match: { 
            peptideId: peptide._id,
            isActive: true 
          }
        },
        {
          $group: {
            _id: null,
            totalExperiences: { $sum: 1 },
            averageRating: {
              $avg: {
                $avg: [
                  '$outcomes.energy',
                  '$outcomes.sleep',
                  '$outcomes.mood',
                  '$outcomes.performance',
                  '$outcomes.recovery'
                ]
              }
            }
          }
        }
      ]);

      const peptideStats = stats.length > 0 ? {
        totalExperiences: stats[0].totalExperiences,
        averageRating: Math.round(stats[0].averageRating * 10) / 10
      } : {
        totalExperiences: 0,
        averageRating: 0
      };

      const result = {
        ...peptide.toObject(),
        _id: peptide._id.toString(),
        ...peptideStats
      };

      console.log('PeptideService.getById completed successfully with real data');
      return result;
    } catch (error) {
      console.error('PeptideService.getById error:', error.message);
      throw new Error(`Failed to retrieve peptide: ${error.message}`);
    }
  }

  static async create(peptideData) {
    try {
      console.log('PeptideService.create called with data:', peptideData);

      const peptide = new Peptide(peptideData);
      const savedPeptide = await peptide.save();

      console.log('Peptide created successfully:', savedPeptide._id);
      return savedPeptide;
    } catch (error) {
      console.error('PeptideService.create error:', error.message);
      throw new Error(`Failed to create peptide: ${error.message}`);
    }
  }

  static async update(peptideId, updateData) {
    try {
      console.log('PeptideService.update called with id:', peptideId);

      const updatedPeptide = await Peptide.findByIdAndUpdate(
        peptideId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedPeptide) {
        throw new Error('Peptide not found');
      }

      console.log('Peptide updated successfully:', updatedPeptide._id);
      return updatedPeptide;
    } catch (error) {
      console.error('PeptideService.update error:', error.message);
      throw new Error(`Failed to update peptide: ${error.message}`);
    }
  }

  static async deleteById(peptideId) {
    try {
      console.log('PeptideService.deleteById called with id:', peptideId);

      const deletedPeptide = await Peptide.findByIdAndDelete(peptideId);
      if (!deletedPeptide) {
        throw new Error('Peptide not found');
      }

      console.log('Peptide deleted successfully:', peptideId);
      return { success: true };
    } catch (error) {
      console.error('PeptideService.deleteById error:', error.message);
      throw new Error(`Failed to delete peptide: ${error.message}`);
    }
  }

  static async search(query) {
    try {
      console.log('PeptideService.search called with query:', query);

      const searchRegex = new RegExp(query, 'i');
      const peptides = await Peptide.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { peptide_sequence: searchRegex }
        ]
      }).sort({ name: 1 });

      console.log('PeptideService.search completed, found:', peptides.length);
      return peptides;
    } catch (error) {
      console.error('PeptideService.search error:', error.message);
      throw new Error(`Failed to search peptides: ${error.message}`);
    }
  }
}

module.exports = PeptideService;