const express = require('express');
const router = express.Router();
const { obtenerPedidos, crearPedido, actualizarEstado } = require('../controllers/pedidoController');

router.get('/', obtenerPedidos);
router.post('/', crearPedido);
router.put('/:id', actualizarEstado); // <--- ruta nueva para actualizar

module.exports = router;