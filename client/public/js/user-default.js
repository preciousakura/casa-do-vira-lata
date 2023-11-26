async function submitModeratorRequest(event) {
  event.preventDefault();
  const user = getUserFromCookie();
  console.log(user)
  if (user) {
    const { id } = user;

    try {
      const res = await fetch(
        `http://localhost:3001/send-user-solicitation-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, reason }),
        }
      );
      if (res.ok) openModal("modal-sucess-solicit-moder");
      else openModal("modal-error-solicit-moder");
    } catch (err) {
      openModal("modal-error-solicit-moder");
    }
  }
}

function addFavoriteToLocalStorage(petId) {
  let favorites = getFavoritesFromLocalStorage();

  if (!favorites.includes(petId)) {
    favorites.push(petId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem("favorites");
  const userfavorites = getUserFromCookie()?.favorites;

  return favorites ? JSON.parse(favorites) : userfavorites ?? [];
} 

function addToFavorites(petId) {
  const userInfo = getUserFromCookie();
  const userId = userInfo.id ?? null;

  if (userId !== 0 && !userId) {
    console.error("Usuário não encontrado.");
    return;
  }

  let favorites = getFavoritesFromLocalStorage();
  const method = favorites.includes(petId) ? "DELETE" : "PUT"; // Determine se deve adicionar ou remover

  fetch(`http://localhost:3001/user/${userId}/favorites`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ petId: petId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (method === "PUT") {
        addFavoriteToLocalStorage(petId);
      } else {
        removeFavoriteFromLocalStorage(petId);
      }
      toggleFavoriteIcon(petId);
    })
    .catch((error) => console.error("Erro ao atualizar favoritos:", error));
}

function removeFavoriteFromLocalStorage(petId) {
  let favorites = getFavoritesFromLocalStorage();
  favorites = favorites.filter(favId => favId !== petId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function toggleFavoriteIcon(petId) {
  const favoriteIcons = document.querySelectorAll(`i[onclick='addToFavorites(${petId})']`);
  favoriteIcons.forEach((icon) => {
    icon.classList.toggle("favorite");
  });
}

function getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

// function applyFilters() {
//   const type = document.querySelector(".filters__select__type").value;
//   const size = document.querySelector(".filters__select__size").value;
//   const gender = document.querySelector(".filters__select__gender").value;
//   const name = document.getElementById("filterSearch").value;
//   const castrated = document.getElementById("castrated").checked;
//   const vaccinated = document.getElementById("vaccinated").checked;
//   const dewormed = document.getElementById("dewormed").checked;
//   fetch(
//     `${backendUrl}/petsFilter?type=${type}&size=${size}&gender=${gender}&name=${name}&castrated=${castrated}&vaccinated=${vaccinated}&dewormed=${dewormed}`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       updatePetList(data);
//     })
//     .catch((error) => console.error("Erro ao aplicar filtros:", error));
// }

// function updatePetList(pets) {
//   const listContainer = document.querySelector(".list");
//   if (!listContainer) return;

//   listContainer.innerHTML = "";

//   pets?.forEach((pet) => {
//     listContainer.innerHTML += `
//       <div class="list__item">
//         <div class="list__item__image">
//           <img src="${pet.image}" alt="Imagem do pet" />
//         </div>
//         <div class="list__item__header">
//           <h2>${pet.name}</h2>
//           <div class="list__item__header--right">
//             <!-- Adicione aqui lógica para verificar se o usuário é 'USER-DEFAULT' -->
//             <i class="ph-fill ph-heart ${
//               pet.isFavorite ? "favorite" : ""
//             }" onclick="addToFavorites(${pet.id})"></i>
//           </div>
//         </div>
//         <div class="list__item__description">
//           <p><b>Idade:</b> ${pet.age} anos</p>
//           <p><b>Sexo:</b> ${pet.gender}</p>
//         </div>
//         <div class="list__item__tags">
//           ${pet.castrated ? "<span>Castrado</span>" : ""}
//           ${pet.vaccinated ? "<span>Vacinado</span>" : ""}
//           ${pet.dewormed ? "<span>Vermificado</span>" : ""}
//         </div>
//       </div>
//     `;
//   });
// }
