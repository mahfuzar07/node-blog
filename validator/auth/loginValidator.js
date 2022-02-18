const { body } = require('express-validator');

module.exports = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email Can Not Be Empty')
    .normalizeEmail(),

  body('password').not().isEmpty().withMessage('Password Can Not Be Empty'),
];
