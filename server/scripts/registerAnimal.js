const fs = require("fs");
const path = require("path");

function registerAnimal(req, res) {
  const petsFilePath = path.join(__dirname, "../data/pets/list.json");

  fs.readFile(petsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading pets file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const pets = JSON.parse(data);
      const newAnimal = { id: pets.items.length + 1, ...req.body };
      pets.items.unshift(newAnimal);

      fs.writeFile(petsFilePath, JSON.stringify(pets, null, 2), "utf8", writeErr => {
        if (writeErr) {
          console.error("Error writing to pets file:", writeErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({ success: true, message: "Animal registered successfully" });
      });
    } catch (parseError) {
      console.error("Error parsing pets JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

module.exports = registerAnimal;
