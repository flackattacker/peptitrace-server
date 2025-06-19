const Experience = require('../models/Experience');
const Peptide = require('../models/Peptide');
const mongoose = require('mongoose');

class AnalyticsService {
  static async getUsageAnalytics() {
    try {
      console.log('AnalyticsService.getUsageAnalytics called');
      
      // Get real data
      const totalExperiences = await Experience.countDocuments();
      const totalPeptides = await Peptide.countDocuments();
      
      // Calculate average rating from all experiences
      const experiences = await Experience.find({});
      let totalRating = 0;
      let ratedExperiences = 0;
      
      experiences.forEach(exp => {
        if (exp.outcomes && exp.outcomes instanceof Map && exp.outcomes.size > 0) {
          const values = Array.from(exp.outcomes.values());
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          totalRating += avg;
          ratedExperiences++;
        }
      });
      
      const averageRating = ratedExperiences > 0 ? totalRating / ratedExperiences : 0;
      
      // Get top peptides by experience count
      const topPeptides = await Experience.aggregate([
        { $group: { _id: '$peptideName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      const topPeptidesCount = topPeptides.length;
      
      // Get active users (users who have submitted experiences in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUsers = await Experience.distinct('userId', {
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      const activeUsersCount = activeUsers.length;
      
      const realData = {
        totalExperiences,
        totalPeptides,
        averageRating,
        topPeptidesCount,
        activeUsersCount
      };
      
      console.log('AnalyticsService.getUsageAnalytics - Real data calculated:', realData);
      console.log('AnalyticsService.getUsageAnalytics completed successfully with real data');
      
      return realData;
    } catch (error) {
      console.error('AnalyticsService.getUsageAnalytics error:', error);
      throw error;
    }
  }

  static async getAnalytics() {
    try {
      console.log('AnalyticsService.getAnalytics called');

      const totalExperiences = await Experience.countDocuments({ isActive: true });
      const totalPeptides = await Peptide.countDocuments();

      // Calculate average rating across all outcomes
      const avgRatings = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            avgEnergy: { $avg: '$outcomes.energy' },
            avgSleep: { $avg: '$outcomes.sleep' },
            avgMood: { $avg: '$outcomes.mood' },
            avgPerformance: { $avg: '$outcomes.performance' },
            avgRecovery: { $avg: '$outcomes.recovery' }
          }
        }
      ]);

      const averageRating = avgRatings.length > 0
        ? ((avgRatings[0].avgEnergy + avgRatings[0].avgSleep + avgRatings[0].avgMood +
            avgRatings[0].avgPerformance + avgRatings[0].avgRecovery) / 5).toFixed(1)
        : 0;

      // Get top peptides with ratings
      const topPeptides = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$peptideName',
            experiences: { $sum: 1 },
            avgRating: {
              $avg: {
                $divide: [
                  {
                    $add: [
                      '$outcomes.energy',
                      '$outcomes.sleep',
                      '$outcomes.mood',
                      '$outcomes.performance',
                      '$outcomes.recovery'
                    ]
                  },
                  5
                ]
              }
            }
          }
        },
        { $sort: { experiences: -1 } },
        { $limit: 10 },
        {
          $project: {
            name: '$_id',
            experiences: 1,
            rating: { 
              $cond: [
                { $eq: ['$avgRating', null] },
                0,
                { $round: ['$avgRating', 1] }
              ]
            },
            _id: 0
          }
        }
      ]);

      // Get effectiveness data
      const effectivenessData = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$peptideName',
            effectiveness: {
              $avg: {
                $divide: [
                  { $sum: { $objectToArray: '$outcomes' } },
                  { $size: { $objectToArray: '$outcomes' } }
                ]
              }
            },
            sampleSize: { $sum: 1 }
          }
        },
        { $sort: { sampleSize: -1 } },
        { $limit: 15 },
        {
          $project: {
            peptide: '$_id',
            effectiveness: { $round: ['$effectiveness', 1] },
            sampleSize: 1,
            _id: 0
          }
        }
      ]);

      // Get usage trends by month
      const usageTrends = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            experiences: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
        {
          $project: {
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                {
                  $cond: {
                    if: { $lt: ['$_id.month', 10] },
                    then: { $concat: ['0', { $toString: '$_id.month' }] },
                    else: { $toString: '$_id.month' }
                  }
                }
              ]
            },
            experiences: 1,
            _id: 0
          }
        }
      ]);

      // Get outcome distribution
      const outcomeDistribution = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            outcomes: {
              $push: { $objectToArray: '$outcomes' }
            }
          }
        },
        {
          $project: {
            _id: 0,
            outcomes: {
              $reduce: {
                input: '$outcomes',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: {
                        $map: {
                          input: '$$this',
                          as: 'outcome',
                          in: {
                            k: '$$outcome.k',
                            v: { $avg: '$$outcome.v' }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);

      // Get peptide frequency
      const peptideFrequency = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$peptideName',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 },
        {
          $project: {
            name: '$_id',
            value: '$count',
            _id: 0
          }
        }
      ]);

      console.log('AnalyticsService.getAnalytics completed successfully');

      return {
        totalExperiences,
        totalPeptides,
        averageRating: parseFloat(averageRating),
        topPeptides,
        effectivenessData,
        usageTrends,
        outcomeDistribution: outcomeDistribution[0]?.outcomes || {},
        peptideFrequency
      };
    } catch (error) {
      console.error('AnalyticsService.getAnalytics error:', error);
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  static async getPeptideEffectiveness() {
    try {
      console.log('AnalyticsService.getPeptideEffectiveness called');
      
      // Get real effectiveness data from experiences
      const effectiveness = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$peptideName',
            totalExperiences: { $sum: 1 },
            outcomes: {
              $push: { $objectToArray: '$outcomes' }
            }
          }
        },
        {
          $project: {
            peptide: '$_id',
            experiences: '$totalExperiences',
            effectiveness: {
              $reduce: {
                input: '$outcomes',
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: {
                        $map: {
                          input: '$$this',
                          as: 'outcome',
                          in: {
                            k: '$$outcome.k',
                            v: { $avg: '$$outcome.v' }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);
      
      console.log('AnalyticsService.getPeptideEffectiveness completed with real data, count:', effectiveness.length);
      return effectiveness;
    } catch (error) {
      console.error('AnalyticsService.getPeptideEffectiveness error:', error.message);
      throw new Error(`Failed to get peptide effectiveness: ${error.message}`);
    }
  }

  static async getPeptideTrends(period = 'monthly', limit = 12) {
    try {
      console.log('AnalyticsService.getPeptideTrends called');

      let groupByFormat;
      let dateFormat;

      // Determine grouping format based on period
      switch (period) {
        case 'daily':
          groupByFormat = '%Y-%m-%d';
          dateFormat = 'YYYY-MM-DD';
          break;
        case 'weekly':
          groupByFormat = '%Y-%U'; // Year-Week
          dateFormat = 'YYYY-[W]WW';
          break;
        case 'monthly':
        default:
          groupByFormat = '%Y-%m';
          dateFormat = 'YYYY-MM';
          break;
      }

      // Get experience trends over time
      const experienceTrends = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: {
              period: { $dateToString: { format: groupByFormat, date: '$createdAt' } },
              peptideId: '$peptideId',
              peptideName: '$peptideName'
            },
            count: { $sum: 1 },
            avgRating: { $avg: '$outcomes.recovery' }, // Using recovery as main effectiveness metric
            date: { $first: '$createdAt' }
          }
        },
        {
          $sort: { 'date': -1 }
        },
        {
          $limit: limit * 50 // Get more data to ensure we have enough for analysis
        }
      ]);

      // Group by time period and calculate totals
      const periodData = {};
      const peptideGrowth = {};

      experienceTrends.forEach(item => {
        const period = item._id.period;
        const peptideId = item._id.peptideId;
        const peptideName = item._id.peptideName;

        // Initialize period if not exists
        if (!periodData[period]) {
          periodData[period] = {
            period,
            totalExperiences: 0,
            peptides: {},
            date: item.date
          };
        }

        // Add to period totals
        periodData[period].totalExperiences += item.count;

        // Track peptide-specific data
        if (!periodData[period].peptides[peptideId]) {
          periodData[period].peptides[peptideId] = {
            peptideId,
            name: peptideName,
            experiences: 0,
            avgRating: 0
          };
        }

        periodData[period].peptides[peptideId].experiences += item.count;
        periodData[period].peptides[peptideId].avgRating = item.avgRating;

        // Track for growth calculation
        if (!peptideGrowth[peptideId]) {
          peptideGrowth[peptideId] = {
            name: peptideName,
            periods: []
          };
        }
        peptideGrowth[peptideId].periods.push({
          period,
          count: item.count,
          date: item.date
        });
      });

      // Convert to array and sort by date
      const trendsArray = Object.values(periodData)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);

      // Calculate growth rates for top peptides
      const calculateGrowthRate = (currentCount, previousCount) => {
        if (previousCount === 0) return currentCount > 0 ? 100 : 0;
        return Math.round(((currentCount - previousCount) / previousCount) * 100);
      };

      // Process trends and add top peptides for each period
      const processedTrends = trendsArray.map((periodItem, index) => {
        // Get top 5 peptides for this period
        const topPeptides = Object.values(periodItem.peptides)
          .sort((a, b) => b.experiences - a.experiences)
          .slice(0, 5)
          .map(peptide => ({
            peptideId: peptide.peptideId,
            name: peptide.name,
            experiences: peptide.experiences,
            avgRating: Math.round(peptide.avgRating * 100) / 100,
            growthRate: 0 // Will be calculated below
          }));

        // Calculate growth rates by comparing with previous period
        if (index < trendsArray.length - 1) {
          const previousPeriod = trendsArray[index + 1];
          topPeptides.forEach(peptide => {
            const previousData = previousPeriod.peptides[peptide.peptideId];
            const previousCount = previousData ? previousData.experiences : 0;
            peptide.growthRate = calculateGrowthRate(peptide.experiences, previousCount);
          });
        }

        return {
          period: periodItem.period,
          totalExperiences: periodItem.totalExperiences,
          topPeptides,
          growthRate: index < trendsArray.length - 1
            ? calculateGrowthRate(periodItem.totalExperiences, trendsArray[index + 1].totalExperiences)
            : 0
        };
      });

      // Calculate overall statistics
      const totalExperiences = processedTrends.reduce((sum, p) => sum + p.totalExperiences, 0);
      const avgExperiencesPerPeriod = processedTrends.length > 0
        ? Math.round(totalExperiences / processedTrends.length)
        : 0;

      // Find fastest growing peptides across all periods
      const growthAnalysis = {};
      Object.values(peptideGrowth).forEach(peptide => {
        if (peptide.periods.length >= 2) {
          const sortedPeriods = peptide.periods.sort((a, b) => new Date(a.date) - new Date(b.date));
          const firstPeriod = sortedPeriods[0];
          const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
          const overallGrowth = calculateGrowthRate(lastPeriod.count, firstPeriod.count);

          growthAnalysis[peptide.name] = {
            name: peptide.name,
            overallGrowth,
            totalExperiences: peptide.periods.reduce((sum, p) => sum + p.count, 0)
          };
        }
      });

      const fastestGrowing = Object.values(growthAnalysis)
        .sort((a, b) => b.overallGrowth - a.overallGrowth)
        .slice(0, 5);

      console.log('AnalyticsService.getPeptideTrends completed successfully');

      return {
        summary: {
          period,
          totalPeriods: processedTrends.length,
          totalExperiences,
          avgExperiencesPerPeriod
        },
        trends: processedTrends.reverse(), // Reverse to show oldest to newest
        fastestGrowing,
        analysis: {
          periodWithMostActivity: processedTrends.reduce((max, current) =>
            current.totalExperiences > max.totalExperiences ? current : max,
            processedTrends[0] || {}
          )
        }
      };
    } catch (error) {
      console.error('AnalyticsService.getPeptideTrends error:', error);
      throw new Error(`Failed to get peptide trends: ${error.message}`);
    }
  }

  static async comparePeptides(peptideIds) {
    try {
      console.log('AnalyticsService.comparePeptides called with:', peptideIds);

      const peptides = await Peptide.find({
        _id: { $in: peptideIds }
      });

      if (peptides.length === 0) {
        throw new Error('No peptides found with the provided IDs');
      }

      // Get experience data for each peptide
      const comparisonData = await Promise.all(
        peptides.map(async (peptide) => {
          const experiences = await Experience.find({ 
            peptideId: peptide._id,
            isActive: true
          });

          // Calculate average outcomes
          const outcomeAverages = experiences.length > 0 ? {
            energy: experiences.reduce((sum, exp) => sum + exp.outcomes.energy, 0) / experiences.length,
            sleep: experiences.reduce((sum, exp) => sum + exp.outcomes.sleep, 0) / experiences.length,
            mood: experiences.reduce((sum, exp) => sum + exp.outcomes.mood, 0) / experiences.length,
            performance: experiences.reduce((sum, exp) => sum + exp.outcomes.performance, 0) / experiences.length,
            recovery: experiences.reduce((sum, exp) => sum + exp.outcomes.recovery, 0) / experiences.length,
            sideEffects: experiences.reduce((sum, exp) => sum + exp.outcomes.sideEffects, 0) / experiences.length
          } : {
            energy: 0, sleep: 0, mood: 0, performance: 0, recovery: 0, sideEffects: 0
          };

          return {
            _id: peptide._id,
            name: peptide.name,
            category: peptide.category,
            totalExperiences: experiences.length,
            averageRating: peptide.averageRating,
            outcomes: outcomeAverages
          };
        })
      );

      console.log('AnalyticsService.comparePeptides completed successfully');

      return comparisonData;
    } catch (error) {
      console.error('AnalyticsService.comparePeptides error:', error);
      throw new Error(`Failed to compare peptides: ${error.message}`);
    }
  }

  static async getPeptideComparison(peptideIds) {
    try {
      console.log('AnalyticsService.getPeptideComparison called with peptideIds:', peptideIds);

      if (!peptideIds || peptideIds.length === 0) {
        return [];
      }

      // Get peptide names first
      const peptides = await Peptide.find({ _id: { $in: peptideIds } }).select('_id name');
      const peptideMap = {};
      peptides.forEach(p => {
        peptideMap[p._id.toString()] = p.name;
      });

      // Get real comparison data
      const comparison = await Experience.aggregate([
        { 
          $match: { 
            isActive: true,
            peptideId: { $in: peptideIds.map(id => new mongoose.Types.ObjectId(id)) }
          }
        },
        {
          $group: {
            _id: '$peptideId',
            totalExperiences: { $sum: 1 },
            avgEnergy: { $avg: '$outcomes.energy' },
            avgSleep: { $avg: '$outcomes.sleep' },
            avgMood: { $avg: '$outcomes.mood' },
            avgPerformance: { $avg: '$outcomes.performance' },
            avgRecovery: { $avg: '$outcomes.recovery' },
            avgSideEffects: { $avg: '$outcomes.sideEffects' }
          }
        },
        {
          $project: {
            peptideId: '$_id',
            peptideName: { $literal: 'Unknown' }, // Will be replaced
            experiences: '$totalExperiences',
            outcomes: {
              energy: { $round: ['$avgEnergy', 1] },
              sleep: { $round: ['$avgSleep', 1] },
              mood: { $round: ['$avgMood', 1] },
              performance: { $round: ['$avgPerformance', 1] },
              recovery: { $round: ['$avgRecovery', 1] },
              sideEffects: { $round: ['$avgSideEffects', 1] }
            }
          }
        }
      ]);

      // Add peptide names
      comparison.forEach(item => {
        item.peptideName = peptideMap[item.peptideId.toString()] || 'Unknown';
      });

      console.log('AnalyticsService.getPeptideComparison completed with real data, count:', comparison.length);
      return comparison;
    } catch (error) {
      console.error('AnalyticsService.getPeptideComparison error:', error.message);
      throw new Error(`Failed to compare peptides: ${error.message}`);
    }
  }

  static async getTrends() {
    try {
      console.log('AnalyticsService.getTrends called');

      // Get real trends data from experiences over time
      const trends = await Experience.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: {
              peptide: '$peptideName',
              month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.month': 1 } },
        {
          $group: {
            _id: '$_id.peptide',
            monthlyData: {
              $push: {
                month: '$_id.month',
                count: '$count'
              }
            }
          }
        },
        {
          $project: {
            peptide: '$_id',
            data: '$monthlyData'
          }
        }
      ]);

      console.log('AnalyticsService.getTrends completed with real data, count:', trends.length);
      return trends;
    } catch (error) {
      console.error('AnalyticsService.getTrends error:', error.message);
      throw new Error(`Failed to get trends: ${error.message}`);
    }
  }
}

module.exports = AnalyticsService;