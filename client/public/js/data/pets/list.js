function createPetItem({ age, castrated, dewormed, gender, id, image, name, size, type, vaccinated }) {
  return `
    <div class="list__item">
      <div class="list__item__image">
        <img src="${image}" alt="Imagem do pet" />
      </div>
      <div class="list__item__header">
        <h2>${name}</h2>
        <i class="ph-fill ph-heart"></i>
      </div>
      <div class="list__item__description">
        <p><b>Idade:</b> ${age} anos</p>
        <p><b>Sexo:</b> ${gender}</p>
      </div>
      <div class="list__item__tags">
        ${castrated ? '<span>Castrado</span>' : ''}
        ${vaccinated ? '<span>Vacinado</span>' : ''}
        ${dewormed ? '<span>Vermificado</span>' : ''}
      </div>
    </div>
  `
}

async function loadPets(page = 1) {
  const res = await fetch(`http://localhost:3001/pets?page=${page}&size=9`);
  const data = await res.json();
  const items_area = document.getElementById('items_area');
  const list = document.createElement('div');
  
  if(!res.ok) {
    list.setAttribute('class', 'list__no-result');   
    list.innerHTML = `<p>${data.error}</p>`;
    items_area.innerHTML = ""
    items_area.appendChild(list);
    return;
  }
  
  const { items, total  } = data;
  
  if(items.length > 0) { 
    items.forEach(item => {
      const { age, castrated, dewormed, gender, id, image, name, size, type, vaccinated } = item;
      list.innerHTML += createPetItem({ age, castrated, dewormed, gender, id, image, name, size, type, vaccinated });
    });
    list.setAttribute('class', 'list');    
    items_area.innerHTML = ""
    items_area.appendChild(list);
    items_area.innerHTML += loadPagination({ page, total, size: 9 });
    return;
  }
  
  list.setAttribute('class', 'list__no-result');   
  list.innerHTML = '<p>Sem resultados</p>';
  items_area.innerHTML = ""
  items_area.appendChild(list);
}

loadPets();