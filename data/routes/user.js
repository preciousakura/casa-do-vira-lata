const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { auth, verifyJWT, register } = require('../controller/user');

router.get('/me', verifyJWT, (req, res) => {
    return res.json({ token: req.token, user: req.user });
});
  
router.post('/login', async (req, res, next) => auth(req, res, next), (req, res) => {
    const { id, role, name} = req.user
    const token = jwt.sign({ id, role, name }, process.env.SECRET, { expiresIn: 100000 });
    return res.json({ token: token, user: req.user });
})
  
router.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

router.post('/register', register)

module.exports = router;