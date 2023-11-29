async function adoptMe(e, petId) {
  e.preventDefault();
  const data = new FormData(e.target);
  try {
    const user = getUserFromCookie();
    const res = await fetch(`http://localhost:3001/pets/adopt?petId=${petId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token
      },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    })
    if(res.ok) openModal("modal-sucess-solicit-adopt");
    else openModal("modal-error-solicit-adopt");
  } catch (err) {
    openModal("modal-error-solicit-adopt");
  }
}

function redirectToUserDefault() {
  window.location.href = "/user-default";
}

