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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;


        const result = await repo.getAll(page, limit);

        res.json(result);
    } catch (error) {
        console.error("Error en obtenerCitas:", error);
        res.status(500).json({ error: 'Error al obtener citas paginadas' });
    }
}

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

async function obtenerHorariosDisponibles(req, res) {
  try {
    const { fecha } = req.query; 
    
    if (!fecha) {
      return res.status(400).json({ error: "La fecha es obligatoria" });
    }

    const horarioApertura = 9; 
    const horarioCierre = 19;  
    
    const todosLosHorarios = [];
    for (let h = horarioApertura; h < horarioCierre; h++) {
      todosLosHorarios.push(`${h.toString().padStart(2, '0')}:00`);
      todosLosHorarios.push(`${h.toString().padStart(2, '0')}:30`);
    }

    const citasExistentes = await repo.findCitasByFecha(fecha); 
    
    const horasOcupadas = citasExistentes.map(c => {
        return c.hora ? c.hora.toString().substring(0, 5) : "";
    });

    const disponibles = todosLosHorarios.filter(hora => !horasOcupadas.includes(hora));

    return res.json({ disponibles });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al calcular horarios" });
  }
}

module.exports = { agendarCita, obtenerCitas, actualizarEstadoCita, obtenerHorariosDisponibles };