const COLUMNS = ['Nome do pet', 'Data de adoção', 'Status']

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

function createUserItem({ name, date, status }) {
    return `
        <tr>
          <td>${name}</td>
          <td>${date}</td>
          <td>${status}</td>
        </tr>
    `
}

async function loadAdoptions(page = 1) {
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
      loadPagination({ page, total, size: 10 }, loadAdoptions, items_area);
      return;
    }
    
    const list = document.createElement('div');
    list.setAttribute('class', 'list__no-result');   
    list.innerHTML = '<p>Sem resultados</p>';
    items_area.innerHTML = ""
    items_area.appendChild(list);
}
  
loadAdoptions();