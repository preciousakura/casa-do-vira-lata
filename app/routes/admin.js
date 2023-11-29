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

router.get("/pets/:id", (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }), async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`http://localhost:3001/pets/${id}`);
        if (!response.ok) return res.render("pages/error");

        const data = await response.json();
        res.render("pages/moderator/animal-registration", { pet: data, user: req.cookies.user });
    } catch (error) {
        return res.render("pages/error");
    }
});

router.get("/solicitations", (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }), (req, res) => {
    res.render("pages/admin/solicitations", { user: req.cookies.user });
});


module.exports = router;
