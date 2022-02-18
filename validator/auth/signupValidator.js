const { body } = require('express-validator');
const User = require('../../models/User');

module.exports = [
  body('username')
    .isLength({ min: 2, max: 15 })
    .withMessage('username Must Be Between 2 to 15 Charecter')
    .custom(async (username) => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject('username Already Used');
      }
    })
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please Provide A Valid Email')
    .custom(async (email) => {
      let user = await User.findOne({ email });
      if (user) {
        return Promise.reject('Email Already Used');
      }
    })
    .normalizeEmail(),

  body('password')
    .isLength({ min: 5 })
    .withMessage('password Must Be greater than 5 Charecter'),

  body('confirmpassword').custom((confirmpassword, { req }) => {
    if (confirmpassword !== req.body.password) {
      throw new Error('password Does not match');
    }
    return true;
  }),
];
