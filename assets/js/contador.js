// contador.js
// Actualiza el contador del carrito en el index.html usando localStorage

document.addEventListener('DOMContentLoaded', () => {
    const DOMcarritoIcono = document.getElementById('contador-carrito');
    if (DOMcarritoIcono) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        DOMcarritoIcono.textContent = carrito.length;
    }
});
