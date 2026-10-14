ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
FLUSH PRIVILEGES;


CREATE DATABASE IF NOT EXISTS deportes_db;
USE deportes_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
TRUNCATE TABLE usuarios;

INSERT INTO usuarios (nombre, email) VALUES 
('Carlos Gómez', 'carlos@example.com'),
('Ana López', 'ana@example.com');
CREATE DATABASE IF NOT EXISTS deportes_db;
USE deportes_db;


CREATE DATABASE IF NOT EXISTS deportes_db;
USE deportes_db;



CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio INT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255) DEFAULT '/Zapatillasrunning.webp',
    oferta TINYINT(1) DEFAULT 0
);

TRUNCATE TABLE productos;

INSERT INTO productos (nombre, precio, categoria, stock, imagen, oferta) VALUES 
('Zapatillas Running Pro', 89990, 'Calzado', 12, '/Zapatillasrunning.webp', 1),
('Balón de Fútbol Profesional', 29990, 'Fútbol', 25, '/Balonfutbol.webp', 0),
('Polera Deportiva Dry-Fit', 19990, 'Ropa', 18, '/Poleradryfit.webp', 0),
('Mancuernas Hexagonales 10kg', 45990, 'Fitness', 5, '/Mancuernas.webp', 1),
('Raqueta de Tenis Pro Staff', 119990, 'Tenis', 4, '/Raquetatenis.webp', 0),
('Proteína Whey Isolate 2kg', 54990, 'Suplementos', 8, '/Proteina.webp', 1),
('Short de Entrenamiento', 14990, 'Ropa', 20, '/Shortdeportivo.webp', 0),
('Guantes de Boxeo Pro 14oz', 39990, 'Fitness', 7, '/Guanteboxeo.webp', 0),
('Bicicleta de Montaña R29', 289900, 'Ciclismo', 3, '/Bici.webp', 1),
('Casco para Ciclismo', 32990, 'Ciclismo', 10, '/Casco.webp', 0),
('Mat de Yoga Antideslizante', 12999, 'Fitness', 15, '/Matdeyoga.webp', 0),
('Botella Térmica Deportiva 1L', 9990, 'Accesorios', 30, '/Botella.webp', 1);

select * FROM productos;
	 