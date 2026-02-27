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


async function obtenerHorariosDisponibles(req, res) {
  try {
    const { fecha } = req.query; // Recibimos la fecha 
    
    if (!fecha) {
      return res.status(400).json({ error: "La fecha es obligatoria" });
    }

    // 1. Definimos el horario de la barbería (puedes ajustarlo)
    const horarioApertura = 9; // 9:00 AM
    const horarioCierre = 19;  // 7:00 PM (última cita a las 18:30)
    
    const todosLosHorarios = [];
    for (let h = horarioApertura; h < horarioCierre; h++) {
      todosLosHorarios.push(`${h.toString().padStart(2, '0')}:00`);
      todosLosHorarios.push(`${h.toString().padStart(2, '0')}:30`);
    }

    // 2. Buscamos en la DB qué citas ya existen para ese día
    // Suponiendo que tu tabla se llama 'citas' y tiene columna 'fecha' y 'hora'
    const citasExistentes = await repo.findCitasByFecha(fecha); 
    
    // Mapeamos solo las horas ocupadas: ["10:00", "14:30", ...]
    const horasOcupadas = citasExistentes.map(c => {
    return c.hora ? c.hora.toString().substring(0, 5) : "";
});

    // 3. Filtramos: Solo dejamos las horas que NO están ocupadas
    const disponibles = todosLosHorarios.filter(hora => !horasOcupadas.includes(hora));

    return res.json({ disponibles });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al calcular horarios" });
  }
}

module.exports = { agendarCita, obtenerCitas, actualizarEstadoCita, obtenerHorariosDisponibles };