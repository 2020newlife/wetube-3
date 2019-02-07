import fs from 'fs.promised';
import Video from '../models/Video';
import urls from '../urls';

export const getUpload = (req, res) => {
  res.render('upload');
};

export const postUpload = async (req, res) => {
  const { path: uploadedUrl } = req.file;
  const { title, description } = req.body;
  const newVideo = await Video.create({
    fileUrl: uploadedUrl,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(`${urls.videoDetail}/${newVideo.id}`);
};

export const getVideoDetail = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate('creator');
  res.render('videoDetail', { pageName: 'Video Detail', video });
};

export const getEditVideo = async (req, res) => {
  try {
    const { id } = req.params;

    /*
    // ------------------------------------------------------------------
    // ISSUE: this not working
    const video = await Video.findById(id);

    console.log(video.creator); // 5c59528c08578e13cedaf540
    console.log(req.user.id); // 5c59528c08578e13cedaf540

    console.log(typeof video.creator); // object
    console.log(typeof req.user.id); // string

    console.log(video.creator == req.user.id); // true
    console.log(video.creator === req.user.id); // false

    if (video.creator !== req.user.id) {
      throw Error('not authorized');
    } else {
      res.render('editVideo', { pageName: `Edit ${video.title}`, video });
    }
    */

    // ------------------------------------------------------------------
    // this works fine
    const video = await Video.findById(id).populate('creator');

    if (video.creator.id !== req.user.id) {
      throw Error('not authorized');
    } else {
      res.render('editVideo', { pageName: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(urls.home);
  }
};

export const getDeleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    /* ISSUE: not working
    const video = await Video.findById(id);
     */
    const video = await Video.findById(id).populate('creator');

    if (video.creator.id !== req.user.id) {
      throw Error();
    } else {
      await fs.unlink(video.fileUrl);
      await video.remove();
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(urls.home);
};

export const postRegisterView = async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);
    video.views += 1;
    video.save();
    res.status(200);
    res.send({ views: video.views });
  } catch (error) {
    res.status(400);
    res.end();
  }
};
