const express = require("express");
const cors = require('cors');
const app = express();
const port = 3001;

const paginatedData = require("./scripts/paginated-data");
const findPetById = require("./scripts/filters");
const { acceptModerator, rejectModerator, acceptAllModerators, rejectAllModerators } = require('./scripts/moderatorManagement');
const addSolicitation = require('./scripts/addSolicitation');
app.use(cors());
app.use(express.json());
app.get("/pets", function (req, res) {
  return paginatedData(req, res, "./data/pets/list.json");
});
app.get("/users", function (req, res) {
  return paginatedData(req, res, "./data/users/list.json");
});
app.get("/solicitations", function (req, res) {
  return paginatedData(req, res, "./data/users/solicitations.json");
});

app.get("/pets/:petId", function (req, res) {
  return findPetById(req, res, "./data/pets/list.json");
});

app.put('/accept-moderator/:userId', (req, res) => {
  acceptModerator(req, res);
});

app.delete('/reject-moderator/:userId', (req, res) => {
  rejectModerator(req, res);
});
app.put('/accept-all-moderators', (req, res) => {
  acceptAllModerators(req, res);
});

app.delete('/reject-all-moderators', (req, res) => {
  rejectAllModerators(req, res);
});

app.post('/send-user-solicitation-request', (req, res) => {

  const { userId, reason } = req.body;

  addSolicitation(userId, reason, (err, message) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Erro ao processar a solicitação.");
      }
      res.status(200).send(message);
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
