import express from 'express';
import urls from '../urls';
import { videos } from '../db';
const router = express.Router();

router.get(urls.home, (req, res) => {
    res.render("home", { pageName: "Home", videos });
});
router.get(urls.login, (req, res) => { res.render("login", { pageName: "Login" }); });
router.get(urls.logout, (req, res) => { res.render("logout"); });
router.get(urls.join, (req, res) => { res.render("join", { pageName: "Join" }); });

router.get(urls.search, (req, res) => {
    const { term: searchingFor } = req.query;
    res.render("search", { searchingFor });
});

export default router;