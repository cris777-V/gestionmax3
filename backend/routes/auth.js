const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

// Mostrar login (opcional si usas solo Netlify)
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Mostrar registro (opcional si usas solo Netlify)
router.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'registro.html'));
});

// Registro
router.post('/registro', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    try {
        const usuarioExistente = await User.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).send('Correo ya registrado');
        }

        const hash = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = new User({ nombre, correo, contraseña: hash });
        await nuevoUsuario.save();

        req.session.usuarioId = nuevoUsuario._id;
        res.redirect('https://gestionmax.netlify.app/');
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send('Error del servidor');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const usuario = await User.findOne({ correo });
        if (!usuario) return res.status(400).send('Usuario no encontrado');

        const valido = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!valido) return res.status(401).send('Contraseña incorrecta');

        req.session.usuarioId = usuario._id;
        res.redirect('https://gestionmax.netlify.app/');
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error del servidor');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('https://gestionmax.netlify.app/');
    });
});

module.exports = router;
