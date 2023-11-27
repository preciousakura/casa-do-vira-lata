const fs = require('fs')

function createPet(req, res) {
  const petFilePath = path.join(__dirname, "../data/pets/list.json");
  fs.readFile(petFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    try {
        const pet = JSON.parse(data);
        pet.items.push({ name, id, email, phone, role, reason: reason });
        fs.writeFile(petFilePath, JSON.stringify(pet, null, 2), "utf8", (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Não foi possível adicionar pet" });
            return res.json({ message: "Pet cadastrado com sucesso!" });  
        });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = createPet;