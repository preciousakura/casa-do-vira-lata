function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModalSuccessSolicit(){
    window.location.href = '/user-default';
    closeModal('modal-sucess-solicit-moder')

}
function closeModalErrorSolicit(){
   
    closeModal('modal-error-solicit-moder')

}

