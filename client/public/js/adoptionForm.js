// // adoptionForm.js
// document.addEventListener("DOMContentLoaded", (event) => {
//   const form = document.getElementById("adoptionForm");
//   const successModal = document.getElementById("successModal");

//   form.addEventListener("submit", function (event) {
//     event.preventDefault();
//     openModal("modal-adoption");
//     form.reset(); 
//     const formData = new FormData(this);
//     fetch("/submit-adoption-form", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         successModal.style.display = "block";
//       })
//       .catch((error) => {
//         console.error(
//           "Houve um problema com a operação fetch: " + error.message
//         );
//       });
//   });
// });

async function adoptMe(e, petId, userId) {
  e.preventDefault();
  const data = new FormData(e.target);
  try {
    const res = await fetch(`http://localhost:3001/pets/adopt?userId=${userId}&petId=${petId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    })
    if(res.ok) alert("Solicitação de adoção realizada com sucesso!")
    else alert("Erro ao solicitar animal")
  } catch (err) {
    alert("Erro ao solicitar animal")
  }
}

function redirectToUserDefault() {
  window.location.href = "/user-default";
}
function openModal(modalId) {
  var modal = document.getElementById(modalId);
  modal.classList.add("modal_fade--active");
}

function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  modal.classList.remove("modal_fade--active");

  var callbackName = modal.getAttribute("data-onclose");
  if (callbackName && typeof window[callbackName] === "function") {
    window[callbackName]();
  }
}
