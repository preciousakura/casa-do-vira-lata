const express = require("express");
const path = require("path");
let cookie = require("cookie-parser");
const auth = require("./auth/user");
const app = express();
const port = 3000;

app.use(cookie());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

const user = {
  id: 0,
  name: "Isabel Cristina de Oliveira Lopes",
  username: "isabel20",
  password: "",
  role: "COLABORATOR",
};

app.get("/", (req, res) => { 
  res.cookie("user", user, { maxAge: 900000, httpOnly: true });
  res.render("pages/home") 
});

app.get("/pets", async (req, res) => {
  const page = req.query.page ? req.query.page - 1 : 0;
  try {
    const response = await fetch(`http://localhost:3001/pets?page=${page}&size=9`);
    const data = await response.json();
    res.render("pages/pets", { data: data.items, total: data.total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao obter dados da API");
  }
});

app.use("/admin", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}),
  (req, res) => {
    res.render("pages/admin");
  }
);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
