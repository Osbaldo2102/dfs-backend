const { ProductosRepository } = require('../repositories/productos.repository');
// OJO: Asegúrate de que validarProducto no pida campos viejos (marca, stock, etc.)
const { validarProducto } = require('../domain/productos.rules');

const repo = new ProductosRepository();

async function getAll(req, res) {
  try {
    const productos = await repo.getAll();
    return res.json(productos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener servicios' });
  }
}

async function getAllVisible(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { data, total } = await repo.getAllActivePaginated(page, limit);

    return res.json({
      ok: true,
      data, // Aquí viajan tus cortes de pelo y barbas
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error en la paginación' });
  }
}

async function search(req, res) {
  const { nombre, precio } = req.query;
  const resultados = await repo.buscar({ nombre, precio });

  if (!resultados || resultados.length === 0) {
    return res.status(404).json({ error: 'Servicio no encontrado' });
  }
  return res.json(resultados);
}

async function getById(req, res) {
  const id = Number(req.params.id);
  const producto = await repo.getById(id);

  if (!producto) {
    return res.status(404).json({ error: 'Servicio no encontrado' });
  }

  return res.json(producto);
}

async function create(req, res) {
  const { nombre, precio } = req.body;
  
  // Si validarProducto te da problemas, puedes comentar esta línea y validar manual
  const data = validarProducto({ nombre, precio });

  if (data.error) {
    return res.status(400).json({ error: 'Datos de servicio inválidos', detalles: data.error });
  }

  const nuevo = await repo.create(data.data.nombre, data.data.precio);
  return res.status(201).json(nuevo);
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { nombre, precio } = req.body;

  // Solo actualizamos lo que viene en el body
  const payload = {};
  if (nombre !== undefined) payload.nombre = nombre;
  if (precio !== undefined) payload.precio = precio;

  if (payload.precio !== undefined && (isNaN(payload.precio) || payload.precio <= 0)) {
    return res.status(400).json({ error: 'Precio inválido' });
  }

  const actualizado = await repo.update(id, payload);

  if (!actualizado) {
    return res.status(404).json({ error: 'Servicio no encontrado' });
  }

  return res.json(actualizado);
}

async function remove(req, res) {
  const id = Number(req.params.id);
  const ok = await repo.delete(id);

  if (!ok) {
    return res.status(404).json({ error: 'Servicio no encontrado' });
  }

  return res.status(204).send(); // Eliminación exitosa
}

module.exports = { getAll, getAllVisible, getById, search, create, update, remove };