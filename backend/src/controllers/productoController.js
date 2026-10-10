const Producto = require('../models/productos');

// obtener todos los productos de la carta
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'error al obtener los productos' });
    }
};

// crear un nuevo producto en la carta
const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, categoria } = req.body;
        const nuevoProducto = new Producto({ nombre, precio, categoria });
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({ mensaje: 'producto creado con éxito', producto: productoGuardado });
    } catch (error) {
        res.status(500).json({ error: 'error al crear el producto' });
    }
};

module.exports = {
    obtenerProductos,
    crearProducto
};