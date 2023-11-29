const fs = require('fs')

function paginatedData(data, page, size) {
  if((page - 1) < 0) return { items: [], total: 0 }
  const result = data.items.slice((page - 1) * size, ((page - 1) * size) + size);
  return { items: result, total: data.items.length }
}

module.exports = paginatedData;
