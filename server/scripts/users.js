const fs = require('fs');
const path = require('path');

function findUserByCredentials(email, password, callback) {
  const usersFilePath = path.join(__dirname, '../data/users/list.json');

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return callback(err, null);
    }

    try {
      const users = JSON.parse(data).items;
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        callback(null, user);
      } else {
        callback(new Error('User not found'), null);
      }
    } catch (parseError) {
      console.error('Error parsing users JSON:', parseError);
      return callback(parseError, null);
    }
  });
}

module.exports = findUserByCredentials;
