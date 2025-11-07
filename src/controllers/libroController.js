const LibroService = require('../services/LibroService');

class LibroController {
    // GET: Obtener todos los libros
    async getAllLibros(req, res, next) {
        try {
            // Obtener filtros de query string
            const filters = {
                titulo_libro: req.query.titulo,
                cod_editorial: req.query.editorial,
            };

            // Llamar al servicio
            const result = await LibroService.getAllLibros(filters);

            // Retornar respuesta
            res.json(result);
        } catch (error) {
            // Pasar error al middleware
            next(error);
        }
    }

}

module.exports = new LibroController();