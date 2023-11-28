const COLUMNS = ['Nome', 'E-mail', 'Telefone', 'Cargo', 'Opções']
const user = getUserFromCookie();

function createTableHeader(columns) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    columns.forEach(col => {
        const th = document.createElement('th');
        th.innerText = col;
        tr.appendChild(th)
    })
    thead.appendChild(tr)
    return thead;
}

function createUserItem({ email, id, name, phone, role }) {
  if(user?.id == id) return ``
    return `
        <tr id="user-row-${id}">
          <td><a href="/user/${id}">${name}</a></td>
          <td>${email}</td>
          <td>${phone}</td>
          <td>${nameRole(role)}</td>
          <td class="table-actions">
            <button class="edit-button">
              <i class="ph-fill ph-pencil"></i>
            </button>
            <button class="delete-button" onclick="deleteUser(${id})">
              <i class="ph ph-trash"></i>
            </button>
          </td>
        </tr>
    `
}

async function loadUsers(page = 1) {
    const res = await fetch(`http://localhost:3001/users?page=${page}&size=10`, { headers: { Authorization: user.token } });
    const data = await res.json();
    const items_area = document.getElementById('items_area');

    
    if(!res.ok) {
      const list = document.createElement('div');
      list.setAttribute('class', 'list__no-result');   
      list.innerHTML = `<p>${data.error}</p>`;
      items_area.innerHTML = ""
      items_area.appendChild(list);
      return;
    }
    
    const { items, total  } = data;

    if(items.length > 0) { 
      const list = document.createElement('table');
      list.appendChild(createTableHeader(COLUMNS))

      items.forEach(item => {
        const { email, id, name, phone, role } = item;
        list.innerHTML += createUserItem({ email, id, name, phone, role });
      });
      list.setAttribute('class', 'content-page-table__table');    
      items_area.innerHTML = ""
      items_area.appendChild(list);
      loadPagination({ page, total, size: 10 }, loadUsers, items_area);
      return;
    }
    
    const list = document.createElement('div');
    list.setAttribute('class', 'list__no-result');   
    list.innerHTML = '<p>Sem resultados</p>';
    items_area.innerHTML = ""
    items_area.appendChild(list);
}
  
loadUsers();

function deleteUser(userId) {
  fetch(`http://localhost:3001/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: user.token }
  })
  .then(response => {
    if (response.ok) {
      openModal('modal-sucess-solicit-listUsers');
      checkAndUpdateForEmptyTable()
      const row = document.getElementById(`user-row-${userId}`);
      if (row) {
        row.remove();
      }
    } else {
      openModal('modal-error-solicit-listUsers');
    }
  })
  .catch(error => {
    openModal('modal-error-solicit-listUsers');
  });
}