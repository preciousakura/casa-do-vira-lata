const express = require("express");
const cookie = require("cookie-parser");
const bp = require("body-parser");
const path = require("path");
const auth = require("./auth/user");
const app = express();
const port = 3000;

app.use(cookie());
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/home", { user: req.cookies.user });
});

app.get("/login", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.stringify(req.cookies.user.token),
      },
    });

    const data = await response.json();
    console.log(data, req.cookies.user.token);
    res.render("pages/login");
  } catch (err) {
    console.log(err);
    res.render("pages/login");
  }
});

app.get("/signup", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.stringify(req.cookies.user.token),
      },
    });

    const data = await response.json();
    console.log(data, req.cookies.user.token);
    res.render("pages/login/signup");
  } catch (err) {
    console.log(err);
    res.render("pages/login/signup");
  }
});

app.post("/login", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (response.ok) {
      const name = data.user.name.split(" ");
      res.cookie("user", {
        token: data.token,
        name: `${name[0]} ${name[name.length - 1]}`,
        id: data.user.id,
        role: data.user.role,
        favorites: data.user.favorites,
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
          res.redirect("/"); // Redirecionar para a página inicial ou outra página padrão
      }
    } else {
      res.render("pages/login", { error: data.error });
    }
  } catch (err) {
    res.render("pages/login", { error: err.error });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

app.get("/pets", (req, res) => {
  res.render("pages/pets", { user: req.cookies.user });
});

app.get(
  "/admin",
  (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }),
  (req, res) => {
    res.render("pages/admin", { user: req.cookies.user });
  }
);

app.get(
  "/admin/users",
  (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }),
  (req, res) => {
    res.render("pages/admin/users", { user: req.cookies.user });
  }
);

app.get(
  "/admin/pets",
  (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }),
  (req, res) => {
    res.render("pages/admin/pets", { user: req.cookies.user });
  }
);

app.get(
  "/admin/solicitations",
  (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }),
  (req, res) => {
    res.render("pages/admin/solicitations", { user: req.cookies.user });
  }
);

app.get(
  "/user-default",
  (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }),
  (req, res) => {
    res.render("pages/user-default", { user: req.cookies.user });
  }
);

app.get(
  "/user-default/solicitation",
  (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }),
  async (req, res) => {
    try {
      const { id, role } = req.cookies.user;
      const response = await fetch(
        `http://localhost:3001/verify-moderator?id=${id}&role=${role}`
      );
      const data = await response.json();
      if (data.message || !data.permission)
        res.render("pages/error/solicitation-reject", {
          user: req.cookies.user,
        });
      else if (data.permission)
        res.render("pages/user-default/solicitation", {
          user: req.cookies.user,
        });
    } catch (err) {
      res.render("pages/error/solicitation-reject", { user: req.cookies.user });
    }
  }
);

app.get(
  "/user-default/adoption",
  (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }),
  async (req, res) => {
    const { petId } = req.query;
    try {
      const response = await fetch(`http://localhost:3001/pets/${petId}`);
      if (!response.ok) throw new Error("Failed to fetch pet details");

      const data = await response.json();
      res.render("pages/user-default/adoption", {
        pet: data,
        user: req.cookies.user,
      });
    } catch (error) {
      res.render("pages/user-default/adoption", {
        pet: {},
        message: "Erro ao buscar detalhes do pet",
        user: req.cookies.user,
      });
    }
  }
);

app.get(
  "/user-default/my-adoptions",
  (req, res, next) => {
    auth(req, res, next, { allowed: ["USER-DEFAULT"] });
  },
  async (req, res) => {
    const userId = req.cookies.user.id; // Obter o ID do usuário dos cookies
    try {
      const response = await fetch(
        `http://localhost:3001/user/${userId}/adoptions`
      );
      if (!response.ok) {
        throw new Error("Falha ao buscar adoções");
      }
      const adoptions = await response.json();
      res.render("pages/user-default/my-adoptions", {
        user: req.cookies.user,
        adoptions: adoptions,
      });
    } catch (error) {
      console.error("Erro ao carregar adoções:", error);
      res.render("pages/user-default/my-adoptions", {
        user: req.cookies.user,
        adoptions: [],
        error: "Erro ao carregar adoções.",
      });
    }
  }
);

app.get(
  "/moderator",
  (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }),
  (req, res) => {
    res.render("pages/moderator", { user: req.cookies.user });
  }
);

app.get(
  "/moderator/animal-registration",
  (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }),
  (req, res) => {
    res.render("pages/moderator/animal-registration", {
      user: req.cookies.user,
    });
  }
);

app.get(
  "/moderator/solicitations-adoptions",
  (req, res, next) => {
    auth(req, res, next, { allowed: ["MODERATOR"] });
  },
  async (req, res) => {
    try {
      const response = await fetch(`http://localhost:3001/adoptions`);
      const adoptions = await response.json();
      res.render("pages/moderator/solicitations-adoptions", {
        user: req.cookies.user,
        data: adoptions.items,
      });
    } catch (error) {
      console.error("Error fetching adoptions:", error);
      res.render("pages/moderator/solicitations-adoptions", {
        user: req.cookies.user,
        data: [],
        error: "Erro ao carregar solicitações de adoções.",
      });
    }
  }
);

app.use((req, res) => {
  res.status(404).render("pages/error/not-found", { user: req.cookies.user });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
