const axios = require('axios');

class CaptchaService {
  static async verifyToken(token) {
    try {
      console.log('CaptchaService.verifyToken called with token:', token);
      
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: token
          }
        }
      );
      
      console.log('CaptchaService.verifyToken response:', response.data);
      
      // Return true if score is 0.5 or higher (Google's recommended threshold)
      return response.data.success && response.data.score >= 0.5;
    } catch (error) {
      console.error('CaptchaService.verifyToken error:', error);
      return false;
    }
  }
}

module.exports = CaptchaService; 