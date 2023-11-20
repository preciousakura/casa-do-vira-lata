const backendUrl = "http://localhost:3001";
function submitModeratorRequest(e, userId) {
  e.preventDefault();
  const reason = document.getElementById("user-solicitationReason").value;

  fetch(`${backendUrl}/send-user-solicitation-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, reason }),
  })
    .then((response) => {
      if (response.ok) {
         alert("Solicitação enviada com sucesso.");
      } else {
        // Exibir mensagem de erro
        alert("Falha ao enviar solicitação.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
