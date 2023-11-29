const express = require('express');
const router = express.Router();

const { verifyJWT } = require('../controller/user');
const { listPets, adoptPet, findPetById, createPet, deletePet, listAdoptions, acceptAdoption, rejectAdoption, addFavorite, removeFavorite } = require('../controller/pets');

router.get('/', listPets);
router.post('/', verifyJWT, createPet );
router.delete('/', verifyJWT, deletePet);

router.get('/adoptions', verifyJWT, listAdoptions);

router.put('/accept', verifyJWT, acceptAdoption);
router.put('/accept', verifyJWT, acceptAdoption);

router.put('/favorites', verifyJWT, addFavorite);
router.delete('/favorites', verifyJWT, removeFavorite);

router.put('/accept', verifyJWT, acceptAdoption);
router.delete('/reject', verifyJWT, rejectAdoption);

router.get('/:petId', findPetById );
router.post('/adopt', verifyJWT, adoptPet );

module.exports = router;