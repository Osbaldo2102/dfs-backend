async function getExchangeRate() {
  try {
    
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (!response.ok) {
      throw new Error('Error al consultar la API externa');
    }

    const data = await response.json();
    
    // Accedemos al precio del dólar en pesos mexicanos (MXN)
    return data.rates.MXN; 
  } catch (error) {
    console.error('Error en el servicio externo:', error.message);
    // Devolvemos un valor por defecto o lanzamos el error para que el index lo cachee
    throw error; 
  }
}

module.exports = { getExchangeRate };