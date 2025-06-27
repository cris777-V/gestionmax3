// frontend/registro.js

const form = document.getElementById('form-registro');
const errorMsg = document.getElementById('error-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const contraseña = form.contraseña.value;

  try {
    const res = await fetch('https://gestionmax3.onrender.com/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // 👈 importante para que se envíe la cookie
      body: JSON.stringify({ nombre, correo, contraseña })
    });

    if (res.ok) {
      window.location.href = 'login.html'; // 👈 mejor redirigir al login
    } else {
      const errorText = await res.text();
      errorMsg.textContent = errorText || 'Error al registrar';
    }
  } catch (err) {
    errorMsg.textContent = 'Error de red. Intenta de nuevo.';
  }
});
