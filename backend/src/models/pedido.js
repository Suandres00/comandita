const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    mesa: { type: Number, required: true },
    platos: { type: [String], required: true },
    estado: { type: String, default: 'pendiente' }
});

module.exports = mongoose.model('Pedido', pedidoSchema);