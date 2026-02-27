const pool = require('../db');

class CitasRepository {
    
    // 1. Crear una nueva cita (Lo que usa el cliente al agendar)
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

    // 2. Obtener todas las citas (Para el Panel del Admin)
    // Hacemos un JOIN con productos para saber qué servicio eligieron
    async getAll() {
        const query = `
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
            JOIN productos p ON c.servicio_id = p.id
            ORDER BY c.fecha DESC, c.hora DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // 3. Cambiar estado de la cita (Confirmar o Cancelar)
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

    // 5. Validar disponibilidad (Para que no agenden dos personas a la misma hora)
    async checkDisponibilidad(fecha, hora) {
        const query = 'SELECT id FROM citas WHERE fecha = $1 AND hora = $2 AND estado != $3';
        const result = await pool.query(query, [fecha, hora, 'cancelada']);
        return result.rows.length === 0; // true si está disponible
    }

    // 6. Obtener horas ocupadas de un día (Para el generador de horarios)
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