const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const libroRoutes = require('./routes/libroRoutes');
const bodyparser = require('body-parser');
const connection = require('./config/db');
require('dotenv').config();

const app = express();

//middelewares
app.use(cors());
app.use(bodyparser.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'API running successfully', 
    timestamp: new Date() 
  });
});

app.use('/api/libros', libroRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the Library API');
})

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
  });
});


app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  📚 Biblioteca API ejecutándose            ║
║  Puerto: ${PORT}                              ║
║  Ambiente: ${process.env.NODE_ENV}                       ║
║  URL: http://localhost:${PORT}                ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
