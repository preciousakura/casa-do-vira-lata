const fs = require("fs");
const path = require("path");

const pagination = require('../utils/paginated-data')

function listUser(req, res) {
    const page = Number(req.query.page ? req.query.page : 1);
    const size = Number(req.query.size ? req.query.size : 10);

    const usersFilePath = path.join(__dirname, "../data/users/list.json");
    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const users = JSON.parse(data);
            const { id } = req.user;
            const usersFiltered = users.items.filter(item => item.id != id).map(item => { 
                const user = item;
                delete user.password
                return user
            })
            return res.json(pagination({ items: usersFiltered }, page, size));
        } catch (parseError) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

function deleteUser(req, res) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");
  
    fs.readFile(usersFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      try {
        const usersData = JSON.parse(data);
        const { userId } = req.query
        usersData.items = usersData.items.filter(user => user.id !== userId);
  
        fs.writeFile(usersFilePath, JSON.stringify(usersData, null, 2), "utf8", (writeErr) => {
          if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
          res.json({ message: "User removed successfully" });
        });
      } catch (parseError) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
}

function listSolicitations(req, res) {
  const page = Number(req.query.page ? req.query.page : 1);
  const size = Number(req.query.size ? req.query.size : 10);

  const solicitationFilePath = path.join(__dirname, "../data/users/solicitations.json");
  fs.readFile(solicitationFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      try {
          const solicitations = JSON.parse(data);
          return res.json(pagination(solicitations, page, size));
      } catch (parseError) {
          res.status(500).json({ error: "Internal Server Error" });
      }
  });
}

function acceptSolicitation(req, res) {
  const usersFilePath = path.join(__dirname, "../data/users/list.json");
  const solicitationsFilePath = path.join(__dirname, "../data/users/solicitations.json");

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    try {
      const users = JSON.parse(data);
      const { userId } = req.query;
      const userIndex = users.items.findIndex((user) => user.id == userId);

      if (userIndex == -1) return res.status(404).json({ error: "User not found" });
      users.items[userIndex].role = "MODERATOR";

      fs.writeFile( usersFilePath, JSON.stringify(users, null, 2), "utf8", (writeErr) => {
          if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
          fs.readFile( solicitationsFilePath, "utf8", (solicitErr, solicitData) => {
              if (solicitErr) return res.status(500).json({ error: "Internal Server Error" });

              try {
                const solicitations = JSON.parse(solicitData);
                solicitations.items = solicitations.items.filter((item) => item.id != userId);

                fs.writeFile( solicitationsFilePath, JSON.stringify(solicitations, null, 2), "utf8", (writeSolicitErr) => {
                    if (writeSolicitErr) return res.status(500).json({ error: "Internal Server Error" });
                    return res.json({ message: "Moderator request accepted and user removed from solicitations" });
                });
              } catch (parseSolicitError) {
                return res.status(500).json({ error: "Internal Server Error" });
              }
          });
      });
    } catch (parseError) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

function rejectSolicitation(req, res) {
  const solicitationsFilePath = path.join(__dirname, "../data/users/solicitations.json");

  fs.readFile(solicitationsFilePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    try {
      const solicitations = JSON.parse(data);
      const { userId } = req.query;
      solicitations.items = solicitations.items.filter((user) => user.id != userId);

      fs.writeFile( solicitationsFilePath, JSON.stringify(solicitations, null, 2), "utf8", (writeErr) => {
          if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
          res.json({ message: "Moderator request rejected and user removed from solicitations" });
      });
    } catch (parseError) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

function acceptAll(req, res) {
  const usersFilePath = path.join(__dirname, "../data/users/list.json");
  const solicitationsFilePath = path.join(__dirname, "../data/users/solicitations.json");

  fs.readFile(usersFilePath, "utf8", (err, usersData) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    fs.readFile(solicitationsFilePath, "utf8", (solicitErr, solicitData) => {
      if (solicitErr) return res.status(500).json({ error: "Internal Server Error" });

      try {
        const users = JSON.parse(usersData);
        const solicitations = JSON.parse(solicitData);

        solicitations.items.forEach((solicitation) => {
          const userIndex = users.items.findIndex((user) => user.id == solicitation.id);
          if (userIndex != -1) users.items[userIndex].role = "MODERATOR";
        });

        fs.writeFile( usersFilePath, JSON.stringify(users, null, 2), "utf8", (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
          
            solicitations.items = [];

            fs.writeFile( solicitationsFilePath, JSON.stringify(solicitations, null, 2), "utf8", (writeSolicitErr) => {
                if (writeSolicitErr) return res.status(500).json({ error: "Internal Server Error" });
                return res.json({ message: "All moderator requests accepted" });
            });
        });
      } catch (parseError) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  });
}

function rejectAll(req, res) {
  const solicitationsFilePath = path.join(__dirname, "../data/users/solicitations.json");

  fs.writeFile( solicitationsFilePath, JSON.stringify({ items: [] }, null, 2), "utf8", (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
      return res.json({ message: "All moderator requests rejected" });
    }
  );
}

module.exports = { listUser, deleteUser, listSolicitations, acceptSolicitation, rejectSolicitation, acceptAll, rejectAll };
