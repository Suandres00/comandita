const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    mesa: { type: Number, required: true },
    cliente: { type: String, required: true },
    items: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
            cantidad: { type: Number, required: true, default: 1 }
        }
    ],
    total: { type: Number, required: true },
    estado: { type: String, default: 'pendiente' },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);