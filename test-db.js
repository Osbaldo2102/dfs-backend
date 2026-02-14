const pool = require('./src/db'); 

(async () => {
    try {
        const r1 = await pool.query('select 1 as ok');
        console.log('Prueba select 1:', r1.rows);

        const r2 = await pool.query(
            'select id, nombre, precio from productos order by id desc limit 5'
        );
        console.log('Mis productos:', r2.rows);

        let buscar = "Monitor"; 

        const r3 = await pool.query(
            'SELECT id, nombre, precio FROM productos WHERE nombre ILIKE $1',
            [`%${buscar}%`] 
        );
        
        console.log(`Resultados de búsqueda para '${buscar}':`, r3.rows);

    } catch (error) {
        console.error('Error conectando:', error);
    } finally {
        await pool.end();
    }
})();