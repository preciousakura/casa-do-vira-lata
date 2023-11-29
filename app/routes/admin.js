const express = require("express");
const auth = require("../auth/user");
const router = express.Router();

router.get("/", (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }), (req, res) => {
    res.render("pages/admin", { user: req.cookies.user });
});

router.get("/users", (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }), (req, res) => {
    res.render("pages/admin/users", { user: req.cookies.user });
});

router.get("/pets", (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }), (req, res) => {
    res.render("pages/admin/pets", { user: req.cookies.user });
});

router.get("/solicitations", (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }), (req, res) => {
    res.render("pages/admin/solicitations", { user: req.cookies.user });
});


module.exports = router;
