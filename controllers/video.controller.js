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
