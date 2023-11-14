function loadPagination({ page, total, size }) {
    return total > 0 && page <= Math.ceil(total/size) && total > size ? `
        <div class="pagination">
          ${page > 1 ? `<button onclick={loadPets(${page-1})}>Anterior</button>` : ''}
          <p>${page} página de ${Math.ceil(total/size)}</p>
          ${page < Math.ceil(total/size) ? `<button onclick={loadPets(${page+1})}>Próxima</button>` : ''}
        </div>
    ` : ''
}