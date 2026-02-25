const { ProductosRepository } = require('../repositories/productos.repository.js');
const { validarProducto  }= require('../domain/productos.rules.js')

const repo = new ProductosRepository();

async function getAll(req, res) {
  const productos = await repo.getAll();
  return res.json(productos)
}

async function getAllVisible(req, res) {
  const productos = await repo.getAllActive()
  return res.json(productos)
}

async function getById(req, res) {
  const id = Number(req.params.id)
  const producto = await repo.getById(id)

  if (!producto) {
    return res.status(404).json({error: 'Producto no encontrado'})
  }

  return res.json(producto)
}

async function search(req, res) {
  console.log(Object.keys(req.query))
  const nombre = req.query.nombre;
  const precio = req.query.precio ?? null;
  const data = {
    nombre,
    precio
  }
  const resultados = await repo.buscar(data)

  if (!resultados || resultados.length === 0) {
    return res.status(404).json({error: 'no encontrado'})
  }
  return res.json(resultados)
}

async function create(req, res) {
  const { nombre, precio } = req.body;

  const data = validarProducto({ nombre, precio });

  if (data.error) {
    return res.status(400).json(data.error);
  }

  const nuevo = await repo.create(data.data.nombre, data.data.precio)
  return res.status(201).json(nuevo)
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { nombre, precio } = req.body;

  const payload = {
    nombre: nombre !== undefined ? nombre : undefined,
    precio: precio !== undefined ? precio : undefined
  }

  if (
    payload.precio !== undefined &&
    (!Number.isFinite(payload.precio) || payload.precio <= 0)
  ) {
    return res.status(400).json({error:'precio inválido'})
  }

  const actualizado = await repo.update(id, payload);

  if (!actualizado) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.json(actualizado)
}

async function remove(req, res) {
  const id = Number(req.params.id);

  const ok = await repo.delete(id)

  if (!ok) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.status(204).send()
}

module.exports = { getAll, getAllVisible, getById, search, create, update, remove }