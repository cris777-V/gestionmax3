// Verificar si el usuario está autenticado
fetch('https://gestionmax3.onrender.com/api/usuario-actual', {
  credentials: 'include'
})
.then(res => {
  if (!res.ok) {
    window.location.href = 'login.html';
  }
})
.catch(() => {
  window.location.href = 'login.html';
});

// Manejar el envío del formulario
const form = document.getElementById('form-contacto');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = form.nombre.value;
    const email = form.email.value;
    const mensaje = form.mensaje.value;

    // Aquí podrías enviar los datos a un backend más adelante
    console.log({ nombre, email, mensaje });

    alert('¡Formulario enviado! (esto es solo una simulación por ahora)');
    form.reset();
  });
}
