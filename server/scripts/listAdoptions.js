const fs = require("fs");
const path = require("path");

function listAdoptions(req, res) {
    const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");

    fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading adoptions file:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            const adoptions = JSON.parse(data);
            res.json(adoptions);
        } catch (parseError) {
            console.error("Error parsing adoptions JSON:", parseError);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
function listUserAdoptions(req, res) {
    const userId = parseInt(req.params.userId);
    const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");

    fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading adoptions file:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            const adoptions = JSON.parse(data);
            const userAdoptions = adoptions.items.filter(adoption => adoption.userId === userId);
            res.json(userAdoptions);
        } catch (parseError) {
            console.error("Error parsing adoptions JSON:", parseError);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

module.exports = {listAdoptions, listUserAdoptions};