const express = require("express");
const app = express();
const port = 3001;

const paginatedData = require('./scripts/paginated-data')

app.get('/pets', function (req, res) { return paginatedData(req, res, './data/pets/list.json') })

app.listen(port, () => { console.log(`Servidor rodando em http://localhost:${port}`) });