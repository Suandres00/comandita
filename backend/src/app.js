const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());

// conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('conectado a MongoDB Atlas con éxito'))
    .catch((err) => console.error('error al conectar a la base de datos:', err));

// importar rutas
const pedidoRoutes = require('./routes/pedidoRoutes');
app.use('/api/pedidos', pedidoRoutes);

// ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'el backend del comandero está funcionando' });
});

// encender el servidor
app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});