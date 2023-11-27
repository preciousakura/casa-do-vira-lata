function removeTable() {
    const table = document.querySelector('.content-page-table__table');
    if (table) {
        table.remove();
        const noResultDiv = document.createElement('div');
        noResultDiv.setAttribute('class', 'list__no-result');   
        noResultDiv.innerHTML = '<p>Sem resultados</p>';
        items_area.innerHTML = ""; // Limpa a área de itens para remover a tabela vazia
        items_area.appendChild(noResultDiv);
    }
  }
  
function acceptAdoptionRequest(solicitationId) {
    fetch(`http://localhost:3001/adoptions/${solicitationId}/accept`, { method: 'PUT' })
        .then(response => {
            if (response.ok) {
                const table = document.querySelector('.content-page-table__table');
              if(table.rows.length <= 2) {
                removeTable()
              }
                document.getElementById(`solicitation-row-${solicitationId}`).remove();
            } else {
                throw new Error('Falha ao aceitar solicitação.');
            }
        })
        .catch(error => console.error('Erro:', error));
}

function rejectAdoptionRequest(solicitationId) {
    fetch(`http://localhost:3001/adoptions/${solicitationId}/reject`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                const table = document.querySelector('.content-page-table__table');
              if(table.rows.length <= 2) {
                removeTable()
              }
                document.getElementById(`solicitation-row-${solicitationId}`).remove();
            } else {
                throw new Error('Falha ao rejeitar solicitação.');
            }
        })
        .catch(error => console.error('Erro:', error));
}
