function cargarProductos() {
    fetch('/api/products')
        .then(response => response.json())
        .then(productos => {
            const tabla = document.getElementById('tabla-productos');
            tabla.innerHTML = '';

            productos.forEach(producto => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.lugar}</td>
                    <td>
                        <button onclick="editarProducto(${producto.id})">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    </td>
                `;

                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

document.getElementById('form-producto').addEventListener('submit', function(event) {
    event.preventDefault();

    const producto = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        lugar: document.getElementById('lugar').value
    };

    const idEditar = document.getElementById('index-editar').value;

    let url = '/api/products';
    let metodo = 'POST';

    if (idEditar !== '') {
        url = `/api/products/${idEditar}`;
        metodo = 'PUT';
    }

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('form-producto').reset();
        document.getElementById('index-editar').value = '';
        document.getElementById('btn-guardar').textContent = 'Agregar';
        cargarProductos();
    });
});

function eliminarProducto(id) {
    fetch(`/api/products/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        cargarProductos();
    });
}

function editarProducto(id) {
    fetch('/api/products')
        .then(response => response.json())
        .then(productos => {
            const producto = productos.find(p => p.id === id);

            document.getElementById('nombre').value = producto.nombre;
            document.getElementById('precio').value = producto.precio;
            document.getElementById('lugar').value = producto.lugar;

            document.getElementById('index-editar').value = producto.id;
            document.getElementById('btn-guardar').textContent = 'Actualizar';
        });
}

cargarProductos();