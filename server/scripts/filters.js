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

module.exports = findPetById;
