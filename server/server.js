const express = require("express");
const app = express();
const cors = require('cors');
const port = 3001;

const paginatedData = require('./scripts/paginated-data');

app.use(cors());
app.get('/pets', function (req, res) { return paginatedData(req, res, './data/pets/list.json') })
app.get('/users', function (req, res) { return paginatedData(req, res, './data/users/list.json') })
app.get('/solicitations', function (req, res) { return paginatedData(req, res, './data/users/solicitations.json') })

app.listen(port, () => { console.log(`Servidor rodando em http://localhost:${port}`) });