const fs = require("fs");
const path = require("path");

function addSolicitation(userId, reason, callback) {
  const usersFilePath = path.join(__dirname, "../data/users/list.json");
  const solicitationsFilePath = path.join(__dirname, "../data/users/solicitations.json");

  fs.readFile(usersFilePath, "utf8", (err, usersData) => {
    if (err) return callback(err);
    
    try {
      const users = JSON.parse(usersData);
      const user = users.items.find((u) => u.id == userId);

      if (!user) return callback(new Error("Usuário não encontrado"))

      fs.readFile(solicitationsFilePath, "utf8", (solicitErr, solicitData) => {
        if (solicitErr) return callback(solicitErr);

        try {
          const solicitations = JSON.parse(solicitData);
          solicitations.items.push({
            name: user.name,
            id: userId,
            email: user.email,
            phone: user.phone,
            reason: reason,
          });

          fs.writeFile(
            solicitationsFilePath,
            JSON.stringify(solicitations, null, 2),
            "utf8",
            (writeErr) => {
              if (writeErr) {
                return callback(writeErr);
              }
              callback(null, "Solicitação realizada com sucesso!");
            }
          );
        } catch (parseSolicitError) {
          callback(parseSolicitError);
        }
      });
    } catch (parseError) {
      callback(parseError);
    }
  });
}

module.exports = addSolicitation;
