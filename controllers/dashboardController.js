const { validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const errorFormatter = require('../utils/validationErrorFormatter');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate({
        path: 'posts',
        select: 'title thumbnail',
      })
      .populate({
        path: 'bookmarks',
        select: 'title thumbnail',
      });

    if (!profile) {
      return res.redirect('/dashboard/create-profile');
    }
    res.render('pages/dashboard/dashboard', {
      title: 'My Dashboard',
      posts: profile.posts,
      bookmarks: profile.bookmarks,
    });
  } catch (e) {
    next(e);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      res.redirect('/dashboard');
    }
    res.render('pages/dashboard/create-profile', {
      title: 'Create Your profile',
      error: {},
    });
  } catch (e) {
    next(e);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', {
      title: 'Create Your Profile',
      error: errors.mapped(),
    });
  }

  let { name, title, bio, website, facebook, github } = req.body;

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      links: {
        website: website || '',
        facebook: facebook || '',
        github: github || '',
      },
      posts: [],
      bookmarks: [],
    });

    let createdProfile = await profile.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profile: createdProfile._id } }
    );

    res.redirect('/dashboard');
  } catch (e) {
    next(e);
  }
};
exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.redirect('/dashboard/create-profile');
    }
    res.render('pages/dashboard/edit-profile', {
      title: 'Edit Your Profile',
      error: {},
      profile,
    });
  } catch (e) {
    next(e);
  }
};
exports.editProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);

  let { name, title, bio, website, facebook, github } = req.body;

  if (!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', {
      title: 'Create Your Profile',
      error: errors.mapped(),
      profile: {
        name,
        title,
        bio,
        links: {
          website,
          facebook,
          github,
        },
      },
    });
  }

  try {
    let profile = {
      name,
      title,
      bio,
      links: {
        website: website || '',
        facebook: facebook || '',
        github: github || '',
      },
    };

    let updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profile },
      { new: true }
    );
    res.render('pages/dashboard/edit-profile', {
      title: 'Edit Your Profile',
      error: {},
      profile: updatedProfile,
    });
  } catch (e) {
    next(e);
  }
};

exports.bookmarksGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({
      user: req.user._id,
    }).populate({
      path: 'bookmarks',
      model: 'Post',
      select: 'title thumbnail',
    });
    res.render('pages/dashboard/bookmarks', {
      title: 'My Bookmarks',
      posts: profile.bookmarks,
    });
  } catch (e) {
    next(e);
  }
};

exports.commentsGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({
      user: req.user._id,
    });
    let comments = await Comment.find({
      post: {
        $in: profile.posts,
      },
    })
      .populate({
        path: 'post',
        select: 'title',
      })
      .populate({
        path: 'user',
        select: 'username profilePics',
      })
      .populate({
        path: 'replies.user',
        select: 'username profilePics',
      });

    res.render('pages/dashboard/comments', {
      title: 'My Recent Comments',
      comments,
    });
  } catch (e) {
    next(e);
  }
};
