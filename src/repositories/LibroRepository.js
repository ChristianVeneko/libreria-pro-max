const pool = require('../config/db');
const AppError = require('../utils/AppError');

//crear una calse Repository
class LibroRepository {

    async findAll(filters = {}){
        try {
            let query = `
            SELECT DISTINC
            l.cod_libro,
            l.titulo_libro,
            l.volumen,
            l.edicion,
            l.isbn,
            e.nombre_editorial,
            GROUP_CONCAT(
                JSON_OBJECT('ced_autor', a.ced_autor, 'nombre_autor', a.nombre_autor, 'apellido_autor', a.apellido_autor)
                SEPARATOR ','
            ) as autores
            FROM libro l
            LEFT JOIN editorial e ON l.cod_editorial = e.cod_editorial
            LEFT JOIN autor_libro al ON l.cod_libro = al.cod_libro
            LEFT JOIN autor a ON al.ced_autor = a.ced_autor
            `;
            
            //construir where si hay filtros
            const conditions = [];
            if (filters.titulo_libro){
                conditions.push(`l.titulo_libro LIKE '%${filters.titulo_libro}%'`);
            }
            if( filters.cod_editorial ){
                conditions.push(`l.cod_editorial = '${filters.cod_editorial}'`);
            }
            if( conditions.length > 0 ){
                query += `WHERE ${conditions.join(' AND ')} `;
            }
            query += 'GROUP BY l.cod_libro ORDER BY l.cod_libro';
            //ejectutar la consulta

            const [rows] = await pool.query(query);
            

            //parsear los autores de cada libro
            return rows.map(row => ({
                ...row,
                autores: row.autores ? JSON.parse(`[${row.autores}]`) : []
            }));
        }catch (error) {
            throw error;
        }
    }

    //obtener un libro por su ID
    async findById(cod_libro){
        try {
            const query = `
            SELECT
                l.cod_libro,
                l.titulo_libro,
                l.volumen,
                l.edicion,
                l.isbn,
                l.cod_editorial,
                e.nombre_editorial,
                GROUP_CONCAT(
                    JSON_OBJECT('ced_autor', a.ced_autor, 'nombre_autor', a.nombre_autor, 'apellido_autor', a.apellido_autor)
                    SEPARATOR ','
                ) as autores
            FROM libro l
            LEFT JOIN editorial e ON l.cod_editorial = e.cod_editorial
            LEFT JOIN autor_libro al ON l.cod_libro = al.cod_libro
            LEFT JOIN autor a ON al.ced_autor = a.ced_autor
            WHERE l.cod_libro = ?
            GROUP BY l.cod_libro
            `;
            const [rows] = await pool.query(query, [cod_libro]);
            
            //si no existe, lanzar error
            if (rows.length === 0){
                throw new AppError('Libro no encontrado', 404);
            }

            const libro = rows[0];
            return{
                ...libro,
                autores: libro.autores ? JSON.parse(`[${libro.autores}]`) : []
            };
        }catch (error) {
            throw error;
        }
    }

}

