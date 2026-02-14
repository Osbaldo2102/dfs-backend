const express = require('express');
const cors = require('cors'); 
const path = require('path'); 

const productosRouter = require('./src/routes/productos.routes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ok: true, service: 'api'});
});

app.use('/productos', productosRouter);

app.listen(3000, () => {
    console.log("Servidor listo en http://localhost:3000");
});