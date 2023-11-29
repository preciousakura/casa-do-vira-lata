const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const pagination = require('../utils/paginated-data')

function verifyPermission(req, res) {  
    const solicitationsFilePath = path.join(__dirname, "../data/users/solicitations.json");
    fs.readFile(solicitationsFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      try {
        const jsonData = JSON.parse(data);
        const { id, role } = req.user;
        const user = jsonData.items.find((item) => item.id === id);
        if(user) return res.json({ message: "Parece que você já fez essa solicitação. Por favor, aguarde, o pedido ainda está sendo avaliado pela administração." });
        else if(role === "USER-DEFAULT") return res.json({ permission: true });
        else return res.json({ permission: false });
  
      } catch (parseError) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
}
  
function addSolicitation(req, res) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");
    const solicitationsFilePath = path.join(__dirname, "../data/users/solicitations.json");
  
    fs.readFile(usersFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
    
      try {
        const { reason } = req.body;
        const users = JSON.parse(data);

        const { id } = req.user;

        const user = users.items.find((item) => item.id == id);

        if(user && user.role !== 'USER-DEFAULT') return res.status(401).json({ error: "Você não tem permissão para fazer essa solicitação." });
        else if(user) {
          fs.readFile(solicitationsFilePath, "utf8", (solicitationsErr, solicitationsData) => {
            if (solicitationsErr) return res.status(500).json({ error: "Internal Server Error" });
          
            try {
              const solicitations = JSON.parse(solicitationsData);

              const { id: userId } = req.user;
              const solicitation_user = solicitations.items.find((item) => item.id == userId);
              if(solicitation_user) return res.status(500).json({ error: "Já há uma solicitação em processamento. Por favor, aguarde" });

              const { name, id, email, phone, role } = user;
              solicitations.items.push({ name, id, email, phone, role, reason: reason });
              fs.writeFile(solicitationsFilePath, JSON.stringify(solicitations, null, 2), "utf8", (writeErr) => {
                if (writeErr) return res.status(500).json({ error: "Não foi possível salvar sua solicitação." });
                return res.json({ message: "Solicitação realizada com sucesso!" });  
              });
            } catch (parseError) {
              return res.status(500).json({ error: "Internal Server Error" });
            }
          });
        }
        else res.status(500).json({ error: "Usuário não encontrado." }); 
      } catch (parseError) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
}

function listUserAdoptions(req, res) {
    const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");

    const page = Number(req.query.page ? req.query.page : 1);
    const size = Number(req.query.size ? req.query.size : 10);

    fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const { id } = req.user;
            const jsonData = JSON.parse(data);
            const adoptions = jsonData.items.filter(adoption => adoption.userId === id);
            return res.json(pagination({ items: adoptions }, page, size));
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

module.exports = { listUserAdoptions, verifyPermission, addSolicitation };
