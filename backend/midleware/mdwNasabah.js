const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: decodeToken.email,
      userId: decodeToken.userId
    };
    next();
  } catch (e) {
    res.status(401).json({
      responseCode: '11',
      responseDesc: 'Invalid!',
      message: 'You are not authenticated!'
    })
  }
}
