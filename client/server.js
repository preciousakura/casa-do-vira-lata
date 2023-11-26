const express = require("express");
const cookie = require("cookie-parser");
const path = require("path");
const auth = require("./auth/user");
const app = express();
const port = 3000;

app.use(cookie());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => { res.render("pages/home", { user: req.cookies.user }) });

app.get("/login", async (req, res) => {
  const email = "cinthiagatinha@gmail.com";
  const password = '12345678';

  try {
    const response = await fetch(`http://localhost:3001/usersCredentials?email=${email}&password=${password}`);
    const user = await response.json();

    if (user && user.email === email && user.password === password) {
      const name = user.name.split(' ');
      res.cookie("user", {
        name: `${name[0]} ${name[name.length - 1]}`,
        id: user.id,
        role: user.role,
        favorites: user.favorites
      });

      switch (user.role) {
        case 'USER-DEFAULT':
          res.redirect("/user-default");
          break;
        case 'ADMIN':
          res.redirect("/admin");
          break;
        case 'MODERATOR':
          res.redirect("/moderator");
          break;
        default:
          res.redirect("/"); // Redirecionar para a página inicial ou outra página padrão
      }
    } else {
      res.status(401).render("pages/login", { message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).render("pages/error", { message: "Internal Server Error" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
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

app.get("/user-default", (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }), (req, res) => {
    res.render("pages/user-default", { user: req.cookies.user });
});

app.get("/user-default/solicitation",(req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }), (req, res) => {
    res.render("pages/user-default/solicitation", { user: req.cookies.user });
});

// app.get("/user-default/adoption", async (req, res) => {
//   const petId = req.query.petId;
//   try {
//     const response = await fetch(`http://localhost:3001/pets/${petId}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch pet details");
//     }
//     const pet = await response.json();

//     res.render("pages/user-default/adoption", {
//       pet: pet,
//       user: req.cookies.user,
//     });
//   } catch (error) {
//     res.render("pages/user-default/adoption", {
//       pet: {},
//       message: "Erro ao buscar detalhes do pet",
//       user: req.cookies.user,
//     });
//   }
// });

// app.get(
//   "/user-default/my-adoptions",
//   (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }),
//   (req, res) => {
//     res.render("pages/user-default/my-adoptions", {
//       user: req.cookies.user,
//       data: mockAdoptions 
//     });
//   }
// );

app.get("/moderator", (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }), (req, res) => {
  res.render("pages/moderator", { user: req.cookies.user });
});

app.get("/moderator/animal-registration", (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }), (req, res) => {
  res.render("pages/moderator/animal-registration", { user: req.cookies.user });
});

// app.get(
//   "/moderator/solicitations-adoptions",
//   (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }),
//   (req, res) => {
//     res.render("pages/moderator/solicitations-adoptions", {
//       user: req.cookies.user,
//       data: mockAdoptionSolicitations 
//     });
//   }
// );

app.use((req, res) => {
  res.status(404).render("pages/error/not-found", { user: req.cookies.user });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
