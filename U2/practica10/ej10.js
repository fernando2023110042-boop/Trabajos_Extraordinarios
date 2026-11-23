const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Rutas de la Práctica 9
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'productos.html'));
});

// Ruta de la Práctica 10: lee productos.json y muestra la tabla
app.get('/api/products', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'productos.json'), 'utf8');
  const productos = JSON.parse(data);

  // Si tu profesor pide ver el JSON crudo en lugar de la tabla HTML,
  // comenta todo lo de abajo y usa solo: return res.json(productos);

  let filas = '';
  productos.forEach((producto) => {
    filas += `
      <tr>
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td>${producto.lugar_venta}</td>
      </tr>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Productos desde JSON</title>
    </head>
    <body>
      <h1>Productos (desde JSON)</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Lugar de venta</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>
      <br>
      <a href="/">Volver a Home</a>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});