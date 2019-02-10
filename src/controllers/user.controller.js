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

// login - github
export const getGithubLogin = passport.authenticate('github');

export const getGithubLoginCallback = passport.authenticate('github', {
  successRedirect: urls.home,
  failureRedirect: urls.login
});

export const githubLoginCallBack = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    if (email == null) {
      throw new Error('github email is null');
    }

    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.avatarUrl = avatarUrl;
      user.save();
      return cb(null, user);
    }

    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

// login - facebook
export const getFacebookLogin = passport.authenticate('facebook');

export const getFacebookLoginCallback = passport.authenticate('facebook', {
  successRedirect: urls.home,
  failureRedirect: urls.login
});

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  const {
    _json: { id, name, email }
  } = profile;
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

// logout
export const getLogout = (req, res) => {
  req.logout();
  res.redirect(urls.home);
};

// profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('videos');
    res.render('profile', { pageName: 'User Profile', user });
  } catch (error) {
    res.redirect(urls.home);
  }
};

export const getEditProfile = (req, res) => {
  res.render('editProfile', { pageName: 'Edit Profile' });
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    res.redirect(urls.profile);
  } catch (error) {
    res.redirect(urls.profile);
  }
};

// change password
export const getChangePassword = (req, res) => {
  res.render('changePassword', { pageName: 'ChangePassword' });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, confirmPassword }
  } = req;

  try {
    if (newPassword !== confirmPassword) {
      res.status(400);
      res.redirect(urls.changePassword);
      return;
    }

    await req.user.changePassword(oldPassword, newPassword);

    res.redirect(urls.profile);
  } catch (error) {
    res.status(400);
    res.redirect(urls.changePassword);
  }
};
