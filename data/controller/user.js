require("dotenv-safe").config({ path: '.env' })
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')

const sha512 = (pwd, key) => {
    const hash = crypto.createHmac('sha512', key)
    hash.update(pwd)
    return hash.digest('hex') 
}

function auth(req, res, next) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");  
    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const { email, password } = req.body;

            const password_crypto = sha512(password, process.env.SECRET_USER_PASSWORD)
            const users = JSON.parse(data);
            
            const found_user = users.items.find((user) => user.email === email && user.password === password_crypto);

            if(found_user) {
                const { id, name, role } = found_user;
                req.user = { id, name, role };
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
    if (!token) return res.status(401).json({ auth: false, message: 'Sem token' });
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(401).json({ auth: false, message: 'Falha na autenticação' });
      const { id, name, role } = decoded;
      req.user = { id, name, role };
      req.token = token;
      next();
    });
}

function register(req, res) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");  
    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const { name, phone, email, password } = req.body;

            const password_crypto = sha512(password, process.env.SECRET_USER_PASSWORD)

            const users = JSON.parse(data);
            const found_user = users.items.find((user) => user.email === email);

            if(found_user) return res.status(500).json({ error: "Este e-mail já está associado a um usuário cadastrado." });

            users.items.push({ id: uuidv4(), name, phone, email, password: password_crypto, role: 'USER-DEFAULT', favorites: [] })

            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8", err => {
                if (err) return res.status(500).json({ error: "Internal Server Error" });
                return res.json({ message: "Usuário cadastrado com sucesso" });
            });

        } catch (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    })
}

module.exports = { auth, verifyJWT, register }