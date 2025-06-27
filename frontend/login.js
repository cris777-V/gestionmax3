const form = document.getElementById('form-login');
const errorMsg = document.getElementById('error-msg');

form.addEventListener('submit', async (e) => {
e.preventDefault();

const correo = form.correo.value;
const contraseña = form.contraseña.value;

try {
    const res = await fetch('https://gestionmax3.onrender.com/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
},
    credentials: 'include',
    body: JSON.stringify({ correo, contraseña })
    });

    if (res.ok) {
        window.location.href = 'index.html';
} else {
    const errorText = await res.text();
    errorMsg.textContent = errorText || 'Error al iniciar sesión';
    }
} catch (err) {
    errorMsg.textContent = 'Error de red. Intenta de nuevo.';
}
});
