const { validarProducto } = require('./productos.rules');

// Test 1: Nombre vacío
test('rechaza nombre vacio', () => {
    const r = validarProducto({ nombre: '', precio: 100 });
    expect(r.ok).toBe(false);
});

// Test 2: Precio negativo (Nuevo)
test('rechaza precio menor a cero', () => {
    const r = validarProducto({ nombre: 'Mouse', precio: -100 });
    expect(r.ok).toBe(false);
});

// Test 3: Precio cero (Nuevo)
test('rechaza precio igual a cero', () => {
    const r = validarProducto({ nombre: 'Mouse', precio: 0 });
    expect(r.ok).toBe(false);
});

test('convierte precio a string', () => {
    const r = validarProducto({ nombre:
        'Mouse', precio: '150' });

    expect(r.ok).toBe(true);
    expect(r.data.precio).toBe(150);
    })