const backendUrl = "http://localhost:3001";
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

function removeTable() {
  const table = document.querySelector('.content-page-table__table');
  if (table) {
      table.remove();
      const noResultDiv = document.createElement('div');
      noResultDiv.setAttribute('class', 'list__no-result');   
      noResultDiv.innerHTML = '<p>Sem resultados</p>';
      items_area.innerHTML = ""; 
      items_area.appendChild(noResultDiv);
  }
}

function acceptModeratorRequest(userId) {
  fetch(`${backendUrl}/accept-moderator/${userId}`, { method: "PUT" })
    .then((response) => {
      if (response.ok) {
        openModal('modal-sucess-solicit-listModSolic')
        checkAndUpdateForEmptyTable()
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
          row.remove();
        }
      } else {
        openModal('modal-error-solicit-listModSolic')
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      openModal('modal-error-solicit-listModSolic')
    });
}

function rejectModeratorRequest(userId) {
  fetch(`${backendUrl}/reject-moderator/${userId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        
        openModal('modal-error-solicit-rejeitMod')
        checkAndUpdateForEmptyTable()
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
          row.remove();
        }
      } else {
        openModal('modal-error-solicit-listModSolic')
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      openModal('modal-error-solicit-listModSolic')
    });
}

function acceptAllModeratorRequests() {
    fetch(`${backendUrl}/accept-all-moderators`, { method: "PUT" })
      .then(response => {
        if (response.ok) {
          openModal('modal-sucess-solicit-listModSolic')
          removeTable()
          document.querySelectorAll("[id^='user-row-']").forEach(row => row.remove());
        } else {
          openModal('modal-error-solicit-listModSolic')
        }
      })
      .catch(error => {
        console.error("Error:", error);
        openModal('modal-error-solicit-listModSolic')
      });
  }
  
  function rejectAllModeratorRequests() {
    fetch(`${backendUrl}/reject-all-moderators`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          openModal('modal-error-solicit-rejeitMod')
          removeTable()
          // Remover todas as linhas da tabela
          document.querySelectorAll("[id^='user-row-']").forEach(row => row.remove());
        } else {
          openModal('modal-error-solicit-listModSolic')
        }
      })
      .catch(error => {
        console.error("Error:", error);
        openModal('modal-error-solicit-listModSolic')
      });
  }

