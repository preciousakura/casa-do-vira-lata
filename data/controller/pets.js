const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const pagination = require('../utils/paginated-data')

function listAdoptions(req, res) {
  const page = Number(req.query.page ? req.query.page : 1);
  const size = Number(req.query.size ? req.query.size : 10);

  const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");
  fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      try {
          const adoptions = JSON.parse(data);
          return res.json(pagination(adoptions, page, size));
      } catch (parseError) {
          res.status(500).json({ error: "Internal Server Error" });
      }
  });
}

function findPetById(req, res) {
    const adoptionsFilePath = path.join(__dirname, "../data/pets/list.json");
    fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const { petId } = req.params;
            const jsonData = JSON.parse(data);
            const pet = jsonData.items.find((pet) => pet.id == petId);

            if (pet) return res.json(pet);
            return res.status(404).json({ error: "Pet not found" });
        
        } catch (parseError) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

function listPets(req, res) {
    const page = Number(req.query.page ? req.query.page : 1);
    const size = Number(req.query.size ? req.query.size : 10);

    const adoptionsFilePath = path.join(__dirname, "../data/pets/list.json");
    fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const adoptions = JSON.parse(data);
            const { non_adopeted } = req.query;
            const filtered = non_adopeted ? adoptions.items.filter(item => item.status ? item.status !== "Adotado" : true ) : false;

            return res.json(pagination({ items: non_adopeted ? filtered : adoptions.items }, page, size));
        } catch (parseError) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

function findElementById(path, id) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) return reject(err);

        const jsonData = JSON.parse(data);
        const obj = jsonData.items.find((item) => item.id === id);
        
        if (obj) resolve(obj);
        else resolve(null);
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

    const { petId } = req.query;
    const { id: userId } = req.user;

    
    if(!userId || !petId) return res.status(500).json({ error: "O id do usuário e do pet são obrigátorios para a solicitação de adoção." });
    
    const user = await findElementById(usersFilePath, userId);
    const pet = await findElementById(petsFilePath, petId);

    if(user && pet) {
        fs.readFile(adoptFilePath, "utf8", (err, data) => {
            if (err) return res.status(500).json({ error: "Internal Server Error" });
            
            try {
                const adoptions = JSON.parse(data);
                const verify_exists = adoptions.items.find((item) => { return item.userId === userId && item.petId === petId });
                if(verify_exists) return res.status(500).json({ error: "Já existe uma solicitação desse usuário para este pet." });
                
                adoptions.items.push({ status:'Em processo',  
                                       ...req.body,
                                       userId: userId, 
                                       petId: petId,  
                                       ...pet, 
                                       id: uuidv4(),  
                                       date: formatDate(new Date())
                                    });

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

function editPet(req, res) {
  const petsFile = path.join(__dirname, "../data/pets/list.json");

  fs.readFile(petsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    try {
      const pets = JSON.parse(data);
      const { petId } = req.query;
      const petIndex = pets.items.findIndex((user) => user.id == petId);

      if (petIndex == -1) return res.status(404).json({ error: "User not found" });
      pets.items[petIndex] = { ...req.body, id: petId };
      
      fs.writeFile( petsFile, JSON.stringify(pets, null, 2), "utf8", (writeErr) => {
          if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
          return res.json({ message: "Pet editado com sucesso!" });
      });
    } catch (parseError) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

function createPet(req, res) {
    const petsFilePath = path.join(__dirname, "../data/pets/list.json");
  
    fs.readFile(petsFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
    
      try {
        const pets = JSON.parse(data);
        const new_pet = { id: uuidv4(), ...req.body, status: "Disponível" };
        pets.items.unshift(new_pet);
  
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

  function deletePet(req, res) {
    const petsFilePath = path.join(__dirname, "../data/pets/list.json");
  
    fs.readFile(petsFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      
      try {
        const { petId } = req.query
        
        const petsData = JSON.parse(data);
        petsData.items = petsData.items.filter(pet => pet.id !== petId);
        fs.writeFile(petsFilePath, JSON.stringify(petsData, null, 2), "utf8", (writeErr) => {
          if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
          res.json({ message: "pet removed successfully" });
        });
      } catch (parseError) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
}

function acceptAdoption(req, res) {
    const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");
    const petsFilePath = path.join(__dirname, "../data/pets/list.json");

    fs.readFile(adoptionsFilePath, "utf8", (err, adoptionsData) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const adoptions = JSON.parse(adoptionsData);
            const { id } = req.query;

            const adoptionIndex = adoptions.items.findIndex(item => item.id == id);
            if (adoptionIndex === -1) return res.status(404).json({ error: "Adoption not found" });

            const petId = adoptions.items[adoptionIndex].petId;
            adoptions.items[adoptionIndex].status = "Accepted";

            adoptions.items = adoptions.items.filter(adoption => (adoption.petId !== petId || adoption.id === id));
            fs.writeFile(adoptionsFilePath, JSON.stringify(adoptions, null, 2), "utf8", writeErr => {
                if (writeErr) {
                    console.error("Error writing to adoptions file:", writeErr);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

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
    const adoptionsFilePath = path.join(__dirname, "../data/pets/adoptions.json");
    fs.readFile(adoptionsFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        try {
            const { id } = req.query;
            const adoptions = JSON.parse(data);
            adoptions.items = adoptions.items.filter(adoption => adoption.id != id);

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

function addFavorite(req, res) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");
  
    fs.readFile(usersFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      try {
        const users = JSON.parse(data);

        const { id } = req.user;
        const userIndex = users.items.findIndex((user) => user.id == id);

        if (userIndex === -1) return res.status(404).json({ error: "User not found" });

        const { petId } = req.query;

        const user = users.items[userIndex];
        user.favorites = user.favorites || [];

        if (!user.favorites.includes(petId)) user.favorites.push(petId);
        
        fs.writeFile(
          usersFilePath,
          JSON.stringify(users, null, 2),
          "utf8",
          (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
            res.json({ message: "Pet added to favorites successfully", user: req.user });
          }
        );
      } catch (parseError) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
}

function removeFavorite(req, res) {
    const usersFilePath = path.join(__dirname, "../data/users/list.json");
  
    fs.readFile(usersFilePath, "utf8", (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
  
      try {
        const users = JSON.parse(data);
        const { id } = req.user

        const userIndex = users.items.findIndex((user) => user.id === id);
  
        if (userIndex === -1) return res.status(404).json({ error: "User not found" });
        
        const { petId } = req.query;

        const user = users.items[userIndex];
        user.favorites = user.favorites || [];
        user.favorites = user.favorites.filter((favoritePetId) => favoritePetId !== petId);
  
        fs.writeFile(
          usersFilePath,
          JSON.stringify(users, null, 2),
          "utf8",
          (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Internal Server Error" });
            
            res.json({
              message: "Pet removed from favorites successfully",
              user: req.user
            });
          }
        );
      } catch (parseError) {
        console.error("Error parsing users JSON:", parseError);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
}

module.exports = { listPets, adoptPet, findPetById, createPet, deletePet, listAdoptions, acceptAdoption, rejectAdoption, addFavorite, removeFavorite, editPet }