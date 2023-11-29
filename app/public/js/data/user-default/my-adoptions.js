const COLUMNS = ['Nome', 'Idade', 'Sexo', 'Espécie', 'Tamanho', 'Data de adoção', 'Status']

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

function createUserItem({ name, age, gender, type, size, date, status }) {
    return `
        <tr>
          <td>${name}</a></td>
          <td>${age}</td>
          <td>${gender}</td>
          <td>${type}</td>
          <td>${size}</td>
          <td>${date}</td>
          <td>${status}</td>
        </tr>
    `
}

async function loadMyAdoptions(page = 1) {
  try {
    const res = await fetch(`http://localhost:3001/user-default/my-adoptions?page=${page}`, { headers: { Authorization: user.token } });
    const data = await res.json();

    if(res.ok) {
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
          const { name, age, gender, type, size, date, status } = item;
          list.innerHTML += createUserItem({ name, age, gender, type, size, date, status });
        });
        list.setAttribute('class', 'content-page-table__table');    
        items_area.innerHTML = ""
        items_area.appendChild(list);
        loadPagination({ page, total, size: 10 }, loadMyAdoptions, items_area);
        return;
      }
      
      const list = document.createElement('div');
      list.setAttribute('class', 'list__no-result');   
      list.innerHTML = '<p>Sem resultados</p>';
      items_area.innerHTML = ""
      items_area.appendChild(list);
    }
  } catch (err) {
    window.location.href = "/";
  }
}
  
loadMyAdoptions();