const fs = require("fs");
const path = require("path");

function acceptModerator(req, res) {
  const userId = parseInt(req.params.userId);
  const usersFilePath = path.join(__dirname, "../data/users/list.json");
  const solicitationsFilePath = path.join(
    __dirname,
    "../data/users/solicitations.json"
  );

  // Atualizar a role do usuário em list.json
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    try {
      let users = JSON.parse(data);
      const userIndex = users.items.findIndex((user) => user.id == userId);

      if (userIndex == -1) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      users.items[userIndex].role = "MODERATOR";

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

          // Remover usuário de solicitations.json
          fs.readFile(
            solicitationsFilePath,
            "utf8",
            (solicitErr, solicitData) => {
              if (solicitErr) {
                console.error("Error reading solicitations file:", solicitErr);
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }

              try {
                let solicitations = JSON.parse(solicitData);
                solicitations.items = solicitations.items.filter(
                  (item) => item.id != userId
                );

                fs.writeFile(
                  solicitationsFilePath,
                  JSON.stringify(solicitations, null, 2),
                  "utf8",
                  (writeSolicitErr) => {
                    if (writeSolicitErr) {
                      console.error(
                        "Error writing to solicitations file:",
                        writeSolicitErr
                      );
                      res.status(500).json({ error: "Internal Server Error" });
                      return;
                    }
                    res.json({
                      message:
                        "Moderator request accepted and user removed from solicitations",
                    });
                  }
                );
              } catch (parseSolicitError) {
                console.error(
                  "Error parsing solicitations JSON:",
                  parseSolicitError
                );
                res.status(500).json({ error: "Internal Server Error" });
              }
            }
          );
        }
      );
    } catch (parseError) {
      console.error("Error parsing users JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

function rejectModerator(req, res) {
  const userId = parseInt(req.params.userId);
  const solicitationsFilePath = path.join(
    __dirname,
    "../data/users/solicitations.json"
  );

  fs.readFile(solicitationsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    try {
      let solicitations = JSON.parse(data);
      solicitations.items = solicitations.items.filter(
        (user) => user.id != userId
      );

      fs.writeFile(
        solicitationsFilePath,
        JSON.stringify(solicitations, null, 2),
        "utf8",
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing to the file:", writeErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }
          res.json({
            message:
              "Moderator request rejected and user removed from solicitations",
          });
        }
      );
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

function acceptAllModerators(req, res) {
  const usersFilePath = path.join(__dirname, "../data/users/list.json");
  const solicitationsFilePath = path.join(
    __dirname,
    "../data/users/solicitations.json"
  );

  fs.readFile(usersFilePath, "utf8", (err, usersData) => {
    if (err) {
      console.error("Error reading users file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    fs.readFile(solicitationsFilePath, "utf8", (solicitErr, solicitData) => {
      if (solicitErr) {
        console.error("Error reading solicitations file:", solicitErr);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      try {
        let users = JSON.parse(usersData);
        let solicitations = JSON.parse(solicitData);

        solicitations.items.forEach((solicitation) => {
          const userIndex = users.items.findIndex(
            (user) => user.id == solicitation.id
          );
          if (userIndex != -1) {
            users.items[userIndex].role = "MODERATOR";
          }
        });

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

            // Limpa o arquivo de solicitações após aceitar todas
            solicitations.items = [];
            fs.writeFile(
              solicitationsFilePath,
              JSON.stringify(solicitations, null, 2),
              "utf8",
              (writeSolicitErr) => {
                if (writeSolicitErr) {
                  console.error(
                    "Error writing to solicitations file:",
                    writeSolicitErr
                  );
                  res.status(500).json({ error: "Internal Server Error" });
                  return;
                }
                res.json({ message: "All moderator requests accepted" });
              }
            );
          }
        );
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  });
}

function rejectAllModerators(req, res) {
  const solicitationsFilePath = path.join(
    __dirname,
    "../data/users/solicitations.json"
  );

  fs.writeFile(
    solicitationsFilePath,
    JSON.stringify({ items: [] }, null, 2),
    "utf8",
    (writeErr) => {
      if (writeErr) {
        console.error("Error writing to the file:", writeErr);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json({ message: "All moderator requests rejected" });
    }
  );
}

module.exports = {
  acceptModerator,
  rejectModerator,
  acceptAllModerators,
  rejectAllModerators,
};
