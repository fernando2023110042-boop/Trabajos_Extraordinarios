const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const puerto = 3000;

const app = express();
const servidor = http.createServer(app);
const io = new Server(servidor);

// Carpeta pública
app.use(express.static('public'));

let usuarios = {};

// Usuario conectado
io.on('connection', (socket) => {

    // 1. Usuario conectado
    console.log('Usuario conectado');

    // 2. Login
    socket.on('login', (usuario) => {
        usuarios[socket.id] = usuario;
        io.emit('usuariosConectados', usuarios);
        io.emit('mensajeSistema', `${usuario} se ha conectado`);
    });

    // 3. Mensaje General
    socket.on('mensajeGeneral', (datos) => {
        io.emit('mensajeGeneral', datos);
    });

    // 4. Mensaje Privado
    socket.on('mensajePrivado', (datos) => {
        const idDestino = datos.idDestino;
        socket.emit('mensajePrivadoEnviado', datos);
        io.to(idDestino).emit('mensajePrivadoRecibido', {
            usuario: usuarios[socket.id],
            mensaje: datos.mensaje
        });
    });

    // 5. Desconectado
    socket.on('disconnect', () => {
        const usuario = usuarios[socket.id];
        delete usuarios[socket.id];
        io.emit('usuariosConectados', usuarios);

        if (usuario) {
            io.emit('mensajeSistema', `${usuario} se ha desconectado`);
        }

        console.log('Usuario desconectado');
    });

});

servidor.listen(puerto, '0.0.0.0', () => {
    console.log(`Servidor ejecutandose en el puerto ${puerto}`);
});