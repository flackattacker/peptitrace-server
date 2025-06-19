const Peptide = require('../models/Peptide');
const Effect = require('../models/Effect');
const peptideSeedData = require('../data/peptideSeedData');

class SeedService {
  /**
   * Seeds the database with initial peptide data
   * @returns {Promise<Object>} Result of seeding operation
   */
  static async seedPeptides() {
    try {
      console.log('Starting peptide seeding...');
      
      // Clear existing peptides
      await Peptide.deleteMany({});
      console.log('Cleared existing peptides');

      // Insert new peptides
      const peptides = await Peptide.insertMany(peptideSeedData);
      console.log(`Successfully seeded ${peptides.length} peptides`);
      
      return peptides;
    } catch (error) {
      console.error('Error seeding peptides:', error);
      throw new Error(`Failed to seed peptides: ${error.message}`);
    }
  }

  /**
   * Clears all peptide data from the database
   * @returns {Promise<Object>} Result of clearing operation
   */
  static async clearPeptides() {
    try {
      const result = await Peptide.deleteMany({});
      return {
        success: true,
        message: 'All peptides cleared successfully',
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('Error clearing peptides:', error);
      throw new Error(`Failed to clear peptides: ${error.message}`);
    }
  }

  /**
   * Seeds the database with initial effects and side effects data
   * @returns {Promise<Object>} Result of seeding operation
   */
  static async seedEffects() {
    try {
      console.log('Starting effects seeding...');
      
      // Clear existing effects
      await Effect.deleteMany({});
      console.log('Cleared existing effects');

      // Extract unique effects from peptides
      const allEffects = new Set();
      peptideSeedData.forEach(peptide => {
        if (peptide.commonEffects && Array.isArray(peptide.commonEffects)) {
          peptide.commonEffects.forEach(effect => allEffects.add(effect));
        }
        if (peptide.sideEffects && Array.isArray(peptide.sideEffects)) {
          peptide.sideEffects.forEach(effect => allEffects.add(effect));
        }
      });

      // Create effect documents
      const effects = await Effect.insertMany(
        Array.from(allEffects).map(effect => ({
          name: effect,
          description: `Effect related to ${effect}`,
          type: effect.toLowerCase().includes('side') ? 'negative' : 'positive',
          category: effect.toLowerCase().includes('side') ? 'Side Effect' : 'Physical Performance',
          frequency: 'common',
          isCommon: true
        }))
      );

      console.log(`Successfully seeded ${effects.length} effects`);
      return effects;
    } catch (error) {
      console.error('Error seeding effects:', error);
      throw new Error(`Failed to seed effects: ${error.message}`);
    }
  }

  /**
   * Clears all effects data from the database
   * @returns {Promise<Object>} Result of clearing operation
   */
  static async clearEffects() {
    try {
      const result = await Effect.deleteMany({});
      return {
        success: true,
        message: 'All effects cleared successfully',
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('Error clearing effects:', error);
      throw new Error(`Failed to clear effects: ${error.message}`);
    }
  }
}

module.exports = SeedService;