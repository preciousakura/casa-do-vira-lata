async function submitModeratorRequest(event) {
  event.preventDefault();
  const user = getUserFromCookie();
  if (user) {
    try {
      const data = new FormData(event.target);
      const { token } = user;
      const res = await fetch(`http://localhost:3001/user-default/moderator-solicitation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify(Object.fromEntries(data.entries())),
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
  console.log("foi?")
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

async function addToFavorites(petId) {
  const user = getUserFromCookie();

  if (user) {
    try {
      const favorites = getFavoritesFromLocalStorage();
      const method = favorites.includes(petId) ? "DELETE" : "PUT";
      const response = await  fetch(`http://localhost:3001/pets/favorites?petId=${petId}`, { 
          method: method, 
          headers: { "Content-Type": "application/json", 
          Authorization: user.token
        }
      })

      if(response.ok) {
        if (method === "PUT") addFavoriteToLocalStorage(petId);
        else removeFavoriteFromLocalStorage(petId);
        toggleFavoriteIcon(petId);
      }
    } catch (err) {
      console.log(err)
    }
  }
}

function removeFavoriteFromLocalStorage(petId) {
  let favorites = getFavoritesFromLocalStorage();
  favorites = favorites.filter(favId => favId !== petId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function toggleFavoriteIcon(petId) {
  const favoriteIcons = document.querySelectorAll(`i[onclick="addToFavorites('${petId}')"]`);
  favoriteIcons.forEach((icon) => {
    icon.classList.toggle("favorite");
  });
}

function getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  const clearFiltersButton = document.getElementById('clearFiltersButton');
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const type = document.querySelector(".filters__select__type")?.value?? 'Todos';
      const size = document.querySelector(".filters__select__size")?.value?? 'Todos';
      const gender = document.querySelector(".filters__select__gender")?.value ?? 'Todos';
      const name = document.getElementById("filterSearch")?.value ?? 'Todos';
      const castrated = document.getElementById("castrated")?.checked ?? false;
      const vaccinated = document.getElementById("vaccinated")?.checked?? false;
      const dewormed = document.getElementById("dewormed")?.checked ?? false;

      applyFilters(type, size, gender, name, castrated, vaccinated, dewormed);
    });
  }
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', clearFilters);
  }
});

function applyFilters(type = "Todos", size = "Todos", gender = "Todos", name = "", castrated = false, vaccinated = false, dewormed = false) {
  fetch(
    `${backendUrl}/petsFilter?type=${type}&size=${size}&gender=${gender}&name=${name}&castrated=${castrated}&vaccinated=${vaccinated}&dewormed=${dewormed}`
    )
    .then((response) => response.json())
    .then((data) => {
      updatePetList(data);
    })
    .catch((error) => console.error("Erro ao aplicar filtros:", error));
}
function clearFilters() {
  document.getElementById('filterType').selectedIndex = 0;
  document.getElementById('filterSize').selectedIndex = 0;
  document.getElementById('filterGender').selectedIndex = 0;
  document.getElementById('filterSearch').value = '';
  document.getElementById('castrated').checked = false;
  document.getElementById('vaccinated').checked = false;
  document.getElementById('dewormed').checked = false;

  applyFilters(); 
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
