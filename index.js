const express = require('express');
const cors = require('cors'); 
const rateLimit = require('express-rate-limit');
const pool = require('./src/db');
const { sign, authMiddleware } = require('./src/auth');
const { router: productosRouter} = require('./src/routes/productos.routes');
const { router: userRouter } = require('./src/routes/users.routes');
const { router: citasRouter } = require('./src/routes/citas.routes'); // 1. IMPORTAMOS CITAS
const { getExchangeRate } = require('./src/services/external.service'); 

const PORT = process.env.PORT || 4000;
const app = express();

app.set('trust proxy', 1); 

app.use(express.json());

const allowed = [
    'http://localhost:4000',
    'http://localhost:4001',
    'http://localhost:3000', 
    'https://dfs-front-flax.vercel.app',
]

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas solicitudes, por favor intente nuevamente más tarde.'
});

app.use(limiter);
app.use(cors({
    origin: function(origin, cb) {
        if(!origin) return cb(null, true);
        if(allowed.includes(origin)) return cb(null, true);
        return cb(new Error('CORS no permitido: ' + origin));
    }
}));

// Logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// RUTAS PUBLICAS
app.get('/', (req, res) => res.send('API SWIFTCUT OK 💈'));

// API EXTERNA
app.get('/api/externa/precio-dolar', async (req, res, next) => {
  try {
    const rate = await getExchangeRate();
    res.json({ moneda: 'MXN', precio: rate });
  } catch (error) {
    next(error);
  }
});

// --- RUTAS DE APOYO ---
app.get('/servicios', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, precio FROM productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// --- REGISTRO DE RUTAS ---
app.use('/productos', productosRouter);
app.use('/users', userRouter);
app.use('/citas', citasRouter); // 2. CONECTAMOS LA RUTA DE CITAS

// RUTA PRIVADA
app.get('/privado', authMiddleware, (req, res) => {
  return res.json({ ok: true, user: req.user });
});

// HEALTH CHECKS
app.get('/health', async (req, res) => {
  try {
    await pool.query('select 1');
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
});

app.get('/health/db', async (req, res) => {
  try {
    const r = await pool.query('select 1 as ok');
    return res.json({ok:true, db:r.rows[0].ok});
  } catch (err) {
    console.log('DB Error', err.message);
    return res.status(500).json({ok:false, error:'DB no disponible'});
  }
});

const { errorHandler } = require('./src/middlewares/error.middleware');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor Corriendo en puerto ${PORT}. ¡SwiftCut está en línea! 💈`);
});