import passport from 'passport';
import User from './models/User';

// passport-local-mongoose 라이브러리의 strategy를 사용
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
