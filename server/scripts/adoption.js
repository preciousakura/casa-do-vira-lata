const fs = require("fs");
const path = require("path");

function acceptAdoption(req, res) {
    const adoptionId = parseInt(req.params.id);
    const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");
    const petsFilePath = path.join(__dirname, "../data/pets/list.json");

    // Ler o arquivo de adoções
    fs.readFile(adoptionsFilePath, "utf8", (err, adoptionsData) => {
        if (err) {
            console.error("Error reading adoptions file:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            let adoptions = JSON.parse(adoptionsData);
            const adoptionIndex = adoptions.items.findIndex(adoption => adoption.id == adoptionId);
            if (adoptionIndex === -1) {
                return res.status(404).json({ error: "Adoption not found" });
            }

            const petId = adoptions.items[adoptionIndex].petId;
            adoptions.items[adoptionIndex].status = "Accepted";

            adoptions.items = adoptions.items.filter(adoption => (adoption.petId !== petId || adoption.id === adoptionId));
            // Atualizar o arquivo de adoções
            fs.writeFile(adoptionsFilePath, JSON.stringify(adoptions, null, 2), "utf8", writeErr => {
                if (writeErr) {
                    console.error("Error writing to adoptions file:", writeErr);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                // Ler o arquivo de pets
                fs.readFile(petsFilePath, "utf8", (petsErr, petsData) => {
                    if (petsErr) {
                        console.error("Error reading pets file:", petsErr);
                        return res.status(500).json({ error: "Internal Server Error" });
                    }

                    try {
                        let pets = JSON.parse(petsData);
                        const petIndex = pets.items.findIndex(pet => pet.id == petId);
                        if (petIndex !== -1) {
                            pets.items[petIndex].status = "Adotado";
                        }

                        fs.writeFile(petsFilePath, JSON.stringify(pets, null, 2), "utf8", petsWriteErr => {
                            if (petsWriteErr) {
                                console.error("Error writing to pets file:", petsWriteErr);
                                return res.status(500).json({ error: "Internal Server Error" });
                            }
                            res.json({ message: "Adoption request accepted and pet status updated" });
                        });
                    } catch (petsParseError) {
                        console.error("Error parsing pets JSON:", petsParseError);
                        res.status(500).json({ error: "Internal Server Error" });
                    }
                });
            });
        } catch (adoptionsParseError) {
            console.error("Error parsing adoptions JSON:", adoptionsParseError);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}


function rejectAdoption(req, res) {
    const adoptionId = parseInt(req.params.id);
    const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");

    fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading adoptions file:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            let adoptions = JSON.parse(data);
            adoptions.items = adoptions.items.filter(adoption => adoption.id != adoptionId);

            fs.writeFile(adoptionsFilePath, JSON.stringify(adoptions, null, 2), "utf8", writeErr => {
                if (writeErr) {
                    console.error("Error writing to adoptions file:", writeErr);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                res.json({ message: "Adoption request rejected" });
            });
        } catch (parseError) {
            console.error("Error parsing adoptions JSON:", parseError);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

module.exports = {acceptAdoption, rejectAdoption};
