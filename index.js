const express = require('express');
const cors = require('cors'); 
const rateLimit = require('express-rate-limit');
const pool = require('./src/db');
const { sign, authMiddleware } = require('./src/auth');
const { router: productosRouter} = require('./src/routes/productos.routes');
const { router: userRouter } = require('./src/routes/user.routes');
const { getExchangeRate } = require('./src/services/external.service'); 

const PORT = process.env.PORT || 4000;
const app = express();

app.set('trust proxy', 1); 

app.use(express.json());

// Agregué el puerto 3000 que es el que usa Next.js por defecto
const allowed = [
    'http://localhost:4000',
    'http://localhost:4001',
    'http://localhost:3000', 
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

app.use(express.json());

// Logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// RUTAS PUBLICAS
app.get('/', (req, res) => res.send('API OK'));

// API EXTERNA (Con manejo de errores básico)
app.get('/api/externa/precio-dolar', async (req, res, next) => {
  try {
    const rate = await getExchangeRate();
    res.json({ moneda: 'MXN', precio: rate });
  } catch (error) {
    next(error); // Esto lo envía al errorHandler
  }
});

app.use('/productos', productosRouter);
app.use('/users', userRouter);

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
  console.log(`Servidor Corriendo en el puerto ${PORT}, y todo funciona bien!!`);
});