

function removeTable() {
  const table = document.querySelector(".content-page-table__table");
  if (table) {
    table.remove();
    const noResultDiv = document.createElement("div");
    noResultDiv.setAttribute("class", "list__no-result");
    noResultDiv.innerHTML = "<p>Sem resultados</p>";
    items_area.innerHTML = ""; 
    items_area.appendChild(noResultDiv);
  }
}

async function acceptAdoptionRequest(solicitationId) {
  try {
    const user = getUserFromCookie();
    const response = await fetch(`http://localhost:3001/pets/accept?id=${solicitationId}`, { method: "PUT", headers: { Authorization: user.token } });
    if(response.ok) {
      const table = document.querySelector(".content-page-table__table");
      if (table.rows.length <= 2) removeTable();
      document.getElementById(`solicitation-row-${solicitationId}`).remove();
    } 
  } catch (err) {
    console.log(err)
  }
}


async function rejectAdoptionRequest(solicitationId) {
  try {
    const user = getUserFromCookie();
    const response = await fetch(`http://localhost:3001/pets/reject?id=${solicitationId}`, { method: "DELETE", headers: { Authorization: user.token } })
    if(response.ok) {
      const table = document.querySelector(".content-page-table__table");
      if (table.rows.length <= 2) removeTable();
      document.getElementById(`solicitation-row-${solicitationId}`).remove();
    } 
  } catch (err) {
    console.log(err)
  }
}
