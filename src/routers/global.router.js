import express from 'express';
import urls from '../urls';
import Video from '../models/Video';

import * as userController from '../controllers/user.controller';
import * as videoController from '../controllers/video.controller';
import { onlyPublic, onlyPrivate, uploadVideo, uploadAvatar } from '../middlewares';

const router = express.Router();

// home
router.get(urls.home, async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render('home', { pageName: 'Home', videos });
  } catch (error) {
    res.render('home', { pageName: 'Home', videos: [] });
  }
});

// join
router.get(urls.join, onlyPublic, userController.getJoin);
router.post(urls.join, onlyPublic, userController.postJoin, userController.postLogin);

// login
router.get(urls.login, onlyPublic, userController.getLogin);
router.post(urls.login, onlyPublic, userController.postLogin);

// login - github
router.get(urls.githubLogin, userController.getGithubLogin);
router.get(urls.githubLoginCallback, userController.getGithubLoginCallback);

// login - facebook
router.get(urls.facebookLogin, userController.getFacebookLogin);
router.get(urls.facebookLoginCallback, userController.getFacebookLoginCallback);

// logout
router.get(urls.logout, onlyPrivate, userController.getLogout);

// search
router.get(urls.search, async (req, res) => {
  const { term: searchingFor } = req.query;
  let videos = [];
  try {
    videos = await Video.find({ title: { $regex: searchingFor, $options: 'i' } });
  } catch (error) {
    console.log(error);
  }
  res.render('search', { pageName: 'Search', searchingFor, videos });
});

// upload
router.get(urls.upload, onlyPrivate, videoController.getUpload);
router.post(urls.upload, uploadVideo, videoController.postUpload);

// profile
router.get(urls.profile, userController.getProfile);
router.get(urls.editProfile, onlyPrivate, userController.getEditProfile);
router.post(urls.editProfile, onlyPrivate, uploadAvatar, userController.postEditProfile);
router.get(urls.changePassword, onlyPrivate, userController.getChangePassword);
router.post(urls.changePassword, onlyPrivate, userController.postChangePassword);

// videoDetail
router.get(`${urls.videoDetail}/:id`, videoController.getVideoDetail);

// editVideo
router.get(`${urls.editVideo}/:id`, onlyPrivate, videoController.getEditVideo);
router.post(`${urls.editVideo}/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    await Video.findByIdAndUpdate(id, { title, description });
    res.redirect(`${urls.videoDetail}/${id}`);
  } catch (error) {
    res.redirect(urls.home);
  }
});

// deleteVideo
router.get(`${urls.deleteVideo}/:id`, onlyPrivate, videoController.getDeleteVideo);

export default router;
