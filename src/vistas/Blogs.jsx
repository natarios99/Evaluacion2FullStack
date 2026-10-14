import React, { useState } from 'react';
import '/css/blogs.css';

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
    <div className="blogs-contenedor">
      <h2 className="blogs-titulo-principal">Blog de Deporte y Vida Sana</h2>
      
      {blogSeleccionado ? (
        <div className="blog-detalle-card">
          <button className="blog-boton-volver" onClick={() => setBlogSeleccionado(null)}>
            ← Volver a Blogs
          </button>
          <h3 className="blog-detalle-titulo">{blogSeleccionado.titulo}</h3>
          <p className="blog-detalle-contenido">{blogSeleccionado.contenido}</p>
        </div>
      ) : (
        <div className="blogs-grid">
          {listaBlogs.map(b => (
            <div key={b.id} className="blog-tarjeta">
              <h5 className="blog-titulo">{b.titulo}</h5>
              <p className="blog-resumen">{b.resumen}</p>
              <button className="blog-boton-leer" onClick={() => setBlogSeleccionado(b)}>
                Leer Artículo Completo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}