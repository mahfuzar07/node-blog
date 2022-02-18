const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const profileValidator = require('../validator/dashboard/profileValidator');

const {
  dashboardGetController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController,
  bookmarksGetController,
  commentsGetController,
} = require('../controllers/dashboardController');

router.get('/bookmarks', isAuthenticated, bookmarksGetController);
router.get('/comments', isAuthenticated, commentsGetController);

router.get(
  '/create-profile',
  isAuthenticated,
  profileValidator,
  createProfileGetController
);
router.post(
  '/create-profile',
  isAuthenticated,
  profileValidator,
  createProfilePostController
);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, editProfilePostController);

router.get('/', isAuthenticated, profileValidator, dashboardGetController);

module.exports = router;
