const express = require('express');
const cors = require('cors'); 
const pool = require('./src/db');
const { sign, authMiddleware } = require('./src/auth');
const productosRouter = require('./src/routes/productos.routes');
const path = require('path');

const PORT = process.env.PORT || 4000;
const app = express();

const allowed = [
    'http://localhost:4000',
    'http://localhost:4001',
]

app.use(cors({
    origin: function(origin, cb) {
        if(!origin) return cb(null, true); // Postman
        if(allowed.includes(origin)) return cb(null, true);
        return cb(new Error('CORS no permitido: ' + origin));
    }
}));




app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ok: true, service: 'api'});
});

app.use('/productos', productosRouter);

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email !== 'admin@test.com' || password !== '1234') {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = sign({ email, role: 'admin' });

    return res.json({ token });
});

app.get('/privado', authMiddleware, (req, res) => {
    return res.json({ message: 'Acceso concedido a ruta privada', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Servidor listo en el puerto ${PORT}`);
});