const pool = require('../db');

class ProductosRepository {
    


    async getAll() {
        const result = await pool.query('SELECT * FROM productos ORDER BY id DESC');
        return result.rows;
    }


    async search({nombre, minPrecio, maxPrecio, page, limit}) {

        const values = [];
        let where = [];
        let paramIndex = 1;

        // Filtro por nombre (ILIKE)
        if (nombre) {
                where.push(`nombre ILIKE $${paramIndex}`);
                values.push(`%${nombre}%`);
                paramIndex++;
        }

        // Filtro por precio mínimo
        if (minPrecio !== null) {
                where.push(`precio >= $${paramIndex}`);
                values.push(minPrecio);
                paramIndex++;
        }

        // Filtro por precio máximo
        if (maxPrecio !== null) {
                where.push(`precio <= $${paramIndex}`);
                values.push(maxPrecio);
                paramIndex++;
        }

        const whereClause = where.length > 0 
        ? `WHERE ${where.join(' AND ')}`
         : '';

         // Consulta total
        const countQuery = `
        SELECT COUNT(*)
        FROM productos
        ${whereClause}
        `;

        const countResult = await pool.query(countQuery, values);
        const total = Number(countResult.rows[0].count);

        // Paginacion
        const offset = (page - 1) * limit;

        const dataQuery = `
        SELECT *
        FROM productos
        ${whereClause}
        ORDER BY id DESC
        LIMIT $${paramIndex} 
        OFFSET $${paramIndex + 1}
        `;
        const dataResult = await pool.query(
            dataQuery,
            [...values, limit, offset]
        );

        return {
            data: dataResult.rows,
            page,
            limit,
            total
        };
    }

    async getById(id) {
        const result = await pool.query(
            'SELECT id, nombre, precio, marca, categoria FROM productos WHERE id = $1',
            [id]
        );
        return result.rows[0]; 
    }

    async create(data) {
        const { nombre, precio, marca, categoria } = data;

        const result = await pool.query(
            `INSERT INTO productos 
            (nombre, precio, marca, categoria) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [
                nombre, 
                precio, 
                marca, 
                categoria,
            ]
        );
        return result.rows[0];
    }

    async update(id, data) {
        // Extraemos los datos que llegan
        const { nombre, precio } = data;

        const result = await pool.query(
            // COALESCE evita que borremos datos si no los enviamos
            'UPDATE productos SET nombre = COALESCE($1, nombre), precio = COALESCE($2, precio) WHERE id = $3 RETURNING *',
            
            // "?? null" asegura que si es undefined, se mande un null real a la base de datos
            [nombre ?? null, precio ?? null, id]
        );

        // Si no encontró nada devuelve null
        return result.rows[0] || null;
    }

    async delete(id) {
        const result = await pool.query(
            'DELETE FROM productos WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rowCount > 0 || null;
    }
}

module.exports = { ProductosRepository };