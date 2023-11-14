function createUserItem({ email, id, name, phone, role }) {
    return `
        <tr>
          <td><a href="/user/${id}">${name}</a></td>
          <td>${email}</td>
          <td>${phone}</td>
          <td>${role}</td>
          <td class="table-actions">
            <button class="edit-button">
              <i class="ph-fill ph-pencil"></i>
            </button>
            <button class="delete-button">
              <i class="ph ph-trash"></i>
            </button>
          </td>
        </tr>
    `
}

async function loadUsers(page = 1) {
    const res = await fetch(`http://localhost:3001/users?page=${page}&size=10`);
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
      items.forEach(item => {
        const { email, id, name, phone, role } = item;
        list.innerHTML += createUserItem({ email, id, name, phone, role });
      });
      list.setAttribute('class', 'content-page-table__table');    
      items_area.innerHTML = ""
      items_area.appendChild(list);
      items_area.innerHTML += loadPagination({ page, total, size: 10 });
      return;
    }
    
    const list = document.createElement('div');
    list.setAttribute('class', 'list__no-result');   
    list.innerHTML = '<p>Sem resultados</p>';
    items_area.innerHTML = ""
    items_area.appendChild(list);
}
  
loadUsers();


// <% if(data.length > 0) { %>
//     <table class="content-page-table__table">

//       <tbody>
//         <% data.forEach(function(user) { %>

//         <% }) %>
//       </tbody>
//     </table>
//     <% } else { %>
//     <div class="list__no-result">
//       <p><%= !(typeof(message) === "undefined") ? message : "Sem resultados" %></p>
//     </div>
//     <% } %>
//     <div class="content-page-table__pagination">
//       <%- include('../../partials/pagination'); %>
//     </div>