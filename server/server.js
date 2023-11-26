const express = require("express");
const cors = require('cors');
const app = express();
const port = 3001;

const paginatedData = require('./scripts/paginated-data');
const { acceptModerator, rejectModerator, acceptAllModerators, rejectAllModerators } = require('./scripts/moderatorManagement');
const { addSolicitation, verifyPermission} = require('./scripts/addSolicitation');
const addFavorite = require('./scripts/favorites');
const findUserByCredentials = require('./scripts/users');
const { filterPets, findPetById } = require("./scripts/filters");


app.use(cors());
app.use(express.json());

app.get('/pets', function (req, res) { return paginatedData(req, res, './data/pets/list.json') })
app.get('/users', function (req, res) { return paginatedData(req, res, './data/users/list.json') })
app.get('/solicitations', function (req, res) { return paginatedData(req, res, './data/users/solicitations.json') })

app.get("/pets/:petId", function (req, res) { return findPetById(req, res, "./data/pets/list.json") });

app.put('/accept-moderator/:userId', (req, res) => { acceptModerator(req, res) });


app.delete('/reject-moderator/:userId', (req, res) => { rejectModerator(req, res) });
app.put('/accept-all-moderators', (req, res) => { acceptAllModerators(req, res) });
app.delete('/reject-all-moderators', (req, res) => { rejectAllModerators(req, res) });

app.get('/verify-moderator', function (req, res) { return verifyPermission(req, res, './data/users/solicitations.json') })
app.post('/send-user-solicitation-request', (req, res) => { return addSolicitation(req, res) });

app.put('/user/:userId/favorites', addFavorite);

app.get('/usersCredentials', (req, res) => {
  const { email, password } = req.query;
  findUserByCredentials(email, password, (err, user) => {
    if (err) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
      return;
    }
    res.json(user);
  });
});

app.get("/petsFilter", (req, res) => { filterPets(req, res, "./data/pets/list.json") });

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
