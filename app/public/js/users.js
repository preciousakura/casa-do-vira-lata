const { token } = getUserFromCookie();

async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:3001/admin/users?userId=${userId}`, {
            method: 'DELETE',
            headers: { Authorization: token }
        })
        if (response.ok) {
            openModal('modal-sucess-solicit-listUsers');
            checkAndUpdateForEmptyTable()
            const row = document.getElementById(`user-row-${userId}`);
            if (row) row.remove();
        }
    } catch (err) {
      openModal('modal-error-solicit-listUsers');
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

async function acceptModeratorRequest(userId) {
    try {
        const response = await fetch(`http://localhost:3001/admin/accept-moderator?userId=${userId}`, { method: "PUT", headers: { Authorization: token } });
        if (response.ok) {
            openModal('modal-sucess-solicit-listModSolic')
            checkAndUpdateForEmptyTable()
            const row = document.getElementById(`user-row-${userId}`);
            if (row) row.remove();
        } else openModal('modal-error-solicit-listModSolic')
        
    } catch (err) {
        openModal('modal-error-solicit-listModSolic')
    }
}

async function rejectModeratorRequest(userId) {
    try {
        const response = await fetch(`http://localhost:3001/admin/reject-moderator?userId=${userId}`, { method: "DELETE", headers: { Authorization: token } });
        if (response.ok) {
            openModal('modal-error-solicit-rejeitMod')
            checkAndUpdateForEmptyTable()
            const row = document.getElementById(`user-row-${userId}`);
            if (row) row.remove();
        } else openModal('modal-error-solicit-listModSolic')
    } catch (err) {
        openModal('modal-error-solicit-listModSolic')
    }
}

async function acceptAllModeratorRequests() {
    try {
        const response = await fetch(`http://localhost:3001/admin/accept-all`, { method: "PUT", headers: { Authorization: token } });
        if (response.ok) {
            openModal('modal-sucess-solicit-listModSolic')
            removeTable()
            document.querySelectorAll("[id^='user-row-']").forEach(row => row.remove());
        } else openModal('modal-error-solicit-listModSolic')
    } catch (err) {
        openModal('modal-error-solicit-listModSolic')
    }
}
  
async function rejectAllModeratorRequests() {
    try {
        const response = await fetch(`http://localhost:3001/admin/reject-all`, { method: "DELETE", headers: { Authorization: token } });
        if (response.ok) {
            openModal('modal-error-solicit-rejeitMod')
            removeTable()
            document.querySelectorAll("[id^='user-row-']").forEach(row => row.remove());
          } else openModal('modal-error-solicit-listModSolic')
    } catch (err) {
        openModal('modal-error-solicit-listModSolic')
    }
}
