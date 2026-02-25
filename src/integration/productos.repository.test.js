const { ProductosRepository } = require('../repositories/productos.repository');
const { pool } = require('../db');

describe('Integracion: ProductosRepository con DB real', () => {
  const repo = new ProductosRepository();
  let productoId;

  test('Create guarda en DB real', async () => {
    const created = await repo.create('Gabinete', 2000);
    productoId = created.id;

    expect(created).toBeTruthy();
    expect(created.nombre).toBe('Gabinete');
    expect(Number(created.precio)).toBeCloseTo(2000)
  });

  afterAll(async () => {
    await pool.query('delete from productos where id = $1', [productoId])
    await pool.end();
  })
});