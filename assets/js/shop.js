// shop.js
// Lógica de productos y carrito para ShopAg

document.addEventListener('DOMContentLoaded', () => {
    const BaseDeDatos = [
        {
            id: 1,
            nombre: 'Hamacas',
            precio: 120000,
            imagen: 'assets/img/category_img_02.jpg',
            categoria: 'Hamacas'
        },
        {
            id: 2,
            nombre: 'Sombreros',
            precio: 250000,
            imagen: 'assets/img/feature_prod_01.jpg',
            categoria: 'Sombreros'
        },
        {
            id: 3,
            nombre: 'Bolsos',
            precio: 150000,
            imagen: 'assets/img/shop_03.jpg',
            categoria: 'Bolsos'
        }
    ];
    // Leer el carrito desde localStorage si existe
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items .row');
    const DOMcarrito = document.querySelector('#Carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonPagar = document.querySelector('#boton-pagar');
    const DOMcarritoIcono = document.querySelector('.fa-cart-arrow-down').parentElement.querySelector('span');
    const DOMfiltro = document.getElementById('filtro-categoria');

    function renderizarProductos(filtro = 'Todas') {
        // Limpiar el contenedor de productos
        DOMitems.innerHTML = '';
        let productosFiltrados = BaseDeDatos;
        if (filtro !== 'Todas') {
            productosFiltrados = BaseDeDatos.filter((info) => {
                return info.nombre.toLowerCase().includes(filtro.toLowerCase());
            });
        }
        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('col-sm-4', 'card', 'mb-3');
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            const miNodoTitle = document.createElement('h6');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa}${info.precio.toLocaleString('es-CO')}`;
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-success', 'mt-2');
            miNodoBoton.textContent = 'Agregar al carrito';
            miNodoBoton.dataset.id = info.id;
            miNodoBoton.addEventListener('click', agregarProductoAlCarrito);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    function agregarProductoAlCarrito(evento) {
        carrito.push(parseInt(evento.target.dataset.id));
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        actualizarContadorCarrito();
    }

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = BaseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === item;
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? (total += 1) : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-2');
            miBoton.textContent = 'Eliminar';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', eliminarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
    }

    function eliminarItemCarrito(evento) {
        const id = parseInt(evento.target.dataset.item);
        carrito = carrito.filter((carritoId) => carritoId !== id);
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        actualizarContadorCarrito();
    }

    function calcularTotal() {
        let total = 0;
        carrito.forEach((item) => {
            const miItem = BaseDeDatos.find((producto) => producto.id === item);
            total += miItem.precio;
        });
        // Mostrar el total con el símbolo y formato de miles
        DOMtotal.textContent = `${divisa} ${total.toLocaleString('es-CO')}`;
    }

    function actualizarContadorCarrito() {
        DOMcarritoIcono.textContent = carrito.length;
    }

    DOMbotonVaciar.addEventListener('click', () => {
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        actualizarContadorCarrito();
    });

    DOMfiltro.addEventListener('change', (e) => {
        renderizarProductos(e.target.value);
    });

    renderizarProductos();
    renderizarCarrito();
    calcularTotal();
    actualizarContadorCarrito();

    // Guardar el carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
});
