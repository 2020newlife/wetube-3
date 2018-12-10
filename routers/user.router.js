import express from 'express';
import urls from '../urls';
const router = express.Router();

router.get(urls.user.editProfile, (req, res) => {
    res.render("editProfile", { pageName: "Edit Profile" });
});

router.get(urls.user.changePassword, (req, res) => {
    res.render("changePassword", { pageName: "ChangePassword" });
});

export default router;