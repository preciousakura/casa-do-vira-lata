const express = require("express");
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const user = require('./routes/user');
const user_default = require('./routes/user-default');
const pets = require('./routes/pets');
const admin = require('./routes/admin');

app.use('/user', user);
app.use('/user-default', user_default);
app.use('/pets', pets);
app.use('/admin', admin);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
