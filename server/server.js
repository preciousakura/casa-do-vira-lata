const express = require("express");
const cors = require('cors');
const app = express();
const port = 3001;

const paginatedData = require("./scripts/paginated-data");
const findPetById = require("./scripts/filters");
const { acceptModerator, rejectModerator, acceptAllModerators, rejectAllModerators } = require('./scripts/moderatorManagement');

app.use(cors());
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
