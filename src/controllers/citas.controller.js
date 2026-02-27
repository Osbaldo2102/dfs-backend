const { CitasRepository } = require('../repositories/citas.repository');
const repo = new CitasRepository();

// 1. Crear cita
async function agendarCita(req, res) {
    try {
        const { cliente_nombre, cliente_telefono, servicio_id, fecha, hora } = req.body;
        if (!cliente_nombre || !cliente_telefono || !servicio_id || !fecha || !hora) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const disponible = await repo.checkDisponibilidad(fecha, hora);
        if (!disponible) {
            return res.status(409).json({ error: 'Esta hora ya está reservada.' });
        }
        const nuevaCita = await repo.create(req.body);
        return res.status(201).json({ ok: true, data: nuevaCita });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al agendar' });
    }
}

// 2. Obtener citas
async function obtenerCitas(req, res) {
    try {
        const citas = await repo.getAll();
        return res.json(citas);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener citas' });
    }
}

// 3. LA FUNCIÓN QUE FALTA (Asegúrate que se llame EXACTO así)
async function actualizarEstadoCita(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const citaActualizada = await repo.updateEstado(id, estado);
        if (!citaActualizada) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        return res.json({ ok: true, data: citaActualizada });
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar' });
    }
}

// Exportación (Revisa que los nombres coincidan con las funciones de arriba)
module.exports = { 
    agendarCita, 
    obtenerCitas, 
    actualizarEstadoCita 
};