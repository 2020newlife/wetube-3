import urls from './urls';

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = 'WeTube';
  res.locals.urls = urls;
  res.locals.user = req.user || null;
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
