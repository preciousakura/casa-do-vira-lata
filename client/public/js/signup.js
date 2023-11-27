const backendUrl = "http://localhost:3001";

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
});

async function handleSignupSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name, email, phone, password
        })
    });

    if (response.ok) {
        // Se a resposta for positiva, redireciona para a página de login ou outra página de sucesso
        window.location.href = '/login';
    } else {
        // Tratamento de erro
        alert('Erro ao efetuar o cadastro. Por favor, tente novamente.');
    }
}
