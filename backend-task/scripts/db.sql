CREATE DATABASE IF NOT EXISTS tasksdb;

USE tasksdb;

CREATE TABLE IF NOT EXISTS tasks(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE,
    nombre_proveedor VARCHAR(255),
    direccion VARCHAR(255),
    rtn VARCHAR(20),
    fecha_factura DATE,
    tipo_factura VARCHAR(50),
    sub_total DECIMAL(10, 2),
    isv DECIMAL(10, 2),
    total_factura DECIMAL(10, 2)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50),
    cantidad_producto INT,
    descripcion_producto VARCHAR(255),
    precio_producto DECIMAL(10, 2),
    total_por_producto DECIMAL(10, 2),
    numero_factura VARCHAR(50),
    FOREIGN KEY (numero_factura) REFERENCES invoices(numero_factura)
);