const Pedido = require('../models/pedido');
const Producto = require('../models/productos');

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('items.producto');
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'error al obtener los pedidos' });
    }
};

const crearPedido = async (req, res) => {
    try {
        const { mesa, cliente, items } = req.body; // items es un array de { productoId, cantidad }
        
        let totalCalculado = 0;
        const itemsValidados = [];

        for (let item of items) {
            const productoDb = await Producto.findById(item.productoId);
            if (!productoDb) {
                return res.status(404).json({ error: `producto no encontrado` });
            }
            
            totalCalculado += productoDb.precio * item.cantidad;
            itemsValidados.push({
                producto: productoDb._id,
                cantidad: item.cantidad
            });
        }

        const nuevoPedido = new Pedido({
            mesa,
            cliente,
            items: itemsValidados,
            total: totalCalculado,
            estado: 'pendiente'
        });

        const pedidoGuardado = await nuevoPedido.save();
        res.status(201).json({ mensaje: 'pedido creado con éxito', pedido: pedidoGuardado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error al crear el pedido' });
    }
};

const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, { estado }, { new: true });
        
        if (!pedidoActualizado) {
            return res.status(404).json({ error: 'pedido no encontrado' });
        }
        res.json({ mensaje: 'estado actualizado', pedido: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ error: 'error al actualizar el estado' });
    }
};

module.exports = {
    obtenerPedidos,
    crearPedido,
    actualizarEstado
};