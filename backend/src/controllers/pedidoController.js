const Pedido = require('../models/pedido');

// obtener todos los pedidos de la base de datos
const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'error al obtener los pedidos' });
    }
};

// crear un nuevo pedido en la base de datos
const crearPedido = async (req, res) => {
    try {
        const nuevoPedido = new Pedido({
            mesa: req.body.mesa,
            platos: req.body.platos,
            estado: 'pendiente'
        });

        const pedidoGuardado = await nuevoPedido.save();
        res.status(201).json({ mensaje: 'pedido creado con éxito', pedido: pedidoGuardado });
    } catch (error) {
        res.status(500).json({ error: 'error al crear el pedido' });
    }
};

// actualizar el estado de un pedido
const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            id,
            { estado },
            { new: true } // devuelve el documento actualizado
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ error: 'pedido no encontrado' });
        }

        res.json({ mensaje: 'estado actualizado con éxito', pedido: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ error: 'error al actualizar el estado' });
    }
};

module.exports = {
    obtenerPedidos,
    crearPedido,
    actualizarEstado
};