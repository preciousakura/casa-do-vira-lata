require("dotenv-safe").config({ path: '.env' })
const jwt = require('jsonwebtoken');
const express = require("express");
const cors = require('cors');
const app = express();
const port = 3001;

const {addFavorite, removeFavorite} = require('./scripts/favorites');
const adoptPet = require('./scripts/adoptPet');
const {auth, verifyJWT} = require('./scripts/auth');
const paginatedData = require('./scripts/paginated-data');
const { acceptModerator, rejectModerator, acceptAllModerators, rejectAllModerators } = require('./scripts/moderatorManagement');
const { addSolicitation, verifyPermission} = require('./scripts/addSolicitation');
const { filterPets, findPetById } = require("./scripts/filters");

const {listAdoptions, listUserAdoptions} = require('./scripts/listAdoptions');
const {acceptAdoption, rejectAdoption} = require('./scripts/adoption');
const registerAnimal = require('./scripts/registerAnimal');
const deleteUser = require('./scripts/deleteUser');
const deletePet = require("./scripts/deletePet");

app.use(cors());
app.use(express.json());

app.get('/me', verifyJWT, (req, res) => {
  return res.json({ token: req.token, user: req.user });
});

app.post('/login', async (req, res, next) => auth(req, res, next), (req, res) => {
    const { id, role, name} = req.user
    const token = jwt.sign({ id, role, name }, process.env.SECRET, { expiresIn: 100000 });
    return res.json({ token: token, user: req.user });
})


app.post('/logout', function(req, res) {
  res.json({ auth: false, token: null });
})

app.get('/pets', function (req, res) { return paginatedData(req, res, './data/pets/list.json') })
app.get('/users', verifyJWT, function (req, res) { return paginatedData(req, res, './data/users/list.json') })
app.get('/solicitations', verifyJWT, function (req, res) { return paginatedData(req, res, './data/users/solicitations.json') })

app.get("/pets/:petId", function (req, res) { return findPetById(req, res, "./data/pets/list.json") });

app.put('/accept-moderator/:userId', verifyJWT, (req, res) => { acceptModerator(req, res) });


app.post("/pets/adopt", verifyJWT, function (req, res) { return adoptPet(req, res) });

app.delete('/reject-moderator/:userId', verifyJWT, (req, res) => { rejectModerator(req, res) });
app.put('/accept-all-moderators', verifyJWT, (req, res) => { acceptAllModerators(req, res) });
app.delete('/reject-all-moderators', verifyJWT, (req, res) => { rejectAllModerators(req, res) });

app.get('/verify-moderator', verifyJWT, function (req, res) { return verifyPermission(req, res, './data/users/solicitations.json') })
app.post('/send-user-solicitation-request', verifyJWT, (req, res) => { return addSolicitation(req, res) });

app.put('/user/:userId/favorites', verifyJWT, addFavorite);
app.delete('/user/:userId/favorites', verifyJWT, removeFavorite);
app.delete('/users/:userId', verifyJWT, deleteUser);
app.delete('/pets/:petId', verifyJWT, deletePet);

app.get("/petsFilter", (req, res) => { filterPets(req, res, "./data/pets/list.json") });
app.get('/adoptions', verifyJWT, listAdoptions);
app.get('/user/:userId/adoptions', verifyJWT, listUserAdoptions);

app.put('/adoptions/:id/accept', verifyJWT, acceptAdoption);
app.delete('/adoptions/:id/reject', verifyJWT, rejectAdoption);

app.post('/registerAnimal', verifyJWT, registerAnimal);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
