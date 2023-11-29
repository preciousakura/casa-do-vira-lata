function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

function closeModalSuccessSolicit() {
  window.location.href = "/user-default";
  closeModal("modal-sucess-solicit-moder");
}
function closeModalErrorSolicit() {
  closeModal("modal-error-solicit-moder");
}

function closeModalSuccessSolicitAdopt() {
  window.location.href = "/user-default";
  closeModal("modal-sucess-solicit-adopt");
}
function closeModalErrorSolicitAdopt() {
  closeModal("modal-error-solicit-adopt");
}
function closeModalSuccessSolicitAnimal() {
  window.location.href = "/moderator";
  closeModal("modal-sucess-solicit-animal");
}

function closeModalSuccessAnimalRegister() {
  window.location.href = "/pets";
  closeModal("modal-sucess-solicit-animal");
}
function closeModalErrorSolicitAnimal() {
  closeModal("modal-error-solicit-animal");
}
function closeModalSuccessSolicitListModSolic() {
  closeModal("modal-sucess-solicit-listModSolic");
}
function closeModalErrorSolicitListModSolic() {
  closeModal("modal-error-solicit-listModSolic");
}
function closeModalErrorSolicitListRejeitMod() {
  closeModal("modal-error-solicit-rejeitMod");
}
function closeModalSolicitListUsers() {
  closeModal("modal-sucess-solicit-listUsers");

  closeModal("modal-error-solicit-listUsers");
}
function closeModalSolicitListPets() {
  closeModal("modal-sucess-solicit-listPets");

  closeModal("modal-error-solicit-listPets");
}
