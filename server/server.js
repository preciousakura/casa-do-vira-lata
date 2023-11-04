const express = require("express");
const app = express();
const port = 3001;

const GETPaginatedData = require('./scripts/GETPaginatedData')

app.get('/pets', function (req, res) { return GETPaginatedData(req, res, './data/pets/list.json') })

app.listen(port, () => { console.log(`Servidor rodando em http://localhost:${port}`) });