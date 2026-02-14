const { ProductosRepository } = require('../repositories/productos.repository');

const pool = require('../db'); 

const repo = new ProductosRepository();
let productoId;

test('crea un producto', async () => {
    const resultado = await repo.create({ nombre: 'Cobija', precio: 200 });
    
    productoId = resultado.id; 
    
    expect(resultado).toBeTruthy();
    expect(resultado.nombre).toBe('Cobija');
    
    expect(Number(resultado.precio)).toBe(200); 
});

afterAll(async () => {
    if(pool && pool.end) {
        await pool.end();
    } else {
        console.log('No pude cerrar la conexión: "pool" no está definido correctamente.');
    }
});