function changeFontSize(change) {
  document.querySelectorAll('*').forEach(function(element) {
    const currentSize = getComputedStyle(element)['font-size'];
    if (currentSize) {
      const newSize = parseFloat(currentSize) + change;
      if (newSize >= 1) {
        element.style.fontSize = `${newSize}px`;
      }
    }
  });
  saveFontSizeSetting();
}

function resetFontSize() {
  document.querySelectorAll('*').forEach(function(element) {
    element.style.fontSize = '';
  });
  localStorage.removeItem('elements-font-sizes');
}

function saveFontSizeSetting() {
  const elementsFontSize = {};
  document.querySelectorAll('*').forEach(function(element, index) {
    const fontSize = element.style.fontSize;
    if (fontSize) elementsFontSize[index] = fontSize;
  });
  localStorage.setItem('elements-font-sizes', JSON.stringify(elementsFontSize));
}

function loadFontSizeSetting() {
  const elementsFontSize = JSON.parse(localStorage.getItem('elements-font-sizes'));
  if (elementsFontSize) {
    document.querySelectorAll('*').forEach(function(element, index) {
      const fontSize = elementsFontSize[index];
      if (fontSize) {
        element.style.fontSize = fontSize;
      }
    });
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const btnAumentar = document.getElementById('aumentar-fonte');
  const btnDiminuir = document.getElementById('diminuir-fonte');
  const btnReset = document.getElementById('reset-fonte');

  btnAumentar.addEventListener('click', function() { changeFontSize(1); });
  btnDiminuir.addEventListener('click', function() { changeFontSize(-1); });
  btnReset.addEventListener('click', resetFontSize);

  // Carregar a configuração do tamanho da fonte ao iniciar
  loadFontSizeSetting();
});
