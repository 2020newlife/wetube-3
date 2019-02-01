import User from '../models/User';
import urls from '../urls';

export const getJoin = (req, res) => {
  res.render('join', { pageName: 'Join' });
};

export const postJoin = async (req, res) => {
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
      console.log(`${user} registered`);
    } catch (error) {
      console.log(error);
    }
    res.redirect(urls.home);
  }
};
