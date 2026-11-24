CREATE DATABASE IF NOT EXISTS deportes_db;
USE deportes_db;

DROP TABLE IF EXISTS ordenes;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL DEFAULT 'CLIENTE'
);

CREATE TABLE IF NOT EXISTS categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255) DEFAULT '/Zapatillasrunning.webp',
    oferta INT DEFAULT 0,
    categoria_id BIGINT,
    CONSTRAINT fk_producto_categoria 
        FOREIGN KEY (categoria_id) REFERENCES categoria(id) 
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS boleta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total INT NOT NULL,
    usuario_id BIGINT,
    CONSTRAINT fk_boleta_usuario 
        FOREIGN KEY (usuario_id) REFERENCES usuario(id) 
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS detalle_boleta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT NOT NULL,
    precio_unitario INT NOT NULL,
    boleta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    CONSTRAINT fk_detalle_boleta 
        FOREIGN KEY (boleta_id) REFERENCES boleta(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto 
        FOREIGN KEY (producto_id) REFERENCES producto(id) 
        ON DELETE RESTRICT
);

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE detalle_boleta;
TRUNCATE TABLE boleta;
TRUNCATE TABLE producto;
TRUNCATE TABLE categoria;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO categoria (id, nombre) VALUES
(1, 'Calzado'),
(2, 'Fútbol'),
(3, 'Ropa'),
(4, 'Fitness'),
(5, 'Tenis'),
(6, 'Suplementos'),
(7, 'Ciclismo'),
(8, 'Accesorios');

INSERT INTO producto (nombre, precio, stock, imagen, oferta, categoria_id) VALUES
('Zapatillas Running Pro', 89990, 12, '/Zapatillasrunning.webp', 1, 1),
('Balón de Fútbol Profesional', 29990, 25, '/Balonfutbol.webp', 0, 2),
('Polera Deportiva Dry-Fit', 19990, 18, '/Poleradryfit.webp', 0, 3),
('Mancuernas Hexagonales 10kg', 45990, 5, '/Mancuernas.webp', 1, 4),
('Raqueta de Tenis Pro Staff', 119990, 4, '/Raquetatenis.webp', 0, 5),
('Proteína Whey Isolate 2kg', 54990, 8, '/Proteina.webp', 1, 6),
('Short de Entrenamiento', 14990, 20, '/Shortdeportivo.webp', 0, 3),
('Guantes de Boxeo Pro 14oz', 39990, 7, '/Guanteboxeo.webp', 0, 4),
('Bicicleta de Montaña R29', 289900, 3, '/Bici.webp', 1, 7),
('Casco para Ciclismo', 32990, 10, '/Casco.webp', 0, 7),
('Mat de Yoga Antideslizante', 12999, 15, '/Matdeyoga.webp', 0, 4),
('Botella Térmica Deportiva 1L', 9990, 30, '/Botella.webp', 1, 8);

SELECT p.id, p.nombre, p.precio, p.stock, p.oferta, c.nombre AS categoria
FROM producto p
INNER JOIN categoria c ON p.categoria_id = c.id;

SELECT id, nombre, email, rol FROM usuario; 