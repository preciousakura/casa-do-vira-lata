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
  res.render("pages/home", { user: req.cookies.user }) 
});

app.get("/login", (req, res) => { 
  const name = user.name.split(' ');
  res.cookie("user", { name: `${name[0]} ${name[name.length - 1]}`, role: user.role });
  res.render("pages/login") 
});

app.get("/logout", (req, res) => { 
  res.clearCookie('user');
  res.redirect("/") 
});

app.get("/pets", (req, res) => {
  res.render("pages/pets", { user: req.cookies.user });
});

app.get("/admin", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}), (req, res) => {
  res.render("pages/admin", { user: req.cookies.user });
});

app.get("/admin/users", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}), (req, res) => {
  res.render("pages/admin/users", { user: req.cookies.user });
});

app.get("/admin/pets", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}), (req, res) => {
  res.render("pages/admin/pets", { user: req.cookies.user });
});

app.get("/admin/solicitations", (req, res, next) => auth(req, res, next, {allowed: ["ADMIN"]}), (req, res) => {
  res.render("pages/admin/solicitations", { user: req.cookies.user });
});

app.use((req, res) => {
  res.status(404).render("pages/error/not-found", { user: req.cookies.user });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
