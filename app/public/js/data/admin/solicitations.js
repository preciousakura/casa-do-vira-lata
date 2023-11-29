const COLUMNS = ['Nome', 'E-mail', 'Telefone', 'Opções']
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

function createUserItem({ email, id, name, phone }) {
    return `
        <tr id="user-row-${id}">
          <td><a href="/user/${id}">${name}</a></td>
          <td>${email}</td>
          <td>${phone}</td>
          <td class="table-actions">
            <button class="edit-button" onclick="acceptModeratorRequest(${id})">  
                <i class="ph-fill ph-check-fat"></i>
            </button>
            <button class="delete-button" onclick="rejectModeratorRequest(${id})">
                <i class="ph ph-trash"></i>
            </button>
        </td>
        </tr>
    `
}

async function loadSolicitations(page = 1) {
    const res = await fetch(`http://localhost:3001/admin/solicitations?page=${page}&size=10`, { headers: { Authorization: user.token } });
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
        const { email, id, name, phone } = item;
        list.innerHTML += createUserItem({ email, id, name, phone });
      });
      list.setAttribute('class', 'content-page-table__table');    
      items_area.innerHTML = ""
      items_area.appendChild(list);
      loadPagination({ page, total, size: 10 }, loadSolicitations, items_area);
      return;
    }
    
    const list = document.createElement('div');
    list.setAttribute('class', 'list__no-result');   
    list.innerHTML = '<p>Sem resultados</p>';
    items_area.innerHTML = ""
    items_area.appendChild(list);
}
  
loadSolicitations();