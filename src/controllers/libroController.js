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

    // GET: obtener un libro por su ID
    async getlibroById(req, res, next) {
        try{
            const {id} = req.params;
            const result = await LibroService.getlibroById(id);
            res.json(result);
        }catch(error){
        }
    }
    

    // POST: crear un nuevo libro
    async createLibro(req, res, next){
        try{
            //req.validateData viene del middleware de validacion
            const result = await LibroService.createLibro(req.validateData);
            res.status(201).json(result); 

        }catch(error){
            next(error);
        }
    }

    // PUT: actualizar un libro
    async updateLibro(req, res, next){
        try{
            const {id} = req.params;
            const result = await LibroService.updateLibro(id, req.validateData);
            res.json(result);
        }catch(error){
            next(error);
        }
    }

    // DELETE: eliminar un libro
    async deleteLibro(req, res, next){
        try{
            const {id} = req.params;
            const result = LibroService.deleteLibro(id);
            res.json(result);
        }catch(error){
            next(error);
        }
    }

}

module.exports = new LibroController();