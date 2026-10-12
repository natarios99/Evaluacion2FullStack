const guardarProducto = async (nuevoProducto) => {
  try {
    const respuesta = await fetch(`${URL_API}/productos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(nuevoProducto)
    });

    if (respuesta.ok) {
      alert('Producto guardado con éxito');
      await cargarProductosDesdeMySQL(); // Recargar lista
    } else {
      const errorData = await respuesta.json();
      console.error('Respuesta de error del servidor:', errorData);
      alert('Error al intentar guardar el producto.');
    }
  } catch (error) {
    console.error('Error de red/conexión:', error);
  }
};