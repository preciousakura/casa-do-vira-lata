document
  .getElementById("animalRegistrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const animalData = {
      name: document.getElementById("name").value,
      age: parseInt(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      type: document.getElementById("type").value,
      size: document.getElementById("size").value,
      castrated: document.getElementById("castrated").checked,
      vaccinated: document.getElementById("vaccinated").checked,
      dewormed: document.getElementById("dewormed").checked,
      image: document.getElementById("image").value,
    };

    
  });
