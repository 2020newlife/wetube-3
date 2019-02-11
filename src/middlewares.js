import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import urls from './urls';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'ap-northeast-2'
});

// upload to local
const multerVideoLocal = multer({ dest: 'uploads/videos/' });
const multerAvatarLocal = multer({ dest: 'uploads/avatars/' });

// upload to aws s3
const multerVideoS3 = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: `${process.env.AWS_BUCKET}/video`
  })
});

const multerAvatarS3 = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: `${process.env.AWS_BUCKET}/avatar`
  })
});

export const uploadVideo = process.env.PRODUCTION
  ? multerVideoS3.single('videoFile')
  : multerVideoLocal.single('videoFile');
export const uploadAvatar = process.env.PRODUCTION
  ? multerAvatarS3.single('avatar')
  : multerAvatarLocal.single('avatar');

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'WeTube';
  res.locals.urls = urls;
  res.locals.loginUser = req.user || null;
  res.locals.hostUrl = process.env.HOST;
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
