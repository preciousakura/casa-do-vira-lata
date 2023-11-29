const express = require('express');
const router = express.Router();

const { verifyJWT } = require('../controller/user');
const { listUser, deleteUser, listSolicitations, acceptSolicitation, rejectSolicitation, acceptAll, rejectAll } = require('../controller/admin');

router.get('/users', verifyJWT, listUser);
router.delete('/users', verifyJWT, deleteUser);

router.get('/solicitations', verifyJWT, listSolicitations);

router.put('/accept-moderator', verifyJWT, acceptSolicitation);
router.delete('/reject-moderator', verifyJWT, rejectSolicitation);

router.put('/accept-all', verifyJWT, acceptAll);
router.delete('/reject-all', verifyJWT, rejectAll);

module.exports = router;