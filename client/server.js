const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/home");
});

app.get("/pets", function (req, res) {
  const page = req.query.page ? req.query.page - 1 : 0;
  axios
    .get(`http://localhost:3001/pets?page=${page}&size=9`)
    .then((response) => {
      const data = response.data;
      res.render("pages/pets", { data: data.items, total: data.total });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erro ao obter dados da API");
    });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
