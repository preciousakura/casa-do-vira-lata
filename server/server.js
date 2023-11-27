require("dotenv-safe").config({ path: '.env' })
const jwt = require('jsonwebtoken');

const express = require("express");
const cors = require('cors');
const app = express();
const port = 3001;

const {addFavorite, removeFavorite} = require('./scripts/favorites');
const adoptPet = require('./scripts/adoptPet');
const {auth, verifyJWT} = require('./scripts/auth');
const findUserByCredentials = require('./scripts/users');
const paginatedData = require('./scripts/paginated-data');
const { acceptModerator, rejectModerator, acceptAllModerators, rejectAllModerators } = require('./scripts/moderatorManagement');
const { addSolicitation, verifyPermission} = require('./scripts/addSolicitation');
const { filterPets, findPetById } = require("./scripts/filters");

const {listAdoptions, listUserAdoptions} = require('./scripts/listAdoptions');
const {acceptAdoption, rejectAdoption} = require('./scripts/adoption');
const registerAnimal = require('./scripts/registerAnimal');
const registerUser = require('./scripts/userRegistration');

app.use(cors());
app.use(express.json());

app.get('/me', verifyJWT, (req, res) => {
  return res.json({ token: token, user: req.user });
});

app.post('/signup', registerUser);

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = sha512(password);

  const usersFilePath = path.join(__dirname, './data/users/list.json');
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  
  const foundUser = users.find(user => user.email === email && user.password === hashedPassword);
  
  if (foundUser) {
      const token = jwt.sign({ id: foundUser.id, role: foundUser.role, name: foundUser.name }, process.env.SECRET, { expiresIn: 100000 });
      res.json({ token: token, user: foundUser });
  } else {
      res.status(401).json({ error: 'Invalid credentials' });
  }
});



app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

app.get('/pets', function (req, res) { return paginatedData(req, res, './data/pets/list.json') })
app.get('/users', function (req, res) { return paginatedData(req, res, './data/users/list.json') })
app.get('/solicitations', function (req, res) { return paginatedData(req, res, './data/users/solicitations.json') })

app.get("/pets/:petId", function (req, res) { return findPetById(req, res, "./data/pets/list.json") });
app.put('/accept-moderator/:userId', (req, res) => { acceptModerator(req, res) });


app.post("/pets/adopt", function (req, res) { return adoptPet(req, res) });

app.delete('/reject-moderator/:userId', (req, res) => { rejectModerator(req, res) });
app.put('/accept-all-moderators', (req, res) => { acceptAllModerators(req, res) });
app.delete('/reject-all-moderators', (req, res) => { rejectAllModerators(req, res) });

app.get('/verify-moderator', function (req, res) { return verifyPermission(req, res, './data/users/solicitations.json') })
app.post('/send-user-solicitation-request', (req, res) => { return addSolicitation(req, res) });

app.put('/user/:userId/favorites', addFavorite);
app.delete('/user/:userId/favorites', removeFavorite);

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
app.get('/adoptions', listAdoptions);
app.get('/user/:userId/adoptions', listUserAdoptions);

app.put('/adoptions/:id/accept', acceptAdoption);
app.delete('/adoptions/:id/reject', rejectAdoption);

app.post('/registerAnimal', registerAnimal);
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
