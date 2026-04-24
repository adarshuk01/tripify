const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name too long'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateTrip = [
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('numberOfPeople').isInt({ min: 1 }).withMessage('Number of people must be at least 1'),
  body('travelMode').isIn(['Car', 'Bike', 'Bus', 'Train', 'Flight']).withMessage('Invalid travel mode'),
  body('budget').isIn(['Low', 'Medium', 'Luxury']).withMessage('Invalid budget'),
  body('duration').isInt({ min: 1, max: 30 }).withMessage('Duration must be between 1-30 days'),
  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateTrip };
