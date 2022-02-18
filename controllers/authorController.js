const User = require('../models/User');

exports.authorProfileGetController = async (req, res, next) => {
  let userId = req.params.userId;

  try {
    let author = await User.findById(userId).populate({
      path: 'profile',
      populate: {
        path: 'posts',
      },
    });
    res.render('pages/explorer/author', {
      title: `${author.profile.name} - Profile Page`,
      author,
    });
  } catch (e) {
    next(e);
  }
};
