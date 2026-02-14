const { ProductosRepository } = require('../repositories/productos.repository');
const repo = new ProductosRepository();
const { validarProducto } = require('../../domain/productos.rules');
//getall
async function getAll(req, res) {
    try {
        console.log("1. Entrando al controller getAll"); 
        
        //llamar al repo
        const productos = await repo.getAll();
        
        console.log("2. Datos recibidos del repo:", productos); 
        
        return res.json(productos);
    } catch (error) {
        console.error("ERROR FATAL EN GET ALL:", error); 
        
        return res.status(500).json({ error: error.message });
    }
}

//search
async function search(req, res) {
    try {
        let {nombre, minPrecio, maxPrecio, page = 1, limit = 10} = req.query;
        // Validar numeros
        page = Number(page);
        limit = Number(limit);
        minPrecio = minPrecio ? Number(minPrecio) : null;
        maxPrecio = maxPrecio ? Number(maxPrecio) : null;

        if (isNaN(page) || page <= 0) {
            return res.status(400).json({ error: 'Página inválida' });
        }

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ error: 'Límite inválido' });
        }

        const resultados = await repo.search({
            nombre,
            minPrecio, 
            maxPrecio, 
            page, 
            limit
    });
       
            return res.json(resultados);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

//getbyid
async function getById(req, res) {
    try {
        const id = Number(req.params.id);
        const producto = await repo.getById(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        return res.json(producto);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
//newcreate
async function create(req, res) {
    // 1. Extraemos los datos que envía el usuario
    const { nombre, precio, marca, categoria } = req.body;

    // 2. Usamos tu nueva función de dominio/reglas para validar
    const resultado = validarProducto({ nombre, precio, marca, categoria: categoria });

    // 3. Si la validación devuelve error, cortamos aquí
    if (!resultado.ok) {
        return res.status(400).json({ error: resultado.error });
    }

    try {
        // 4. Si todo está bien, guardamos usando los datos LIMPIOS (data)
        // NOTA: Le pasamos 'data' completo porque tu repo espera un objeto
        const nuevo = await repo.create(resultado.data);

        return res.status(201).json(nuevo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

//newupdate
async function update(req, res) {
    try {
        const id = Number(req.params.id);
        const { nombre, precio } = req.body;

        if (precio !== undefined && 
           (!Number.isFinite(Number(precio)) || Number(precio) <= 0)) {
            return res.status(400).json({ error: 'Precio inválido' });
        }

        const actualizado = await repo.update(id, req.body);

        if (!actualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json(actualizado);

    } catch (error) {
        console.error("error en update:", error);
        return res.status(500).json({ error: error.message });
    }
}

//remove
async function remove(req, res) {
    try {
        const id = Number(req.params.id);

        const productoEliminado = await repo.getById(id);

        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json({
            message: 'Producto eliminado exitosamente',
            producto: productoEliminado
        }); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getAll, getById, search, create, update, remove };