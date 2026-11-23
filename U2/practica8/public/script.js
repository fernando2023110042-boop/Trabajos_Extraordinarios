const socket = io();

let usuarioActual = "";
let idActual = "";

// 1. Al conectar
socket.on("connect", () => {
    idActual = socket.id;
});

// 2. Al entrar al chat
function entrarChat() {
    const usuario = document.getElementById("usuario").value.trim();

    if (usuario === "") {
        alert("Debe ingresar un nombre de usuario");
        return;
    }

    usuarioActual = usuario;
    socket.emit("login", usuario);
    document.getElementById("login").style.display = "none";
    document.getElementById("chatPrincipal").style.display = "block";
}

// 3. Al enviar mensaje General
function enviarMensajeGeneral() {
    const mensaje = document.getElementById("mensajeGeneral").value.trim();

    if (mensaje === "") {
        alert("No puede enviar mensajes vaíos");
        return;
    }

    const datos = {
        usuario: usuarioActual,
        mensaje: mensaje,
        hora: obtenerHora()
    };

    socket.emit("mensajeGeneral", datos);
    document.getElementById("mensajeGeneral").value = "";
}

// 4. Al enviar mensaje privado
function enviarMensajePrivado() {
    const idDestino = document.getElementById("usuarioDestino").value;
    const mensaje = document.getElementById("mensajePrivado").value.trim();

    if (idDestino === "") {
        alert("Debe seleccionar un usuario destino");
        return;
    }

    if (idDestino === idActual) {
        alert("No puede enviarse mensajes privados a usted mismo");
        return;
    }

    if (mensaje === "") {
        alert("No puede enviar mensajes vacíos");
        return;
    }

    const datos = {
        idDestino: idDestino,
        usuarioDestino: document.getElementById("usuarioDestino").selectedOptions[0].text,
        mensaje: mensaje,
        hora: obtenerHora()
    };

    socket.emit("mensajePrivado", datos);
    document.getElementById("mensajePrivado").value = "";
}

socket.on("usuariosConectados", (usuarios) => {
    const lista = document.getElementById("usuariosConectados");
    const select = document.getElementById("usuarioDestino");

    lista.innerHTML = "";
    select.innerHTML = `<option value="">Seleccione un usuario</option>`;

    for (let id in usuarios) {
        lista.innerHTML += `<li>${usuarios[id]}</li>`;
        select.innerHTML += `<option value="${id}">${usuarios[id]}</option>`;
    }
});

socket.on("mensajeGeneral", (datos) => {
    agregarMensaje(`
    <p>
        <b>[General]:</b>
        ${datos.usuario}: ${datos.mensaje}
        <small>${datos.hora}</small>
    </p>
    `);
});

socket.on("mensajePrivadoEnviado", (datos) => {
    agregarMensaje(`
        <p>
        <b>[Privado enviado a ${datos.usuarioDestino}]</b>
        ${usuarioActual}: ${datos.mensaje}
        <small>${datos.hora}</small>
        </p>
        `);
});

socket.on("mensajePrivadoRecibido", (datos) => {
    agregarMensaje(`
        <p>
        <b>[Privado recibido de ${datos.usuario}]</b>
        ${datos.usuario}: ${datos.mensaje}
        <small>${obtenerHora()}</small>
        </p>
        `);
});

socket.on("mensajeSistema", (mensaje) => {
    agregarMensaje(`
        <p><i>[Sistema] ${mensaje}</i></><p/>
        `);
});

function agregarMensaje(mensajeHTML) {
    const chat = document.getElementById("chat");
    chat.innerHTML += mensajeHTML;
}

function limpiarChat() {
    document.getElementById("chat").innerHTML = "";
}

function obtenerHora() {
    const fecha = new Date();
    return fecha.toLocaleTimeString();
}