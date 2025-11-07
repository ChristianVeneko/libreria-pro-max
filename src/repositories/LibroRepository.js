const pool = require('../config/db');
const AppError = require('../utils/AppError');

//crear una calse Repository
class LibroRepository {

    async findAll(filters = {}) {
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
            if (filters.titulo_libro) {
                conditions.push(`l.titulo_libro LIKE '%${filters.titulo_libro}%'`);
            }
            if (filters.cod_editorial) {
                conditions.push(`l.cod_editorial = '${filters.cod_editorial}'`);
            }
            if (conditions.length > 0) {
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
        } catch (error) {
            throw error;
        }
    }

    //obtener un libro por su ID
    async findById(cod_libro) {
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
            if (rows.length === 0) {
                throw new AppError('Libro no encontrado', 404);
            }

            const libro = rows[0];
            return {
                ...libro,
                autores: libro.autores ? JSON.parse(`[${libro.autores}]`) : []
            };
        } catch (error) {
            throw error;
        }
    }

    //crear un nuevo libro
    async create(libroData) {
        const connection = await pool.getConnection();
        try {
            //comenzar transaccion 
            await connection.beginTransaction();
            const { titulo_libro, volumen, edicion, isbn, cod_editorial, autores } = libroData;

            //insertar el libro
            const [result] = await connection.query(
                //
                'INSERT INTO libro (titulo_libro, volumen, edicion, isbn, cod_editorial) VALUES (?, ?, ?, ?, ?)',
                [titulo_libro, volumen || null, edicion || null, isbn || null, cod_editorial]
            );
            const cod_libro = result.insertId;

            //si hay autores, insertar la relacion
            if (autores && autores.lenght > 0) {
                for (const ced_autor of autores) {
                    await connection.query(
                        'INSERT INTO autor_libro (ced_autor, cod_libro) VALUES (?, ?)',
                        [ced_autor, cod_libro]
                    );
                }
            }

            //confirmar transaccion
            await connection.commit();
            return cod_libro;
        } catch (error) {
            //revertir transaccion en caso de error
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    //ACTUALIZAR un libro
    async update(cod_libro, libroData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { titulo_libro, volumen, edicion, isbn, cod_editorial, autores } = libroData;

            //construir query UPDATE dinamicamente
            const updateFields = [];
            const updateValues = [];

            if (titulo_libro !== undefined) {
                updateFields.push('titulo_libro = ?');
                updateValues.push(titulo_libro);
            }
            if (volumen !== undefined) {
                updateFields.push('volumen = ?');
                updateValues.push(volumen);
            }
            if (edicion !== undefined) {
                updateFields.push('edicion = ?');
                updateValues.push(edicion);
            }
            if (isbn !== undefined) {
                updateFields.push('isbn = ?');
                updateValues.push(isbn);
            }
            if (cod_editorial !== undefined) {
                updateFields.push('cod_editorial = ?');
                updateValues.push(cod_editorial);
            }

            //solo actualizar si hay campos
            if (updateFields.lenght > 0) {
                updateValues.push(cod_libro);
                await connection.query(
                    `UPDATE libro SET ${updateFields.join(', ')} WHERE cod_libro = ?`,
                    updateValues
                );
            }

            //actualizar autores si se proporcionan
            if (autores !== undefined) {
                //eliminar autores existentes
                await connection.query('DELETE FROM autor_libro WHERE cod_libro = ?', [cod_libro]);

                //insertar nuevos autores
                if (autores.length > 0) {
                    for (const ced_autor of autores) {
                        await connection.query(
                            'INSERT INTO autor_libro (ced_autor, cod_libro) VALUES (?, ?)',
                            [ced_autor, cod_libro]
                        );
                    }
                }
            }
            await connection.commit();
            return this.findById(cod_libro);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // ELIMINAR un libro
    async delete(cod_libro) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Primero eliminar relaciones en autor_libro
            await connection.query('DELETE FROM autor_libro WHERE cod_libro = ?', [cod_libro]);

            // Luego eliminar el libro
            const [result] = await connection.query('DELETE FROM libro WHERE cod_libro = ?', [cod_libro]);

            // Si no encontró nada, error
            if (result.affectedRows === 0) {
                throw new AppError('Libro no encontrado', 404);
            }

            await connection.commit();
            return result.affectedRows;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}


module.exports = new LibroRepository();
