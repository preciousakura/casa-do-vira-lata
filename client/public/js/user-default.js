async function submitModeratorRequest(event) {
  event.preventDefault();
  const cookie = document.cookie.split("; ");
  const user = cookie.find((row) => row.startsWith('user' + "="));

  if(user) {
    const data = decodeURIComponent(user.split("=")[1]);
    const json = data.startsWith("j:") ? data.substring(2) : data;
    try {
      const reason = document.getElementById("reason").value;
      const { id } = JSON.parse(json);

      try {
        const res = await fetch(`http://localhost:3001/send-user-solicitation-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, reason }),
        })

        const data = await res.json();

        if(res.ok) openModal('modal-sucess-solicit-moder') 
        else openModal('modal-error-solicit-moder')
      } catch (err) {
        openModal('modal-error-solicit-moder')
      }
    } catch (error) {
      openModal('modal-error-solicit-moder')    }
  }
}

function getUserInfoFromCookie(cookieName) {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(cookieName + "="));

  if (!cookieString) {
    return null;
  }

  const encodedCookieValue = cookieString.split("=")[1];
  const decodedCookieValue = decodeURIComponent(encodedCookieValue);

  const jsonValue = decodedCookieValue.startsWith("j:")
    ? decodedCookieValue.substring(2)
    : decodedCookieValue;

  try {
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error("Erro ao analisar dados do cookie:", error);
    return null;
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
  const userfavorites = getUserInfoFromCookie("user")?.favorites;

  return favorites ? JSON.parse(favorites) : userfavorites ?? [];
}

function addToFavorites(petId) {
  const userInfo = getUserInfoFromCookie("user");
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
  const clearFiltersButton = document.getElementById('clearFiltersButton');

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const type = document.querySelector(".filters__select__type").value;
      const size = document.querySelector(".filters__select__size").value;
      const gender = document.querySelector(".filters__select__gender").value;
      const name = document.getElementById("filterSearch").value;
      const castrated = document.getElementById("castrated").checked;
      const vaccinated = document.getElementById("vaccinated").checked;
      const dewormed = document.getElementById("dewormed").checked;

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