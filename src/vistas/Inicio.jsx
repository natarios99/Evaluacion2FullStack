import React from 'react';
import '/css/inicio.css';

export default function Inicio({ cambiarVista }) {
  return (
    <div className="inicio-container">
      <div className="inicio-hero">
        <h1 className="inicio-hero-titulo">EQUÍPATE PARA EL DEPORTE</h1>
        <p className="inicio-hero-subtitulo">Encuentra el mejor material deportivo al mejor precio.</p>
        <button className="inicio-btn-principal" onClick={() => cambiarVista('categorias')}>
          Ver Catálogo Completo
        </button>
      </div>

      <div className="inicio-grid">
        <div className="inicio-card">
          <div>
            <h3 className="inicio-card-titulo">Calzado Deportivo</h3>
            <p className="inicio-card-texto">Zapatillas para running, fútbol y entrenamiento.</p>
          </div>
          <button className="inicio-btn-secundario" onClick={() => cambiarVista('categorias')}>
            Ver Calzado
          </button>
        </div>

        <div className="inicio-card">
          <div>
            <h3 className="inicio-card-titulo">Ofertas Especiales</h3>
            <p className="inicio-card-texto">Descuentos exclusivos en equipamiento seleccionado.</p>
          </div>
          <button className="inicio-btn-oferta" onClick={() => cambiarVista('ofertas')}>
            Ver Ofertas
          </button>
        </div>

        <div className="inicio-card">
          <div>
            <h3 className="inicio-card-titulo">Blog Deportivo</h3>
            <p className="inicio-card-texto">Consejos de entrenamiento, nutrición y rendimiento.</p>
          </div>
          <button className="inicio-btn-secundario" onClick={() => cambiarVista('blogs')}>
            Leer Artículos
          </button>
        </div>
      </div>
    </div>
  );
}