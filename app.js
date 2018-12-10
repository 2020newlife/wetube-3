import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import urls from './urls';
import globalRouter from './routers/global.router';
import userRouter from './routers/user.router';
import videoRouter from './routers/video.router';

const app = express();

// view engine
app.set("view engine", "pug");

// middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));

// locals
app.use((req, res, next) => {
    res.locals.siteName = "WeTube";
    res.locals.urls = urls;
    next();
});

// routes
app.use("/", globalRouter);
app.use("/", userRouter);
app.use("/", videoRouter);

// run
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`server on: http://localhost:${PORT}`)
});