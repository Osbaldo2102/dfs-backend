const pool = require('../db');

class ProductosRepository {
    
    async getAll() {
        const result = await pool.query('select id, nombre, precio from productos;');
        return result.rows;
    }


   async getAllActive() {
    const result = await pool.query(
      'select id, nombre, precio from productos where activo = true;'
    );
    return result.rows;
    // return this.productos.filter(producto => producto.active);
  }

  async getById(id) {
    const result = await pool.query(
      'select id, nombre, precio, stock, descripcion from productos where activo = true and id = $1;', [id]
    );
    return result.rows[0];
    // return this.productos.find(producto => producto.id === id);
  }

  async buscar(data) {
    const result = await pool.query(
      'select id, nombre, precio from productos where nombre like coalesce($1, nombre) or precio = coalesce($2, precio) and activo = true',[`%${data.nombre}%`, data.precio]
    )
    return result.rows;
  }

  async create(nombre, precio) {
    const result = await pool.query(
      'insert into productos (nombre, precio) values ($1,$2) returning id, nombre, precio;',[nombre, precio] 
    );
    return result.rows[0];
    // const newProducto = { id: this.nextId++, nombre, precio };
    // this.productos.push(newProducto);
    // return newProducto;
  }
  async update(id, data) {
    const result = await pool.query(
      'update productos set nombre = coalesce($1, nombre), precio = coalesce($2, precio) where id = $3 returning id, nombre, precio',
      [
        data.nombre ?? null,
        data.precio ?? null,
        id
      ]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query(
      'delete from productos where id = $1 returning id', [id]
    )

    return result.rows[0] || null;
  }

  async getAllActivePaginated(page, limit) {
    const offset = (page - 1) * limit;

    const queryData = `
      SELECT id, nombre, precio 
      FROM productos 
      WHERE activo = true 
      LIMIT $1 OFFSET $2;
    `;
    const resultData = await pool.query(queryData, [limit, offset]);

    const queryCount = 'SELECT COUNT(*) FROM productos WHERE activo = true;';
    const resultCount = await pool.query(queryCount);
    const total = parseInt(resultCount.rows[0].count);

    return { 
      data: resultData.rows, 
      total: total 
    };
    }   