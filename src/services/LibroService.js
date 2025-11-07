const LibroRepository = require('../repositories/LibroRepository');

class LibroService {
    //obtener todos los libros
    async getAllLibros(filters) {
        try{
            const libros = await LibroRepository.findAll(filters);
        return {
            status : 'success',
            data: libros,
            total: libros.length,
        };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LibroService();
