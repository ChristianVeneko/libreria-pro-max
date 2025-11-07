const express = require('express');
const router = express.Router();

const LibroController = require('../controllers/libroController');
const { validateRequest } = require('../middleware/validation');
const libroSchemas = require('../schemas/libroSchemas');

//ruta para obtener todos los libros
router.get('/', LibroController.getAllLibros);


module.exports = router;