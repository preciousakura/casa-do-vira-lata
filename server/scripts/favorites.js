const fs = require("fs");
const path = require("path");

function addFavorite(req, res) {
  const userId = parseInt(req.params.userId);
  const petId = parseInt(req.body.petId);
  const usersFilePath = path.join(__dirname, "../data/users/list.json");

  // Ler o arquivo JSON dos usuários
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    try {
      let users = JSON.parse(data);
      const userIndex = users.items.findIndex((user) => user.id == userId);

      if (userIndex === -1) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Adicionar o petId à lista de favoritos do usuário
      let user = users.items[userIndex];
      user.favorites = user.favorites || [];
      if (!user.favorites.includes(petId)) {
        user.favorites.push(petId);
      }

      // Salvar as alterações de volta no arquivo JSON
      fs.writeFile(
        usersFilePath,
        JSON.stringify(users, null, 2),
        "utf8",
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing to users file:", writeErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          res.json({
            message: "Pet added to favorites successfully",
            user: {
              id: user.id,
              name: user.name,
              role: user.role,
              favorites: user.favorites,
            },
          });
        }
      );
    } catch (parseError) {
      console.error("Error parsing users JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
function removeFavorite(req, res) {
  const userId = parseInt(req.params.userId);
  const petId = parseInt(req.body.petId);
  const usersFilePath = path.join(__dirname, "../data/users/list.json");

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    try {
      let users = JSON.parse(data);
      const userIndex = users.items.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // remove o petId da lista de favoritos do usuário
      let user = users.items[userIndex];
      user.favorites = user.favorites || [];
      user.favorites = user.favorites.filter(
        (favoritePetId) => favoritePetId !== petId
      );

      // salva as alterações no arquivo JSON
      fs.writeFile(
        usersFilePath,
        JSON.stringify(users, null, 2),
        "utf8",
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing to users file:", writeErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          res.json({
            message: "Pet removed from favorites successfully",
            user: {
              id: user.id,
              name: user.name,
              role: user.role,
              favorites: user.favorites,
            },
          });
        }
      );
    } catch (parseError) {
      console.error("Error parsing users JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = { addFavorite, removeFavorite };
