const backendUrl = "http://localhost:3001";
function checkAndUpdateForEmptyTable() {
  const table = document.querySelector('.content-page-table__table'); // Substitua pelo seletor correto da sua tabela
  const items_area = document.getElementById('items_area');
  if (!table || table.rows.length <= 2) { // Considerando que a primeira linha é o cabeçalho da tabela
      const noResultDiv = document.createElement('div');
      noResultDiv.setAttribute('class', 'list__no-result');   
      noResultDiv.innerHTML = '<p>Sem resultados</p>';
      items_area.innerHTML = ""; // Limpa a área de itens para remover a tabela vazia
      items_area.appendChild(noResultDiv);
  }
}

function removeTable() {
  const table = document.querySelector('.content-page-table__table');
  if (table) {
      table.remove();
      const noResultDiv = document.createElement('div');
      noResultDiv.setAttribute('class', 'list__no-result');   
      noResultDiv.innerHTML = '<p>Sem resultados</p>';
      items_area.innerHTML = ""; // Limpa a área de itens para remover a tabela vazia
      items_area.appendChild(noResultDiv);
  }
}

function acceptModeratorRequest(userId) {
  fetch(`${backendUrl}/accept-moderator/${userId}`, { method: "PUT" })
    .then((response) => {
      if (response.ok) {
        alert("Solicitação de moderação aceita com sucesso!");
        checkAndUpdateForEmptyTable()
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
          row.remove();
        }
      } else {
        alert("Falha ao aceitar a solicitação de moderação.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Ocorreu um erro ao processar a solicitação.");
    });
}

function rejectModeratorRequest(userId) {
  fetch(`${backendUrl}/reject-moderator/${userId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        alert("Solicitação de moderação rejeitada com sucesso.");
        checkAndUpdateForEmptyTable()
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
          row.remove();
        }
      } else {
        alert("Falha ao rejeitar a solicitação de moderação.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Ocorreu um erro ao processar a solicitação.");
    });
}

function acceptAllModeratorRequests() {
    fetch(`${backendUrl}/accept-all-moderators`, { method: "PUT" })
      .then(response => {
        if (response.ok) {
          alert("Todas as solicitações de moderação foram aceitas com sucesso!");
          removeTable()
          document.querySelectorAll("[id^='user-row-']").forEach(row => row.remove());
        } else {
          alert("Falha ao aceitar todas as solicitações de moderação.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Ocorreu um erro ao processar as solicitações.");
      });
  }
  
  function rejectAllModeratorRequests() {
    fetch(`${backendUrl}/reject-all-moderators`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          alert("Todas as solicitações de moderação foram rejeitadas com sucesso.");
          removeTable()
          // Remover todas as linhas da tabela
          document.querySelectorAll("[id^='user-row-']").forEach(row => row.remove());
        } else {
          alert("Falha ao rejeitar todas as solicitações de moderação.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Ocorreu um erro ao processar as solicitações.");
      });
  }


