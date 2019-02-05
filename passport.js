import passport from 'passport';
import GithubStrategy from 'passport-github';
import FacebookStrategy from 'passport-facebook';
import User from './models/User';
import { githubLoginCallBack, facebookLoginCallback } from './controllers/user.controller';
import urls from './urls';

// passport-local-mongoose 라이브러리의 strategy를 사용
passport.use(User.createStrategy());

// github
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `http://localhost:${process.env.SERVER_PORT}${urls.githubLoginCallback}`
    },
    githubLoginCallBack
  )
);

// facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `https://gentle-frog-23.localtunnel.me${urls.facebookLoginCallback}`,
      profileFields: ['id', 'displayName', 'email'],
      scope: ['public_profile', 'email']
    },
    facebookLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
