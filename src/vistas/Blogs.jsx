import React, { useState } from 'react';

export default function Blogs() {
  const [blogSeleccionado, setBlogSeleccionado] = useState(null);

  const listaBlogs = [
    {
      id: 1,
      titulo: 'Cómo elegir las zapatillas de running ideales según tu pisada',
      resumen: 'Aprende la diferencia entre pisada neutra, pronadora y supinadora para prevenir lesiones.',
      contenido: 'Elegir el calzado adecuado es fundamental para evitar fascitis plantar, periostitis o dolores articulares...'
    },
    {
      id: 2,
      titulo: 'Guía de suplementación: Proteína Whey vs Creatina',
      resumen: 'Descubre cómo y cuándo consumir cada suplemento para maximizar tu masa muscular.',
      contenido: 'La proteína de suero ayuda a la reparación muscular post-entrenamiento, mientras que la creatina aumenta la fuerza...'
    }
  ];

  return (
    <div className="container my-4">
      <h2>Blog de Deporte y Vida Sana</h2>
      
      {blogSeleccionado ? (
        <div className="card p-4 shadow-sm mt-3">
          <button className="btn btn-secondary w-25 mb-3" onClick={() => setBlogSeleccionado(null)}>← Volver a Blogs</button>
          <h3>{blogSeleccionado.titulo}</h3>
          <p className="mt-3 text-secondary">{blogSeleccionado.contenido}</p>
        </div>
      ) : (
        <div className="row g-4 mt-2">
          {listaBlogs.map(b => (
            <div key={b.id} className="col-md-6">
              <div className="card p-3 shadow-sm h-100">
                <h5>{b.titulo}</h5>
                <p className="text-muted">{b.resumen}</p>
                <button className="btn btn-primary mt-auto" onClick={() => setBlogSeleccionado(b)}>Leer Artículo Completo</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}