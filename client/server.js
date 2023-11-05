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
  role: "ADMIN",
};

app.get("/", (req, res) => { 
  res.cookie("user", user);
  res.render("pages/home") 
});

app.get("/pets", async (req, res) => {
  const page = req.query.page ? req.query.page : 1;

  try {
    const response = await fetch(`http://localhost:3001/pets?page=${page}&size=9`);
    const data = await response.json();
    res.render("pages/pets", { data: data.items, total: data.total, current_page: 'pets', size: 9 });
  } catch (error) {
    res.render("pages/pets", { data: [], total: 0, message: "Internal Server Error" });
  }
});

app.get("/admin", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}),
  (req, res) => {
    res.render("pages/admin");
  }
);

app.get("/admin/users", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}),
  async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    try {
      const response = await fetch(`http://localhost:3001/users?page=${page}&size=10`);
      const data = await response.json();
      res.render("pages/admin/users", { data: data.items, total: data.total, current_page: 'users', size: 10 });
    } catch (error) {
      res.render("pages/admin/users", { data: [], total: 0, message: "Internal Server Error" });
    }
  }
);

app.get("/admin/pets", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}),
  async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    try {
      const response = await fetch(`http://localhost:3001/pets?page=${page}&size=10`);
      const data = await response.json();
      res.render("pages/admin/pets", { data: data.items, total: data.total, current_page: 'pets', size: 10 });
    } catch (error) {
      res.render("pages/admin/pets", { data: [], total: 0, message: "Internal Server Error" });
    }
  }
);

app.get("/admin/solicitations", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}),
  async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    try {
      const response = await fetch(`http://localhost:3001/solicitations?page=${page}&size=10`);
      const data = await response.json();
      res.render("pages/admin/solicitations", { data: data.items, total: data.total, current_page: 'pets', size: 10 });
    } catch (error) {
      res.render("pages/admin/solicitations", { data: [], total: 0, message: "Internal Server Error" });
    }
  }
);


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
