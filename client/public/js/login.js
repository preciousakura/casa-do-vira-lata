function logout() {
    localStorage.removeItem('favorites');
  
    fetch('/logout')
      .then(() => {
        window.location.href = '/';
      })
      .catch(error => console.error('Erro ao fazer logout:', error));
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    var logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
      logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir o comportamento padrão de redirecionamento
        logout();
      });
    }
  });
