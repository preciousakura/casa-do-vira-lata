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
    localStorage.setItem('favorites', JSON.stringify(favorites)); 
  }
}

function getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem('favorites');
  const userfavorites= getUserInfoFromCookie("user")?.favorites;

  return favorites ? JSON.parse(favorites) : userfavorites ?? []; 
}

const backendUrl = "http://localhost:3001";
function submitModeratorRequest(e, userId) {
  e.preventDefault();
  const reason = document.getElementById("user-solicitationReason").value;

  fetch(`${backendUrl}/send-user-solicitation-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, reason }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Solicitação enviada com sucesso.");
      } else {
        // Exibir mensagem de erro
        alert("Falha ao enviar solicitação.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
  const favoriteIcons = document.querySelectorAll(`i[onclick='addToFavorites(${petId})']`);
  favoriteIcons.forEach(icon => {
    icon.classList.add('favorite');
  });
}



document.addEventListener('DOMContentLoaded', () => {

  const favorites = getFavoritesFromLocalStorage();
  if (favorites) {

    favorites.forEach(petId => toggleFavoriteIcon(petId));
  }
});

function getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}
