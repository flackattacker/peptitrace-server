require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function resetModeratorPassword() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    const email = 'jonflack@gmail.com';
    const newPassword = 'maynard';

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.role = 'moderator';
    user.status = 'approved';
    await user.save();

    console.log('Moderator password reset successfully for:', email);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting moderator password:', error);
    process.exit(1);
  }
}

resetModeratorPassword(); 