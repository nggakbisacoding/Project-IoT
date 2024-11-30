require('dotenv').config();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const validateUser = 
[
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ];

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No Token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  validateUser,
  authenticateUser
};