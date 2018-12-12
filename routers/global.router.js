import express from 'express';
import urls from '../urls';
import Video from '../models/Video';
import multer from "multer";

const videoUploader = multer({ dest: 'uploads/videos/' });
const router = express.Router();

router.get(urls.home, async (req, res) => {
    try {
        const videos = await Video.find({});
        res.render("home", { pageName: "Home", videos });
    } catch (error) {
        res.render("home", { pageName: "Home", videos: [] });
    }
});

// login
router.get(urls.login, (req, res) => { res.render("login", { pageName: "Login" }); });
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
router.get(urls.join, (req, res) => { res.render("join", { pageName: "Join" }); });
router.post(urls.join, (req, res) => {
    const { name, email, password, password2 } = req.body;
    if (password !== password2) {
        res.status(400);
        res.render("join", { pageName: "Join" });
    } else {
        // TODO: user join
        // TODO: user login
        res.redirect(urls.home);
    }
});

// search
router.get(urls.search, (req, res) => {
    const { term: searchingFor } = req.query;
    res.render("search", { searchingFor, videos });
});

// upload
router.get(urls.upload, (req, res) => {
    res.render("upload");
});
router.post(urls.upload, videoUploader.single('videoFile'), async (req, res) => {
    const { path: uploadedUrl } = req.file;
    const { title, description } = req.body;
    const newVideo = await Video.create({
        fileUrl: uploadedUrl,
        title,
        description,
    });
    res.redirect(`${urls.videoDetail}/${newVideo.id}`)
});

// profile
router.get(urls.profile, (req, res) => {
    res.render("profile");
});
router.get(urls.editProfile, (req, res) => {
    res.render("editProfile", { pageName: "Edit Profile" });
});
router.get(urls.changePassword, (req, res) => {
    res.render("changePassword", { pageName: "ChangePassword" });
});

// videoDetail
router.get(`${urls.videoDetail}/:id`, async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    res.render("videoDetail", { pageName: "Video Detail", video });
});

// editVideo
router.get(`${urls.editVideo}/:id`, (req, res) => {
    const { id: videoId } = req.params;
    res.render("editVideo", { pageName: "Edit Video", videoId });
});

export default router;