const pool = require('../db');

class CitasRepository {
    
    // 1. Crear una nueva cita
    async create(data) {
        const { cliente_nombre, cliente_telefono, servicio_id, fecha, hora } = data;
        const query = `
            INSERT INTO citas (cliente_nombre, cliente_telefono, servicio_id, fecha, hora)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(query, [
            cliente_nombre, 
            cliente_telefono, 
            servicio_id, 
            fecha, 
            hora
        ]);
        return result.rows[0];
    }

    // 2. Obtener citas PAGINADAS (Para el Panel del Admin)
    async getAll(page = 1, limit = 10) {
        // Calculamos cuántos registros saltar
        const offset = (page - 1) * limit;

        try {
            // Consulta A: Obtener los datos con JOIN, LIMIT y OFFSET
            const dataQuery = `
                SELECT 
                    c.id, 
                    c.cliente_nombre, 
                    c.cliente_telefono, 
                    c.fecha, 
                    c.hora, 
                    c.estado,
                    p.nombre as servicio_nombre,
                    p.precio as servicio_precio
                FROM citas c
                LEFT JOIN productos p ON c.servicio_id = p.id
                ORDER BY c.fecha DESC, c.hora DESC
                LIMIT $1 OFFSET $2;
            `;
            
            // Consulta B: Obtener el total de registros para la paginación
            const countQuery = `SELECT COUNT(*) FROM citas;`;

            const [dataResult, countResult] = await Promise.all([
                pool.query(dataQuery, [limit, offset]),
                pool.query(countQuery)
            ]);

            const totalItems = parseInt(countResult.rows[0].count);

            // Devolvemos el objeto que el Controlador y el Frontend esperan
            return {
                data: dataResult.rows,
                pagination: {
                    totalItems: totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    limit: limit
                }
            };
        } catch (error) {
            console.error("Error en Repository getAll:", error);
            throw error;
        }
    }

    // 3. Cambiar estado de la cita
    async updateEstado(id, nuevoEstado) {
        const query = `
            UPDATE citas 
            SET estado = $1 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await pool.query(query, [nuevoEstado, id]);
        return result.rows[0];
    }

    // 4. Eliminar cita
    async delete(id) {
        const result = await pool.query('DELETE FROM citas WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }

    // 5. Validar disponibilidad
    async checkDisponibilidad(fecha, hora) {
        const query = 'SELECT id FROM citas WHERE fecha = $1 AND hora = $2 AND estado != $3';
        const result = await pool.query(query, [fecha, hora, 'cancelada']);
        return result.rows.length === 0;
    }

    // 6. Obtener horas ocupadas de un día
    async findCitasByFecha(fecha) {
        const query = `
            SELECT hora 
            FROM citas 
            WHERE fecha = $1 AND estado != 'cancelada';
        `;
        const result = await pool.query(query, [fecha]);
        return result.rows; 
    }
}

module.exports = { CitasRepository };