const express = require('express');
const router = express.Router();

const LibroController = require('../controllers/libroController');
const { validateRequest } = require('../middleware/validation');
const libroSchemas = require('../schemas/libroSchemas');
const libroController = require('../controllers/libroController');

//ruta para obtener todos los libros
router.get('/', LibroController.getAllLibros);

//ruta para obtener un libro por su ID
router.get('/:id', libroController.getlibroById);

//ruta para crear un libro
router.post('/', validateRequest(libroSchemas.create), libroController.createLibro);

//ruta para actualizar un libro
router.put('/:id', validateRequest(libroSchemas.update), libroController.updateLibro);

//ruta para eliminar un libro
router.delete('/:id', libroController.deleteLibro);



module.exports = router;