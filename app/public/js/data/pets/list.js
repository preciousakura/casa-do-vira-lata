

function getFavoritesFromLocalStorage() {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  }
  
  function createPetItem({ age, castrated, dewormed, gender, id, image, name, size, type, vaccinated, status}, role, favorites) {
    return `
      <div class="list__item">
        <div class="list__item__image">
          <img src="${image}" alt="Imagem do pet" />
        </div>
        <div class="list__item__header">
          <h2>${name}</h2>
          <i onclick="addToFavorites('${id}')" class="ph-fill ph-heart ${favorites && favorites.includes(id) ? 'favorite' : ''}"></i>
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
        ${role && role === 'USER-DEFAULT' ? `<a class="adopt-button" href="/pets/adoption?petId=${id}">Adotar</a>` : ''}
      </div>
    `
  }
  
  async function loadPets(page = 1) {
    try {
        const user = getUserFromCookie();
        const res = await fetch(`http://localhost:3001/pets?page=${page}&size=9&non_adopeted=${true}`);
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
      
        const favorites = getFavoritesFromLocalStorage();
      
        if(items.length > 0) { 
          items.forEach(item => {
            const { age, castrated, dewormed, gender, id, image, name, size, type, vaccinated, status } = item;
            list.innerHTML += createPetItem({ age, castrated, dewormed, gender, id, image, name, size, type, vaccinated , status}, user?.role, favorites);
          });
          list.setAttribute('class', 'list');    
          items_area.innerHTML = ""
          items_area.appendChild(list);
          loadPagination({ page, total, size: 9 }, loadPets, items_area);
          return;
        }
        
        list.setAttribute('class', 'list__no-result');   
        list.innerHTML = '<p>Sem resultados</p>';
        items_area.innerHTML = ""
        items_area.appendChild(list);
    } catch (err) {
        window.location.href = "/";
    }
  }
  
  loadPets();
  
  
  