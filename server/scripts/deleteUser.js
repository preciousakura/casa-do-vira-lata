// server/scripts/deleteUser.js

const fs = require("fs");
const path = require("path");

function deleteUser(req, res) {
  const userId = parseInt(req.params.userId);
  const usersFilePath = path.join(__dirname, "../data/users/list.json");

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    try {
      let usersData = JSON.parse(data);
      usersData.items = usersData.items.filter(user => user.id !== userId);

      fs.writeFile(usersFilePath, JSON.stringify(usersData, null, 2), "utf8", (writeErr) => {
        if (writeErr) {
          console.error("Error writing to users file:", writeErr);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        res.json({ message: "User removed successfully" });
      });
    } catch (parseError) {
      console.error("Error parsing users JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = deleteUser;
