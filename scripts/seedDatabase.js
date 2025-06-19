const mongoose = require('mongoose');
const SeedService = require('../services/seedService');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Seed peptides
    await SeedService.seedPeptides();
    console.log('Peptides seeded successfully');

    // Seed effects
    await SeedService.seedEffects();
    console.log('Effects seeded successfully');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 