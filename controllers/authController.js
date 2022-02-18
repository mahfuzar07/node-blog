const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
// const Flash = require('../utils/Flash');

exports.signupGetController = (req, res, next) => {
  res.render('pages/auth/signup', {
    title: 'Create New Account',
    error: {},
    value: {},
    // flashMessage: Flash.getMessage(req),
  });
};
exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    // req.flash('fail', 'please Check Your Form');
    return res.render('pages/auth/signup', {
      title: 'Create New Account',
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
      // flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = new User({
      username,
      email,
      password: hashedPassword,
    });
    let createduser = await user.save();
    res.redirect('/auth/login');
  } catch (e) {
    console.log(e);
    next(e);
  }
};
exports.loginGetController = (req, res, next) => {
  res.render('pages/auth/login', {
    title: 'Login Your Account',
    error: {},
    // flashMessage: Flash.getMessage(req),
  });
};
exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    // req.flash('fail', 'please check your Form');
    return res.render('pages/auth/login', {
      title: 'Login Your Account',

      error: errors.mapped(),
      // flashMessage: Flash.getMessage(req),
    });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // req.flash('fail', 'please provide valid Credentials');
      return res.render('pages/auth/login', {
        title: 'Login Your Account',
        error: {},
        // flashMessage: Flash.getMessage(req),
      });
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      // req.flash('fail', 'please provide valid Credentials');
      return res.render('pages/auth/login', {
        title: 'Login Your Account',
        error: {},
        // flashMessage: Flash.getMessage(req),
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      // req.flash('success', 'Successfully Loogged in');
      res.redirect('/dashboard/create-profile');
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    // req.flash('success', ' Successfully Logged out');
    res.redirect('/auth/login');
  });
};

exports.changePasswordGetController = async (req, res, next) => {
  res.render('pages/auth/changePassword', {
    title: 'Change My Password',
  });
};

exports.changePasswordPostController = async (req, res, next) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.redirect('/auth/change-password');
  }

  try {
    let match = await bcrypt.compare(oldPassword, req.user.password);
    if (!match) {
      return res.redirect('/auth/change-password');
    }

    let hash = await bcrypt.hash(newPassword, 11);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { password: hash } }
    );

    return res.redirect('/dashboard/edit-profile');
  } catch (e) {
    next(e);
  }
};
