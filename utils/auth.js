const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  try {
    console.log('generateAccessToken called with user:', typeof user === 'object' ? user._id || user.userId : user);
    console.log('JWT_ACCESS_SECRET exists:', !!process.env.JWT_ACCESS_SECRET);
    console.log('JWT_ACCESS_SECRET value (first 10 chars):', process.env.JWT_ACCESS_SECRET ? process.env.JWT_ACCESS_SECRET.substring(0, 10) + '...' : 'UNDEFINED');
    
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET environment variable is not set');
    }

    const payload = {
      userId: typeof user === 'object' ? user._id : user,
      email: typeof user === 'object' ? user.email : null
    };

    console.log('Token payload:', payload);

    const token = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Access token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating access token:', error);
    return null;
  }
};

const generateRefreshToken = (user) => {
  try {
    console.log('generateRefreshToken called with user:', typeof user === 'object' ? user._id || user.userId : user);
    console.log('JWT_REFRESH_SECRET exists:', !!process.env.JWT_REFRESH_SECRET);
    
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }

    const payload = {
      userId: typeof user === 'object' ? user._id : user,
      email: typeof user === 'object' ? user.email : null
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Refresh token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};