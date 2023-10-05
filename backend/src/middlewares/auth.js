const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const Permission = require('../models/permission.model');
require('dotenv').config(); // load .env

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header not found' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const user = await UserService.model.findOne({
      where: { id: decoded.id },
      attributes: {
        exclude: ['password'],
      },
      include: [{ model: Permission }],
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authorization header not found' });
    }
    if (!roles.includes(user.Permission.type)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  };
};

module.exports = { verifyToken, authorize };
