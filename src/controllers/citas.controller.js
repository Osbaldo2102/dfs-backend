const { CitasRepository } = require('../repositories/citas.repository');
const repo = new CitasRepository();

async function agendarCita(req, res) {
    try {
        const { cliente_nombre, cliente_telefono, servicio_id, fecha, hora } = req.body;

        // 1. Validar que no falten datos
        if (!cliente_nombre || !cliente_telefono || !servicio_id || !fecha || !hora) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // 2. Revisar si la hora ya está ocupada
        const disponible = await repo.checkDisponibilidad(fecha, hora);
        if (!disponible) {
            return res.status(409).json({ error: 'Esta hora ya está reservada. Elige otra, bro.' });
        }

        // 3. Guardar en la base de datos
        const nuevaCita = await repo.create(req.body);
        
        return res.status(201).json({
            ok: true,
            message: 'Cita agendada con éxito',
            data: nuevaCita
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function obtenerCitas(req, res) {
    try {
        const citas = await repo.getAll();
        return res.json(citas);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las citas' });
    }

async function actualizarEstadoCita(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body; // Recibimos el nuevo estado: 'confirmada' o 'cancelada'

        if (!['pendiente', 'confirmada', 'cancelada'].includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        const citaActualizada = await repo.updateEstado(id, estado);

        if (!citaActualizada) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        return res.json({
            ok: true,
            message: `Cita ${estado} con éxito`,
            data: citaActualizada
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar la cita' });
    }
}
}

module.exports = { agendarCita, obtenerCitas, actualizarEstadoCita };

