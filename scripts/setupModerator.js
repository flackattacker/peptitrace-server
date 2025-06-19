require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function setupModerator() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Check if moderator already exists
    const existingModerator = await User.findOne({ role: 'moderator' });
    if (existingModerator) {
      console.log('Moderator already exists:', existingModerator.email);
      process.exit(0);
    }

    // Get moderator details from environment variables
    const email = process.env.INITIAL_MODERATOR_EMAIL;
    const password = process.env.INITIAL_MODERATOR_PASSWORD;

    if (!email || !password) {
      console.error('Error: INITIAL_MODERATOR_EMAIL and INITIAL_MODERATOR_PASSWORD must be set in .env');
      process.exit(1);
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Update existing user to moderator
      existingUser.role = 'moderator';
      existingUser.status = 'approved';
      await existingUser.save();
      console.log('Updated existing user to moderator:', email);
    } else {
      // Create new moderator
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const moderator = new User({
        email,
        password: hashedPassword,
        username: email.split('@')[0] + '_mod',
        role: 'moderator',
        status: 'approved'
      });

      await moderator.save();
      console.log('Created new moderator:', email);
    }

    console.log('Moderator setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up moderator:', error);
    process.exit(1);
  }
}

setupModerator(); 