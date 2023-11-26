const backendUrl = "http://localhost:3001";
function acceptModeratorRequest(userId) {
  fetch(`${backendUrl}/accept-moderator/${userId}`, { method: "PUT" })
    .then((response) => {
      if (response.ok) {
        alert("Solicitação de moderação aceita com sucesso!");
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
        // Remover a linha da tabela
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
          // Remover todas as linhas da tabela
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
  