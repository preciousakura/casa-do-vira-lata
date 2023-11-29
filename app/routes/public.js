const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/public", { user: req.cookies.user });
});

router.get("/login", (req, res) => {
  if(req.cookies.user) res.redirect('/');

  const { message } = req.query;
  if(message) return res.render("pages/public/login", { message });
  
  res.render("pages/public/login");
});

router.post("/login", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (response.ok) {
      const name = data.user.name.split(" ");
      res.cookie("user", {
        ...data.user,
        token: data.token,
        name: `${name[0]} ${name[name.length - 1]}`
      });
      switch (data.user.role) {
        case "USER-DEFAULT":
          res.redirect("/user-default");
          break;
        case "ADMIN":
          res.redirect("/admin");
          break;
        case "MODERATOR":
          res.redirect("/moderator");
          break;
        default:
          res.redirect("/");
      }
    } else {
      res.render("pages/public/login", { error: data.error, data: req.body });
    }
  } catch (err) {
    res.render("pages/public/login", { error: err.error, data: req.body });
  }
});

router.get("/logout", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      res.clearCookie("user");
      localStorage.removeItem('favorites')
    } 
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

router.get("/register", (req, res) => {
  if(req.cookies.user) res.redirect('/')
  res.render("pages/public/register");
});

router.post("/register", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if(response.ok) {
      const message = data.message
      res.redirect(`/login?message=${message}`)
    }

    res.render("pages/public/register", { error: data.error, data: req.body });
  } catch (err) {
    res.render("pages/public/register", { error: "Erro ao fazer o cadastro. Tente novamente mais tarde.", data: req.body });
  }
});

module.exports = router;
