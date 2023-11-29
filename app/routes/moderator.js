const express = require("express");
const auth = require("../auth/user");
const router = express.Router();

router.get("/", (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }), (req, res) => {
  res.render("pages/moderator", { user: req.cookies.user });
});

router.get("/animal-registration", (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }), (req, res) => {
    res.render("pages/moderator/animal-registration", { user: req.cookies.user });
});

router.get("/solicitations-adoptions", (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }), (req, res) => {
    res.render("pages/moderator/solicitations-adoptions", { user: req.cookies.user });
});


module.exports = router;
