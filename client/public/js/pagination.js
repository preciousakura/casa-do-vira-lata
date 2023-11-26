function loadPagination({ page, total, size }, load, doc) {
  const next_btn = document.createElement("button");
  const prev_btn = document.createElement("button");

  next_btn.onclick = function () { load(page + 1) };
  prev_btn.onclick = function () { load(page - 1) };

  next_btn.innerText = "Próxima";
  prev_btn.innerText = "Anterior";

  const pages = document.createElement("p");
  pages.innerText = `${page} página de ${Math.ceil(total / size)}`;

  const page_box = document.createElement("div");
  page_box.setAttribute("class", "pagination");
  if(page > 1) page_box.appendChild(prev_btn); 
  page_box.appendChild(pages);
  if(page < Math.ceil(total/size)) page_box.appendChild(next_btn);
  if(total > 0 && page <= Math.ceil(total/size) && total > size) doc.appendChild(page_box);
}