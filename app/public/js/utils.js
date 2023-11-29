function getUserFromCookie() {
  const cookie = document.cookie.split("; ");
  const user = cookie.find((row) => row.startsWith("user" + "="));

  if (user) {
    const data = decodeURIComponent(user.split("=")[1]);
    const json = data.startsWith("j:") ? data.substring(2) : data;
    try {
      return JSON.parse(json);
    } catch (error) {
      console.error("Erro ao analisar dados do cookie:", error);
      return null;
    }
  }

  return null;
}

function nameRole(role) {
  switch (role) {
    case "USER-DEFAULT":
      return "Usuário comum";
    case "ADMIN":
      return "Admnistrador";
    case "MODERATOR":
      return "Moderador";
    default:
      "Usuário";
  }
}


function checkAndUpdateForEmptyTable() {
  const table = document.querySelector('.content-page-table__table');
  const items_area = document.getElementById('items_area');
  if (!table || table.rows.length <= 2) { 
      const noResultDiv = document.createElement('div');
      noResultDiv.setAttribute('class', 'list__no-result');   
      noResultDiv.innerHTML = '<p>Sem resultados</p>';
      items_area.innerHTML = ""; 
      items_area.appendChild(noResultDiv);
  }
}
