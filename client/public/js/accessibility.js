function changeFontSize(change) {
  document.querySelectorAll("*").forEach(function (element) {
    const currentSize = getComputedStyle(element)["font-size"];
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
  document.querySelectorAll("*").forEach(function (element) {
    element.style.fontSize = "";
  });
  localStorage.removeItem("elements-font-sizes");
}

function saveFontSizeSetting() {
  const elementsFontSize = {};
  document.querySelectorAll("*").forEach(function (element, index) {
    const fontSize = element.style.fontSize;
    if (fontSize) elementsFontSize[index] = fontSize;
  });
  localStorage.setItem("elements-font-sizes", JSON.stringify(elementsFontSize));
}

function loadFontSizeSetting() {
  const elementsFontSize = JSON.parse(
    localStorage.getItem("elements-font-sizes")
  );
  if (elementsFontSize) {
    document.querySelectorAll("*").forEach(function (element, index) {
      const fontSize = elementsFontSize[index];
      if (fontSize) {
        element.style.fontSize = fontSize;
      }
    });
  }
}

function toggleIcon(theme) {
  const icon = document.querySelector('#color-mode i');
  if (theme === 'dark') {
    icon.classList.remove('ph-sun');
    icon.classList.add('ph-moon');
  } else {
    icon.classList.remove('ph-moon');
    icon.classList.add('ph-sun');
  }
}

function saveColorMode() {
  const html = document.querySelector("html");
  let theme = '';

  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    theme = 'light';
  } else {
    html.classList.add("dark");
    theme = 'dark';
  }

  toggleIcon(theme);
  localStorage.setItem("color-mode", theme);
}


function loadColorMode() {
  const html = document.querySelector("html");
  const cur_color = localStorage.getItem("color-mode");
  
  if (cur_color) {
    if (cur_color === "dark") {
      html.classList.add("dark");
      toggleIcon('dark');
    } else {
      html.classList.remove("dark");
      toggleIcon('light');
    }
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const btnAumentar = document.getElementById("aumentar-fonte");
  const btnDiminuir = document.getElementById("diminuir-fonte");
  const btnReset = document.getElementById("reset-fonte");
  const color = document.getElementById("color-mode");

  btnAumentar.addEventListener("click", function () {
    changeFontSize(1);
  });
  btnDiminuir.addEventListener("click", function () {
    changeFontSize(-1);
  });
  btnReset.addEventListener("click", resetFontSize);
  color.addEventListener("click", saveColorMode);

  loadColorMode(); 
  loadFontSizeSetting();
});