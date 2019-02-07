import './config';
import './db';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import globalRouter from './routers/global.router';
import apiRouter from './routers/api.router';
import { localMiddleware } from './middlewares';
import './passport';

const app = express();

const CookieStore = ConnectMongo(session);

// view engine
app.set('view engine', 'pug');

// static
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('static'));

// middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(passport.initialize());
app.use(passport.session());

// locals middlewares
app.use(localMiddleware);

// routes
app.use('/', globalRouter);
app.use('/api', apiRouter);

// run
const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅  server on: http://localhost:${PORT}`);
});
