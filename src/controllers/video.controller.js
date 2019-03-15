import fs from 'fs.promised';
import aws from 'aws-sdk';
import Video from '../models/Video';
import urls from '../urls';
import Comment from '../models/Comment';
import User from '../models/User';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'ap-northeast-2'
});

export const getUpload = (req, res) => {
  res.render('upload');
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file
  } = req;

  const fileUrl = process.env.PRODUCTION ? file.location : file.path;

  const newVideo = await Video.create({
    fileUrl,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(`${urls.videoDetail}/${newVideo.id}`);
};

export const getVideoDetail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id)
      .populate('creator')
      .populate('comments');
    // ISSUE: nested populate
    // const video = await Video.findById(id)
    //   .populate('comments')
    //   .populate({
    //     path: 'creator',
    //     model: 'User'
    //   });
    res.render('videoDetail', { pageName: 'Video Detail', video });
  } catch (error) {
    next();
  }
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
  const { id } = req.params;
  /* ISSUE: not working
    const video = await Video.findById(id);
     */
  const video = await Video.findById(id).populate('creator');
  const creator = await User.findById(video.creator);

  try {
    console.log('prod: ', process.env.PRODUCTION);
    if (video.creator.id !== req.user.id) {
      throw Error();
    } else if (process.env.PRODUCTION) {
      // prod environment
      // file delete on aws s3
      const tmpArray = video.fileUrl.split('/');
      const fileName = tmpArray[tmpArray.length - 1];
      const params = {
        Bucket: `${process.env.AWS_BUCKET}/video`,
        Key: fileName
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.log('video delete error!');
          console.log(err, err.stack);
        } else {
          console.log('video delete sucess');
          console.log(data);
        }
      });
      await video.remove();
      await creator.videos.remove(video.id);
      await creator.save();
    } else {
      // dev environment
      // file delete on local storage
      console.log('delete local', video.fileUrl);
      await fs.unlink(video.fileUrl);
      await video.remove();
      await creator.videos.remove(video.id);
      await creator.save();
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log('deleted video: ', video);
    console.log('deleted video: ', video.id);
  }
  res.redirect(urls.home);
};

/*
export const testDeleteVideo = (req, res) => {
  const params = {
    Bucket: `${process.env.AWS_BUCKET}/video`,
    Key: 'cd58504e067ac8d61facb692d17836d4' // if any sub folder-> path/of/the/folder.ext
  };
  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log('error!');
      console.log(err, err.stack);
    } else {
      console.log('sucess');
      console.log(data);
    }
  });

  res.end();
};
*/

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

export const postAddComment = async (req, res) => {
  const {
    body: { videoId, comment },
    user
  } = req;
  try {
    const video = await Video.findById(videoId);
    const newComment = await Comment.create({
      comment,
      creatorId: user.id,
      videoId
    });
    video.comments.push(newComment.id);
    await video.save();
    res.send({ commentId: newComment.id });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    body: { commentId },
    user
  } = req;
  try {
    console.log('asdf: ', commentId);
    const comment = await Comment.findById(commentId);
    console.log(comment.creatorId, user.id);
    if (comment.creatorId.toString() === user.id) {
      const video = await Video.findById(comment.videoId);
      console.log(comment.id);
      await video.comments.remove(comment.id);
      await video.save();
      await comment.remove();
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
