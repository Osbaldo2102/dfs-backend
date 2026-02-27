const { CitasRepository } = require('../repositories/citas.repository');
const repo = new CitasRepository();

async function agendarCita(req, res) {
    try {
        const nuevaCita = await repo.create(req.body);
        res.status(201).json({ ok: true, data: nuevaCita });
    } catch (error) {
        res.status(500).json({ error: 'Error al agendar' });
    }
}

async function obtenerCitas(req, res) {
    try {
        const citas = await repo.getAll();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
}

// ESTA ES LA QUE RENDER DICE QUE TE FALTA
async function actualizarEstadoCita(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const actualizada = await repo.updateEstado(id, estado);
        res.json({ ok: true, data: actualizada });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
}

module.exports = { agendarCita, obtenerCitas, actualizarEstadoCita };