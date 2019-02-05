import express from 'express';
import fs from 'fs.promised';
import urls from '../urls';
import Video from '../models/Video';

import * as userController from '../controllers/user.controller';
import { onlyPublic, onlyPrivate, uploadVideo, uploadAvatar } from '../middlewares';
import { getUpload, postUpload, getVideoDetail } from '../controllers/video.controller';

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
router.get(urls.upload, onlyPrivate, getUpload);
router.post(urls.upload, uploadVideo, postUpload);

// profile
router.get(urls.profileMe, onlyPrivate, userController.getMyProfile);
router.get(urls.profileOther, onlyPrivate, userController.getOtherProfile);
router.get(urls.editProfile, onlyPrivate, userController.getEditProfile);
router.post(urls.editProfile, onlyPrivate, uploadAvatar, userController.postEditProfile);
router.get(urls.changePassword, onlyPrivate, userController.getChangePassword);
router.post(urls.changePassword, onlyPrivate, userController.postChangePassword);

// videoDetail
router.get(`${urls.videoDetail}/:id`, getVideoDetail);

// editVideo
router.get(`${urls.editVideo}/:id`, onlyPrivate, async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    res.render('editVideo', { pageName: `Edit ${video.title}`, video });
  } catch (error) {
    res.redirect(urls.home);
  }
});
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
router.get(`${urls.deleteVideo}/:id`, onlyPrivate, async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    await fs.unlink(video.fileUrl);
    await video.remove();
  } catch (error) {
    console.log(error);
  }
  res.redirect(urls.home);
});

export default router;
