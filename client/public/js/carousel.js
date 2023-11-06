const carouselContainer = document.querySelector(".carousel-inner");
const slides = document.querySelectorAll(".carousel-slide");

let currentIndex = 0;
const size = slides.length;

function nextSlide() {
  if (currentIndex + 1 === size - 1) currentIndex = 0;
  else currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

function updateCarousel() {
  const offset = -currentIndex * (100 / 2) + "%";
  carouselContainer.style.transform = `translateX(${offset})`;
}

setInterval(nextSlide, 10000);
