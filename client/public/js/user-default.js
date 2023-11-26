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
  const userfavorites = getUserFromCookie("user")?.favorites;

  return favorites ? JSON.parse(favorites) : userfavorites ?? [];
}

function addToFavorites(petId) {
  const userInfo = getUserFromCookie("user");
  const userId = userInfo.id ?? null;

  if (userId !== 0 && !userId) {
    console.error("Usuário não encontrado.");
    return;
  }

  fetch(`${backendUrl}/user/${userId}/favorites`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ petId: petId }),
  })
    .then((response) => response.json())
    .then((data) => {
      addFavoriteToLocalStorage(petId);
      toggleFavoriteIcon(petId);
    })
    .catch((error) => console.error("Erro ao adicionar aos favoritos:", error));
}

function toggleFavoriteIcon(petId) {
  const favoriteIcons = document.querySelectorAll(
    `i[onclick='addToFavorites(${petId})']`
  );
  favoriteIcons.forEach((icon) => {
    icon.classList.add("favorite");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const favorites = getFavoritesFromLocalStorage();
  if (favorites) {
    favorites.forEach((petId) => toggleFavoriteIcon(petId));
  }
});

function getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
    searchButton.addEventListener("click", applyFilters);
  }
});

function applyFilters() {
  const type = document.querySelector(".filters__select__type").value;
  const size = document.querySelector(".filters__select__size").value;
  const gender = document.querySelector(".filters__select__gender").value;
  const name = document.getElementById("filterSearch").value;
  const castrated = document.getElementById("castrated").checked;
  const vaccinated = document.getElementById("vaccinated").checked;
  const dewormed = document.getElementById("dewormed").checked;
  fetch(
    `${backendUrl}/petsFilter?type=${type}&size=${size}&gender=${gender}&name=${name}&castrated=${castrated}&vaccinated=${vaccinated}&dewormed=${dewormed}`
  )
    .then((response) => response.json())
    .then((data) => {
      updatePetList(data);
    })
    .catch((error) => console.error("Erro ao aplicar filtros:", error));
}

function updatePetList(pets) {
  const listContainer = document.querySelector(".list");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  pets?.forEach((pet) => {
    listContainer.innerHTML += `
      <div class="list__item">
        <div class="list__item__image">
          <img src="${pet.image}" alt="Imagem do pet" />
        </div>
        <div class="list__item__header">
          <h2>${pet.name}</h2>
          <div class="list__item__header--right">
            <!-- Adicione aqui lógica para verificar se o usuário é 'USER-DEFAULT' -->
            <i class="ph-fill ph-heart ${
              pet.isFavorite ? "favorite" : ""
            }" onclick="addToFavorites(${pet.id})"></i>
          </div>
        </div>
        <div class="list__item__description">
          <p><b>Idade:</b> ${pet.age} anos</p>
          <p><b>Sexo:</b> ${pet.gender}</p>
        </div>
        <div class="list__item__tags">
          ${pet.castrated ? "<span>Castrado</span>" : ""}
          ${pet.vaccinated ? "<span>Vacinado</span>" : ""}
          ${pet.dewormed ? "<span>Vermificado</span>" : ""}
        </div>
      </div>
    `;
  });
}
