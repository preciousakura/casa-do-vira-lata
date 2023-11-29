const express = require("express");
const auth = require("../auth/user");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/pets", { user: req.cookies.user });
});

router.get("/adoption", (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }), async (req, res) => {
    try {
        const { petId } = req.query;
        const response = await fetch(`http://localhost:3001/pets/${petId}`);
        if (!response.ok) return res.render("pages/error");

        const data = await response.json();
        res.render("pages/pets/adoption", { pet: data, user: req.cookies.user });
    } catch (error) {
        return res.render("pages/error");
    }
});

module.exports = router;
