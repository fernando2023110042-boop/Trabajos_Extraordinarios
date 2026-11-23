const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const puerto = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda'
});

conexion.connect((error) => {
    if (error) {
        console.log('Error al conectar con MySQL:', error);
        return;
    }

    console.log('Conectado correctamente a MySQL');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'productos.html'));
});

app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM productos';

    conexion.query(sql, (error, resultados) => {
        if (error) {
            res.status(500).json({ mensaje: 'Error al obtener productos' });
            return;
        }

        res.json(resultados);
    });
});

app.post('/api/products', (req, res) => {
    const { nombre, precio, lugar } = req.body;

    const sql = 'INSERT INTO productos (nombre, precio, lugar) VALUES (?, ?, ?)';

    conexion.query(sql, [nombre, precio, lugar], (error, resultado) => {
        if (error) {
            res.status(500).json({ mensaje: 'Error al agregar producto' });
            return;
        }

        res.json({
            mensaje: 'Producto agregado correctamente',
            id: resultado.insertId
        });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, lugar } = req.body;

    const sql = 'UPDATE productos SET nombre = ?, precio = ?, lugar = ? WHERE id = ?';

    conexion.query(sql, [nombre, precio, lugar, id], (error) => {
        if (error) {
            res.status(500).json({ mensaje: 'Error al editar producto' });
            return;
        }

        res.json({ mensaje: 'Producto editado correctamente' });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM productos WHERE id = ?';

    conexion.query(sql, [id], (error) => {
        if (error) {
            res.status(500).json({ mensaje: 'Error al eliminar producto' });
            return;
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    });
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});