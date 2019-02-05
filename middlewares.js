import multer from 'multer';
import urls from './urls';

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'WeTube';
  res.locals.urls = urls;
  res.locals.loginUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(urls.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(urls.home);
  }
};

const multerVideo = multer({ dest: 'uploads/videos/' });
const multerAvatar = multer({ dest: 'uploads/avatars/' });

export const uploadVideo = multerVideo.single('videoFile');
export const uploadAvatar = multerAvatar.single('avatar');
