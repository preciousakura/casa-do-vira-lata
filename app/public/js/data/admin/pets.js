const COLUMNS = ['Nome', 'Tipo', 'Sexo', 'Tamanho', 'Opções']

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

function createUserItem({ id, name, type, gender, size }) {
    return `
        <tr id="pet-row-${id}">
          <td><a href="/user/${id}">${name}</a></td>
          <td>${type}</td>
          <td>${gender}</td>
          <td>${size}</td>
          <td class="table-actions">
            <button class="edit-button">
              <i class="ph-fill ph-pencil"></i>
            </button>
            <button class="delete-button"  onclick="deletePet(${id})">
              <i class="ph ph-trash"></i>
            </button>
          </td>
        </tr>
    `
}

async function loadTablePets(page = 1) {
    const res = await fetch(`http://localhost:3001/pets?page=${page}&size=10`);
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
        const { id, name, type, gender, size } = item;
        list.innerHTML += createUserItem({ id, name, type, gender, size });
      });
      list.setAttribute('class', 'content-page-table__table');    
      items_area.innerHTML = ""
      items_area.appendChild(list);
      loadPagination({ page, total, size: 10 }, loadTablePets, items_area);
      return;
    }
    
    const list = document.createElement('div');
    list.setAttribute('class', 'list__no-result');   
    list.innerHTML = '<p>Sem resultados</p>';
    items_area.innerHTML = ""
    items_area.appendChild(list);
}
  
loadTablePets();


async function deletePet(petId) {
  try {
    const user = getUserFromCookie();
    const res = await fetch(`http://localhost:3001/pets?petId=${petId}`, {
      method: 'DELETE',
      headers: { Authorization: user.token }
    })

    if(res.ok) {
      checkAndUpdateForEmptyTable()
      const row = document.getElementById(`pet-row-${petId}`);
      openModal('modal-sucess-solicit-listPets')
      if (row) row.remove();
    } else openModal('modal-error-solicit-listPets')
  } catch (err) {
    openModal('modal-error-solicit-listPets')
  }
}


