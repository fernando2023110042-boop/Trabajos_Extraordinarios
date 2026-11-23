const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const puerto = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const rutaProductos = path.join(__dirname, 'public', 'productos.json');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'productos.html'));
});

app.get('/api/products', (req, res) => {
    const productos = JSON.parse(fs.readFileSync(rutaProductos, 'utf8'));
    res.json(productos);
});

app.post('/api/products', (req, res) => {
    const productos = JSON.parse(fs.readFileSync(rutaProductos, 'utf8'));

    const nuevoProducto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        lugar: req.body.lugar
    };

    productos.push(nuevoProducto);

    fs.writeFileSync(rutaProductos, JSON.stringify(productos, null, 4));

    res.json({
        mensaje: 'Producto agregado correctamente',
        producto: nuevoProducto
    });
});

app.delete('/api/products/:index', (req, res) => {
    const productos = JSON.parse(fs.readFileSync(rutaProductos, 'utf8'));

    const index = parseInt(req.params.index);

    productos.splice(index, 1);

    fs.writeFileSync(rutaProductos, JSON.stringify(productos, null, 4));

    res.json({
        mensaje: 'Producto eliminado correctamente'
    });
});

app.put('/api/products/:index', (req, res) => {
    const productos = JSON.parse(fs.readFileSync(rutaProductos, 'utf8'));

    const index = parseInt(req.params.index);

    const productoEditado = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        lugar: req.body.lugar
    };

    productos[index] = productoEditado;

    fs.writeFileSync(rutaProductos, JSON.stringify(productos, null, 4));

    res.json({
        mensaje: 'Producto editado correctamente',
        producto: productoEditado
    });
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});