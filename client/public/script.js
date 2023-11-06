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

document.addEventListener('DOMContentLoaded', function() {
  const userBtn = document.querySelector('.user-btn');
  const dropdownMenu = document.querySelector('.user-dropdown__menu');

  userBtn.addEventListener('click', function(event) {
    // Toggle dropdown visibility
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    event.stopPropagation();
  });

  window.addEventListener('click', function() {
    if (dropdownMenu.style.display === 'block') {
      dropdownMenu.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  let slideIndex = 1; 
  const slides = document.getElementsByClassName("carousel-slide");
  const totalSlides = slides.length;
  const slideWidth = slides[0].clientWidth;
  const carouselInner = document.querySelector(".carousel-inner");
  carouselInner.style.transform = `translateX(${-slideWidth * slideIndex}px)`; 

  function moveToSlide(n) {
    carouselInner.style.transition = 'transform 0.5s ease-in-out';
    carouselInner.style.transform = `translateX(${-slideWidth * n}px)`;
    slideIndex = n;
  }

  function showSlides(n) {
    moveToSlide(n);

    if (n === totalSlides - 1) { 
      setTimeout(() => {
        carouselInner.style.transition = 'none'; 
        moveToSlide(1);
      }, 500);
    } else if (n === 0) {
      setTimeout(() => {
        carouselInner.style.transition = 'none';
        moveToSlide(totalSlides - 2); 
      }, 500);
    }
  }

  document.querySelector('.next-button').addEventListener('click', function() {
    if (slideIndex >= totalSlides - 1) return; 
    showSlides(slideIndex + 1);
  });

  document.querySelector('.prev-button').addEventListener('click', function() {
    if (slideIndex <= 0) return; 
    showSlides(slideIndex - 1);
  });

  carouselInner.addEventListener('transitionend', () => {
    if (slides[slideIndex].id === 'first-clone') {
      carouselInner.style.transition = 'none';
      slideIndex = 1;
      carouselInner.style.transform = `translateX(${-slideWidth * slideIndex}px)`;
    } else if (slides[slideIndex].id === 'last-clone') {
      carouselInner.style.transition = 'none';
      slideIndex = totalSlides - 2;
      carouselInner.style.transform = `translateX(${-slideWidth * slideIndex}px)`;
    }
  });
});
