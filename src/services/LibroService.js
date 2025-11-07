const LibroRepository = require('../repositories/LibroRepository');

class LibroService {
    //obtener todos los libros
    async getAllLibros(filters) {
        try {
            const libros = await LibroRepository.findAll(filters);
            return {
                status: 'success',
                data: libros,
                total: libros.length,
            };
        } catch (error) {
            throw error;
        }
    }

    //obtener libro por id
    async getLibroById(cod_libro) {
        try {
            const libro = await LibroRepository.findById(cod_libro);
            return {
                status: 'success',
                data: libro,
            };
        } catch (error) {
            throw error;
        }
    }

    //crear un libro 
    async createLibro(libroData) {
        try{
            const cod_libro = await LibroRepository.create(libroData);
            const libro = await LibroRepository.findById(cod_libro);
            return{
                status: 'success',
                message: 'Libro creado exitosamente',
                data: libro,
            };
        }catch(error){
            throw error;
        }   
    }

    //actualizar un libro
    async updateLibro(cod_libro, libroData){
        try{
            const libro = await LibroRepository.update(cod_libro, libroData);
            return {
                status: 'success',
                message: 'Libro actualizado exitosamente',
                data: libro,
            };
        }catch(error){
            throw error;
        }
    }

    //eliminar un libro
    async deleteLibro(cod_libro){
        try{
            await LibroRepository.delete(cod_libro);
            return{
                status: 'success',
                message: 'Libro eliminado exitosamente',
            };
        }catch(error){
            throw error;
        }
    }
}

module.exports = new LibroService();
