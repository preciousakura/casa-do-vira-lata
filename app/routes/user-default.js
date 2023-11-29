const express = require("express");
const auth = require("../auth/user");
const router = express.Router();

router.get("/", (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }), (req, res) => {
  res.render("pages/user-default", { user: req.cookies.user });
});

router.get("/solicitation", (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }), async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3001/user-default/verify-moderation`, { headers: { Authorization: req.cookies.user.token } });
        const data = await response.json();
        if (data.message || !data.permission) res.render("pages/error/solicitation-reject");
        else if (data.permission) res.render("pages/user-default/solicitation", { user: req.cookies.user });
    } catch (err) {
        res.render("pages/error/solicitation-reject");
    }
});

router.get("/my-adoptions", (req, res, next) => { auth(req, res, next, { allowed: ["USER-DEFAULT"] }) }, async (req, res) => {
    res.render("pages/user-default/my-adoptions", { user: req.cookies.user });
});

module.exports = router;
