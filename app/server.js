const express = require("express");
const cookie = require("cookie-parser");

const bp = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.use(cookie());

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); 

const public_routes = require('./routes/public');
const user_default_routes = require('./routes/user-default');
const pets_routes = require('./routes/pets');
const moderator_routes = require('./routes/moderator');
const admin_routes = require('./routes/admin');

app.use('/', public_routes);
app.use('/user-default', user_default_routes);
app.use('/pets', pets_routes);
app.use('/moderator', moderator_routes);
app.use('/admin', admin_routes);

app.use((req, res) => { res.status(404).render("pages/error/not-found", { user: req.cookies.user }) });
app.use((req, res) => { res.status(401).render("pages/error/unauthorized", { user: req.cookies.user }) });


app.listen(port, () => { console.log(`Servidor rodando em http://localhost:${port}`) });
