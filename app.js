import './config';
import './db';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import urls from './urls';
import globalRouter from './routers/global.router';

const app = express();

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

// locals middleware
app.use((req, res, next) => {
  res.locals.siteName = 'WeTube';
  res.locals.urls = urls;
  res.locals.user = {
    id: 123,
    isLoggedin: true
  };
  next();
});

// routes
app.use('/', globalRouter);

// run
const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅  server on: http://localhost:${PORT}`);
});
