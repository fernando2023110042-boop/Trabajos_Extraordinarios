CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    lugar VARCHAR(100) NOT NULL
);

INSERT INTO productos (nombre, precio, lugar) VALUES
('PlayStation 5 Pro', 15000, 'Amazon'),
('MacBook Pro M3', 28000, 'Apple Store'),
('Monitor LG OLED 27"', 14000, 'Best Buy'),
('Audífonos Sony WH-1000XM5', 6500, 'Liverpool'),
('Teclado Mecánico Keychron Q1', 2900, 'Keychron Store'),
('Silla Herman Miller Embody', 25000, 'Herman Miller Store'),
('Nintendo Switch 2', 9500, 'Sams'),
('Mouse Logitech MX Master 3S', 1700, 'Amazon'),
('Escritorio Elevable Jarvis', 10000, 'Fully'),
('Consola Steam Deck OLED', 11500, 'Steam Store');