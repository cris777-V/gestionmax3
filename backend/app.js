const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS: permite solicitudes desde Netlify en desarrollo
app.use(cors({
    origin: ['https://gestionmax3.netlify.app', 'http://localhost:5173'],
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// 📦 MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 MongoDB conectado'))
    .catch(err => console.error('🔴 MongoDB error:', err));

// 👤 Modelo de usuario
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    contraseña: String
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// 📩 Registro
app.post('/registro', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;
    const existente = await Usuario.findOne({ correo });
    if (existente) return res.status(400).send('Ya existe ese usuario');

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevo = new Usuario({ nombre, correo, contraseña: hash });
    await nuevo.save();

    req.session.usuarioId = nuevo._id;
    res.status(200).json({ mensaje: 'Registrado correctamente' });
});

// 🔐 Login
app.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).send('Usuario no encontrado');

    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) return res.status(401).send('Contraseña incorrecta');

    req.session.usuarioId = usuario._id;
    res.status(200).json({ mensaje: 'Login exitoso' });
});

// 🧠 Usuario actual
app.get('/api/usuario-actual', async (req, res) => {
    if (!req.session.usuarioId) {
        return res.status(401).json({ mensaje: 'No autorizado' });
    }
    const usuario = await Usuario.findById(req.session.usuarioId).select('-contraseña');
    res.json(usuario);
});

// 🚪 Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ mensaje: 'Sesión cerrada' });
    });
});

// ✅ SERVIR FRONTEND ESTÁTICO (versión build)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// 🚀 Servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
