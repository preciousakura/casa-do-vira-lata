const carouselContainer = document.querySelector(".carousel-inner");
const slides = document.querySelectorAll(".carousel-slide");

let currentIndex = 0;
const size = Math.ceil(slides.length/2);

function prevSlide() {
  currentIndex = (currentIndex + 2) % size;
  updateCarousel();
}

function nextSlide() {
  currentIndex = (currentIndex - 2 + size) % size;
  updateCarousel();
}

function updateCarousel() {
  const offset = -currentIndex * 100 + "%";
  carouselContainer.style.transform = `translateX(${offset})`;
}

setInterval(nextSlide, 10000);
