import express from 'express';
import urls from '../urls';
import { videos } from '../db';
const router = express.Router();

router.get(urls.home, (req, res) => {
    res.render("home", { pageName: "Home", videos });
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
router.post(urls.upload, (req, res) => {
    // TODO: upload video
    res.redirect(`${urls.videoDetail}/1234`)
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
router.get(`${urls.videoDetail}/:id`, (req, res) => {
    console.log(req.query);
    const videoId = req.params.id;
    res.render("videoDetail", { videoId });
});

export default router;