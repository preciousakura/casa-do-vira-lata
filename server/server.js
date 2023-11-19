const express = require("express");
const app = express();
const port = 3001;

const paginatedData = require("./scripts/paginated-data");
const findPetById = require("./scripts/filters");

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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
