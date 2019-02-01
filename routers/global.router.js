import express from 'express';
import multer from 'multer';
import fs from 'fs.promised';
import urls from '../urls';
import Video from '../models/Video';
import User from '../models/User';

const videoUploader = multer({ dest: 'uploads/videos/' });
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

// login
router.get(urls.login, (req, res) => {
  res.render('login', { pageName: 'Login' });
});
router.post(urls.login, (req, res) => {
  // TODO: login
  res.redirect(urls.home);
});

// logout
router.get(urls.logout, (req, res) => {
  // TODO: logout
  res.redirect(urls.home);
});

// join
router.get(urls.join, (req, res) => {
  res.render('join', { pageName: 'Join' });
});
router.post(urls.join, async (req, res) => {
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
});

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
router.get(urls.upload, (req, res) => {
  res.render('upload');
});
router.post(urls.upload, videoUploader.single('videoFile'), async (req, res) => {
  const { path: uploadedUrl } = req.file;
  const { title, description } = req.body;
  const newVideo = await Video.create({
    fileUrl: uploadedUrl,
    title,
    description
  });
  res.redirect(`${urls.videoDetail}/${newVideo.id}`);
});

// profile
router.get(urls.profile, (req, res) => {
  res.render('profile');
});
router.get(urls.editProfile, (req, res) => {
  res.render('editProfile', { pageName: 'Edit Profile' });
});
router.get(urls.changePassword, (req, res) => {
  res.render('changePassword', { pageName: 'ChangePassword' });
});

// videoDetail
router.get(`${urls.videoDetail}/:id`, async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render('videoDetail', { pageName: 'Video Detail', video });
});

// editVideo
router.get(`${urls.editVideo}/:id`, async (req, res) => {
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
router.get(`${urls.deleteVideo}/:id`, async (req, res) => {
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
