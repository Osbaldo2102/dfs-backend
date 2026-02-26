function validarProducto({ nombre, precio, marca, categoria }) {
    
    if (!nombre || typeof nombre !== 'string') {
        return { ok: false, error: 'Nombre es obligatorio y debe ser texto' };
    }

    const p = Number(precio);
    if (!Number.isFinite(p) || p <= 0) {
        return { ok: false, error: 'Precio debe ser un número positivo' };
    }

    return { 
        ok: true, 
        data: { nombre, precio: p, marca, categoria } 
    };
}

module.exports = {
    validarProducto
};