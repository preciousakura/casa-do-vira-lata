const express = require("express");
const router = express.Router();

const usersData = [
  {
    id: 1,
    name: "Exemplo Nome",
    email: "exemplo@email.com",
    phone: "(123) 456-7890",
    username: "exemplo_usuario",
  },
];
const pets = [
  { name: "Rex", type: "Cachorro", gender: "Macho", size: "Grande" },
];
const solicitations = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@example.com",
    status: "Pendente",
  },
];
const userInfo = {
  id: 1,
  name: "Isabel Cristina",
  email: "isabel@example.com",
  phone: "123-456-7890",
  role: "Colaborador", //  campo pode vir do banco de dados ou outro serviço
};

router.get("/", (req, res) => {
  res.render("index", { userName: "Visitante" });
});

router.get("/adm-users", (req, res) => {
  res.render("admin-users", { users: usersData });
});

router.get("/adm-home", (req, res) => {
  res.render("adm-home", { username: "Isabel" });
});

router.get("/adm-pets", (req, res) => {
  res.render("adm-pets", { pets: pets });
});

router.get("/adm-infos-user", (req, res) => {
  res.render("adm-infos-user", { user: userInfo });
});

router.get("/adm-solicit", (req, res) => {
  res.render("adm-solicit", { solicitations: solicitations });
});

router.get("/list", (req, res) => {
  res.render("list", {
    pets: [
      {
        name: "Dina",
        age: "1 ano",
        image: "images/cat-2.png",
        gender: "Fêmea",
        castrated: true,
        vaccinated: true,
        dewormed: true,
      },
    ],
  });
});

router.get("/adm-infos-users", (req, res) => {
  res.render("adm-infos-users", {
    title: "Casa do Vira-Lata - Administração do usuário",
    user: {
      imageUrl: "images/taylor.jpg",
      role: "Colaborador",
      infos: [
        { label: "Nome do usuário", value: "Isabel Cristina" },
        { label: "Telefone", value: "123-456-7890" },
        { label: "Email", value: "usuario@email.com" },
      ],
    },
    authors: ["Isabel Cristina", "Cinthia Andrade"],
  });
});

module.exports = router;
