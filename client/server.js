const express = require("express");
const path = require("path");
let cookie = require("cookie-parser");
const auth = require("./auth/user");
const app = express();
const port = 3000;

app.use(cookie());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");



app.get("/", (req, res) => {
  res.render("pages/home", { user: req.cookies.user });
});

app.get("/login", async (req, res) => {
  const email = "cinthiagatinha@gmail.com";
  const password = '12345678';

  try {
    const response = await fetch(`http://localhost:3001/usersCredentials?email=${email}&password=${password}`);
    const user = await response.json();

    if (user && user.email === email && user.password === password) {
      res.cookie("user", {
        name: user.name,
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
    console.error("Login error:", error);
    res.status(500).render("pages/error", { message: "Internal Server Error" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

app.get("/pets", async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  try {
    const response = await fetch(
      `http://localhost:3001/pets?page=${page}&size=9`
    );
    const data = await response.json();
    res.render("pages/pets", {
      data: data.items,
      total: data.total,
      current_page: "pets",
      size: 9,
      page: page,
      user: req.cookies.user,
    });
  } catch (error) {
    res.render("pages/pets", {
      data: [],
      total: 0,
      message: "Internal Server Error",
      user: req.cookies.user,
    });
  }
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
  async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    try {
      const response = await fetch(
        `http://localhost:3001/users?page=${page}&size=10`
      );
      const data = await response.json();
      res.render("pages/admin/users", {
        data: data.items,
        total: data.total,
        current_page: "users",
        size: 10,
        page: page,
        user: req.cookies.user,
      });
    } catch (error) {
      res.render("pages/admin/users", {
        data: [],
        total: 0,
        message: "Internal Server Error",
        user: req.cookies.user,
      });
    }
  }
);

app.get(
  "/admin/pets",
  (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }),
  async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    try {
      const response = await fetch(
        `http://localhost:3001/pets?page=${page}&size=10`
      );
      const data = await response.json();
      res.render("pages/admin/pets", {
        data: data.items,
        total: data.total,
        current_page: "pets",
        size: 10,
        page: page,
        user: req.cookies.user,
      });
    } catch (error) {
      res.render("pages/admin/pets", {
        data: [],
        total: 0,
        message: "Internal Server Error",
        user: req.cookies.user,
      });
    }
  }
);

app.get(
  "/admin/solicitations",
  (req, res, next) => auth(req, res, next, { allowed: ["ADMIN"] }),
  async (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    try {
      const response = await fetch(
        `http://localhost:3001/solicitations?page=${page}&size=10`
      );
      const data = await response.json();
      res.render("pages/admin/solicitations", {
        data: data.items,
        total: data.total,
        current_page: "pets",
        size: 10,
        page: page,
        user: req.cookies.user,
      });
    } catch (error) {
      res.render("pages/admin/solicitations", {
        data: [],
        total: 0,
        message: "Internal Server Error",
        user: req.cookies.user,
      });
    }
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
  (req, res) => {
    res.render("pages/user-default/solicitation", { user: req.cookies.user });
  }
);
app.get("/user-default/adoption", async (req, res) => {
  const petId = req.query.petId;
  try {
    const response = await fetch(`http://localhost:3001/pets/${petId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pet details");
    }
    const pet = await response.json();

    res.render("pages/user-default/adoption", {
      pet: pet,
      user: req.cookies.user,
    });
  } catch (error) {
    res.render("pages/user-default/adoption", {
      pet: {},
      message: "Erro ao buscar detalhes do pet",
      user: req.cookies.user,
    });
  }
});
const mockAdoptions = [
  {
    petName: "Bolinha",
    adoptionDate: "2023-01-15",
    status: "Concluída"
  },
  {
    petName: "Rex",
    adoptionDate: "2023-02-20",
    status: "Em Processamento"
  },

];
app.get(
  "/user-default/my-adoptions",
  (req, res, next) => auth(req, res, next, { allowed: ["USER-DEFAULT"] }),
  (req, res) => {
    res.render("pages/user-default/my-adoptions", {
      user: req.cookies.user,
      data: mockAdoptions 
    });
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
const mockAdoptionSolicitations = [
  {
    id: 1,
    candidateName: "João Silva",
    petName: "Bolinha",
    date: "2023-03-01"
  },
  {
    id: 2,
    candidateName: "Maria Oliveira",
    petName: "Rex",
    date: "2023-03-05"
  },
];
app.get(
  "/moderator/solicitations-adoptions",
  (req, res, next) => auth(req, res, next, { allowed: ["MODERATOR"] }),
  (req, res) => {
    res.render("pages/moderator/solicitations-adoptions", {
      user: req.cookies.user,
      data: mockAdoptionSolicitations 
    });
  }
);
app.use((req, res) => {
  res.status(404).render("pages/error/not-found", {
    data: [],
    total: 0,
    message: "Internal Server Error",
    user: req.cookies.user,
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
