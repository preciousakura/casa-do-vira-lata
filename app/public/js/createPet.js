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
