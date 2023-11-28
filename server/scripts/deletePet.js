const fs = require("fs");
const path = require("path");

function deletePet(req, res) {
  const petId = parseInt(req.params.petId);
  const petsFilePath = path.join(__dirname, "../data/pets/list.json");

  fs.readFile(petsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading pets file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    try {
      let petsData = JSON.parse(data);
      petsData.items = petsData.items.filter(pet => pet.id !== petId);

      fs.writeFile(petsFilePath, JSON.stringify(petsData, null, 2), "utf8", (writeErr) => {
        if (writeErr) {
          console.error("Error writing to pets file:", writeErr);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        res.json({ message: "pet removed successfully" });
      });
    } catch (parseError) {
      console.error("Error parsing pets JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = deletePet;
