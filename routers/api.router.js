import express from 'express';
import urls from '../urls';
import { postRegisterView, postAddComment } from '../controllers/video.controller';
import { onlyPrivate } from '../middlewares';

const apiRouter = express.Router();

apiRouter.post(urls.api.registerView, postRegisterView);
apiRouter.post(urls.api.addComment, onlyPrivate, postAddComment);

export default apiRouter;
