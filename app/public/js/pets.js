async function createPet(e) {
    e.preventDefault();
    try {
        const data = new FormData(e.target);
        const user = getUserFromCookie();
        const res = await fetch(`http://localhost:3001/pets`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token
          },
          body: JSON.stringify(Object.fromEntries(data.entries())),
        })

        if(res.ok) openModal("modal-sucess-solicit-animal");
        else openModal("modal-error-solicit-adopt");
    } catch (err) {
      openModal("modal-error-solicit-adopt");
    }
}


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

async function editPet(e, petId) {
  e.preventDefault();
  try {
      const data = new FormData(e.target);
      const user = getUserFromCookie();
      const res = await fetch(`http://localhost:3001/pets?petId=${petId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token
        },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      })
      if(res.ok) openModal("modal-sucess-solicit-animal");
      else openModal("modal-error-solicit-adopt");
  } catch (err) {
    openModal("modal-error-solicit-adopt");
  }
}