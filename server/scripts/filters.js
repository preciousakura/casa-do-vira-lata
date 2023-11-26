const fs = require("fs");

function findPetById(req, res, path) {
  const petId = req.params.petId;
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const pet = jsonData.items.find((pet) => pet.id == petId);
      if (pet) {
        res.json(pet);
      } else {
        res.status(404).json({ error: "Pet not found" });
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

function filterPets(req, res, path) {
  const { type, size, gender, castrated, vaccinated, dewormed, name } = req.query;

  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      let filteredPets = jsonData.items;
      // Aplicar filtros
      if (type !=='Todos') filteredPets = filteredPets.filter(pet => pet.type === type);

      if (size !=='Todos') filteredPets = filteredPets.filter(pet => pet.size === size);

      if (gender !=='Todos') filteredPets = filteredPets.filter(pet => pet.gender === gender);

      if (castrated === 'true') filteredPets = filteredPets.filter(pet => pet.castrated === (castrated === 'true'));

      if (vaccinated === 'true') filteredPets = filteredPets.filter(pet => pet.vaccinated === (vaccinated === 'true'));
      if (dewormed === 'true') filteredPets = filteredPets.filter(pet => pet.dewormed === (dewormed === 'true'));

      if (name !=='Todos') {
        filteredPets = filteredPets.filter(pet =>
          pet.name.toLowerCase().startsWith(name.toLowerCase())
        );
      }

      res.json(filteredPets);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = {
  findPetById,
  filterPets
};

