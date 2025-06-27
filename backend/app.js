const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'https://gestionmax.netlify.app',
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'gestionmax_supersecreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: true
    }
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('🟢 Conectado a MongoDB'))
.catch(err => console.error('🔴 Error de conexión:', err));

// Rutas
const authRoutes = require('./routes/auth');
app.use(authRoutes);

const User = require('./models/user');

// Ruta protegida para validar sesión
app.get('/api/usuario-actual', (req, res) => {
    if (!req.session.usuarioId) {
        return res.status(401).json({ mensaje: 'No autorizado' });
    }

    res.json({ mensaje: 'Usuario autenticado', usuarioId: req.session.usuarioId });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
