const fs = require("fs");
const path = require("path");
require("dotenv-safe").config({ path: '.env' })
const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");  
    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const { email, password } = req.body;
            const users = JSON.parse(data);
            const found_user = users.items.find((user) => user.email === email && user.password === password);
            if(found_user) {
                req.user = found_user;
                next();
            }
            else res.status(500).json({ error: "E-mail ou senha inválidos." });
        } catch (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    })
}

function verifyJWT(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      req.user = decoded;
      next();
    });
}

module.exports = { auth, verifyJWT }