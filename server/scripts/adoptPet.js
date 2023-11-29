const fs = require("fs");
const path = require("path");


function findElementById(path, id) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          reject(err);
          return;
        }
  
        const jsonData = JSON.parse(data);
        const obj = jsonData.items.find((item) => Number(item.id) === Number(id));
        if (obj) resolve(obj);
        else reject(null);
      });
    });
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() retorna de 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function adoptPet(req, res) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");
    const petsFilePath = path.join(__dirname, "../data/pets/list.json");
    const adoptFilePath = path.join(__dirname, "../data/pets/adoptions.json");

    const { userId, petId } = req.query;
    
    if(!userId || !petId) return res.status(500).json({ error: "O id do usuário e do pet são obrigátorios para a solicitação de adoção." });
    
    const user = await findElementById(usersFilePath, userId);
    const pet = await findElementById(petsFilePath, petId);
    if(user || pet) {
        fs.readFile(adoptFilePath, "utf8", (err, data) => {
            if (err) return res.status(500).json({ error: "Internal Server Error" });
            
            try {
                const adoptions = JSON.parse(data);
                const verify_exists = adoptions.items.find((item) => { return item.userId === Number(userId) && item.petId === Number(petId) });
                if(verify_exists) return res.status(500).json({ error: "Já existe uma solicitação desse usuário para este pet." });
                
                adoptions.items.push({ status:'Em processo',  ...req.body,userId: Number(userId), petId: petId,  
                    ...pet, id: `${petId}${userId}`,  date: formatDate(new Date())});
                fs.writeFile(adoptFilePath, JSON.stringify(adoptions, null, 2), "utf8", (writeErr) => {
                    if (writeErr) return res.status(500).json({ error: "Não foi possível salvar sua solicitação." });
                    return res.json({ message: "Solicitação realizada com sucesso!" });  
                });
            } catch (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        })

    } else return res.status(500).json({ error: "Usuário ou pet não encontrados" });
}

module.exports = adoptPet;
