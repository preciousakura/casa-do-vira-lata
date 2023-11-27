const fs = require('fs');
const path = require('path');
const { sha512 } = require('./utils');

function registerUser(req, res) {
    const { name, email, phone, password } = req.body;
    const hashedPassword = sha512(password);
    
    const usersFilePath = path.join(__dirname, '../data/users/list.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    
    const userIds = users.map(user => user.id);
    const maxId = userIds.length > 0 ? Math.max(...userIds) : 0;
    
    const newUser = {
        id: maxId + 1,
        name,
        email,
        phone,
        password: hashedPassword,
        role: "USER-DEFAULT",
        favorites: []
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.redirect('/login');
}

module.exports = registerUser;