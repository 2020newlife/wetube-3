import passport from 'passport';
import User from '../models/User';
import urls from '../urls';

// join
export const getJoin = (req, res) => {
  res.render('join', { pageName: 'Join' });
};

export const postJoin = async (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  if (password !== password2) {
    res.status(400);
    res.render('join', { pageName: 'Join' });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(urls.home);
    }
  }
};

// login
export const getLogin = (req, res) => {
  res.render('login', { pageName: 'Login' });
};

export const postLogin = passport.authenticate('local', {
  successRedirect: urls.home,
  failureRedirect: urls.login
});

// logout
export const getLogout = (req, res) => {
  req.logout();
  res.redirect(urls.home);
};

// github
export const getGithubLogin = passport.authenticate('github');

export const getGithubLoginCallback = passport.authenticate('github', {
  successRedirect: urls.home,
  failureRedirect: urls.login
});

export const githubLoginCallBack = async (_, __, profile, cb) => {
  const { id, avatar_url, name, email } = profile._json;
  try {
    if (email == null) {
      throw new Error('github email is null');
    }

    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.avatarUrl = avatar_url;
      user.save();
      return cb(null, user);
    }

    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

// facebook
export const getFacebookLogin = passport.authenticate('facebook');

export const getFacebookLoginCallback = passport.authenticate('facebook', {
  successRedirect: urls.home,
  failureRedirect: urls.login
});

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  const { id, name, email } = profile._json;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }

    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
