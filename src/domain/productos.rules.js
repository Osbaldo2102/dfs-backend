function validarProducto({ nombre, precio }) {
    
    // Validamos que el nombre del servicio exista y sea real
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
        return { 
            ok: false, 
            error: 'El nombre del servicio es obligatorio (mínimo 3 caracteres)' 
        };
    }

    // Validamos que el precio sea un número válido para cobrar
    const p = Number(precio);
    if (isNaN(p) || p <= 0) {
        return { 
            ok: false, 
            error: 'El precio debe ser un número mayor a 0' 
        };
    }

    // Devolvemos solo la data limpia que la base de datos de SwiftCut espera
    return { 
        ok: true, 
        data: { 
            nombre: nombre.trim(), 
            precio: p 
        } 
    };
}

module.exports = {
    validarProducto
};