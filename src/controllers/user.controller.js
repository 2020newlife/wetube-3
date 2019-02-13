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
    req.flash('error', "Passwords don't match");
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
  failureRedirect: urls.login,
  successFlash: 'Welcome Flash Message',
  failureFlash: "Can't login. check email or password"
});

// login - github
export const getGithubLogin = passport.authenticate('github', {
  successFlash: 'Welcome',
  failureFlash: "Can't login"
});

export const getGithubLoginCallback = (req, res) => {
  res.redirect(urls.home);
};

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
export const getFacebookLogin = passport.authenticate('facebook', {
  successFlash: 'Welcome',
  failureFlash: "Can't login"
});

export const getFacebookLoginCallback = (req, res) => {
  res.redirect(urls.home);
};

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb) => {
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
  req.flash('info', 'Logged out');
  req.logout();
  res.redirect(urls.home);
};

// profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('videos');
    res.render('profile', { pageName: 'User Profile', user });
  } catch (error) {
    req.flash('error', 'User not found');
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

  let fileUrl;
  if (file) {
    fileUrl = process.env.PRODUCTION ? file.location : file.path;
  } else {
    fileUrl = req.user.avatarUrl;
  }

  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: fileUrl
    });
    req.flash('success', 'Profile updated');
    res.redirect(urls.profile);
  } catch (error) {
    req.flash('error', "Can't update profile");
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
      req.flash('error', 'Passwords not match');
      res.status(400);
      res.redirect(urls.changePassword);
      return;
    }

    await req.user.changePassword(oldPassword, newPassword);

    res.redirect(urls.profile);
  } catch (error) {
    req.flash('error', "Can't change password");
    res.status(400);
    res.redirect(urls.changePassword);
  }
};
