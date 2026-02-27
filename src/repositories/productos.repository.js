const pool = require('../db');

class ProductosRepository {
    
    // Trae todos los servicios de barbería
    async getAll() {
        const result = await pool.query('SELECT id, nombre, precio FROM productos ORDER BY id ASC;');
        return result.rows;
    }


    async getAllActive() {
        const result = await pool.query(
            'SELECT id, nombre, precio FROM productos ORDER BY id ASC;'
        );
        return result.rows;
    }


    async getById(id) {
        const result = await pool.query(
            'SELECT id, nombre, precio FROM productos WHERE id = $1;', [id]
        );
        return result.rows[0];
    }


    async buscar(data) {
        const result = await pool.query(
            'SELECT id, nombre, precio FROM productos WHERE nombre ILIKE $1 OR precio = $2',
            [`%${data.nombre}%`, data.precio || null]
        )
        return result.rows;
    }

    async create(nombre, precio) {
        const result = await pool.query(
            'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING id, nombre, precio;',
            [nombre, precio] 
        );
        return result.rows[0];
    }

    async update(id, data) {
        const result = await pool.query(
            'UPDATE productos SET nombre = COALESCE($1, nombre), precio = COALESCE($2, precio), updatedat = NOW() WHERE id = $3 RETURNING id, nombre, precio',
            [
                data.nombre || null,
                data.precio || null,
                id
            ]
        );
        return result.rows[0] || null;
    }

    async delete(id) {
        const result = await pool.query(
            'DELETE FROM productos WHERE id = $1 RETURNING id', [id]
        )
        return result.rows[0] || null;
    }


    async getAllActivePaginated(page, limit) {
        const offset = (page - 1) * limit;

        const queryData = `
            SELECT id, nombre, precio 
            FROM productos 
            ORDER BY id ASC
            LIMIT $1 OFFSET $2;
        `;
        const resultData = await pool.query(queryData, [limit, offset]);

        const queryCount = 'SELECT COUNT(*) FROM productos;';
        const resultCount = await pool.query(queryCount);
        const total = parseInt(resultCount.rows[0].count);

        return { 
            data: resultData.rows, 
            total: total 
        };
    } 
} 

module.exports = { ProductosRepository };