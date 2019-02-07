import express from 'express';
import urls from '../urls';
import { postRegisterView } from '../controllers/video.controller';

const apiRouter = express.Router();

apiRouter.post(urls.api.registerView, postRegisterView);

export default apiRouter;
