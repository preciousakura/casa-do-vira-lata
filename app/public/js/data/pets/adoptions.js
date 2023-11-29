const COLUMNS = ["Solicitante", "Pet", "Data da Solicitação", "OPÇÕES"];

const user = getUserFromCookie();

function createTableHeader(columns) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  columns.forEach((col) => {
    const th = document.createElement("th");
    th.innerText = col;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  return thead;
}

function createUserItem({ id, fullName, name, date }) {
  const tr = document.createElement("tr");
  tr.setAttribute('id', `solicitation-row-${id}`)
  const td_fn = document.createElement("td");
  const td_name = document.createElement("td");
  const td_date = document.createElement("td");

  td_fn.innerText = fullName;
  td_name.innerText = name;
  td_date.innerText = date;

  tr.appendChild(td_fn);
  tr.appendChild(td_name);
  tr.appendChild(td_date);

  const options = document.createElement("td");
  options.setAttribute("class", "table-actions");

  const edit_btn = document.createElement("button");
  edit_btn.setAttribute("class", "edit-button");

  const delete_btn = document.createElement("button");
  delete_btn.setAttribute("class", "delete-button");

  const edit_icon = document.createElement("i");
  edit_icon.setAttribute("class", "ph-fill ph-check-fat");

  const delete_icon = document.createElement("i");
  delete_icon.setAttribute("class", "ph ph-trash");

  edit_btn.appendChild(edit_icon);
  delete_btn.appendChild(delete_icon);

  edit_btn.addEventListener("click", () => acceptAdoptionRequest(id));
  delete_btn.addEventListener("click", () => rejectAdoptionRequest(id));

  options.appendChild(edit_btn);
  options.appendChild(delete_btn);

  tr.appendChild(options);

  return tr;
}

async function loadAllAdoptions(page = 1) {
  try {
    const res = await fetch(
      `http://localhost:3001/pets/adoptions?page=${page}`,
      { headers: { Authorization: user.token } }
    );
    const data = await res.json();
    if (!res.ok) {
      const list = document.createElement("div");
      list.setAttribute("class", "list__no-result");
      list.innerHTML = `<p>${data.error}</p>`;
      items_area.innerHTML = "";
      items_area.appendChild(list);
      return;
    }
    const items_area = document.getElementById("items_area");

    const { items, total } = data;

    if (items.length > 0) {
      const list = document.createElement("table");
      list.appendChild(createTableHeader(COLUMNS));
      items.forEach((item) => {
        const { id, fullName, name, date } = item;
        list.appendChild(createUserItem({ id, fullName, name, date }));
      });

      list.setAttribute("class", "content-page-table__table");
      items_area.innerHTML = "";
      items_area.appendChild(list);
      loadPagination({ page, total, size: 10 }, loadAllAdoptions, items_area);
      return;
    }

    const list = document.createElement("div");
    list.setAttribute("class", "list__no-result");
    list.innerHTML = "<p>Sem resultados</p>";
    items_area.innerHTML = "";
    items_area.appendChild(list);
  } catch (err) {
    window.location.href = "/";
  }
}

loadAllAdoptions();
