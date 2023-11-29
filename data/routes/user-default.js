const express = require('express');
const router = express.Router();

const { verifyJWT } = require('../controller/user');
const { listUserAdoptions, verifyPermission, addSolicitation } = require('../controller/user-default');

router.get('/my-adoptions', verifyJWT, listUserAdoptions);
router.get('/verify-moderation', verifyJWT, verifyPermission );
router.post('/moderator-solicitation', verifyJWT, addSolicitation );

module.exports = router;