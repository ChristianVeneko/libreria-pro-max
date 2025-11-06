const Joi = require('joi');

const libroSchemas = {
    //schema para crear un libro
    create: Joi.object({
        titulo_libro: joi.string()
        .max(200)
        .required()
        .messages({
            'string.empty': 'El titulo del libro es requerido',
            'string.max': 'El titulo del libro no debe de exceder los 200 caracteres'
        }),
        volumen: Joi.number()
        .integer()
        .positive()
        .optional(),
        edition: Joi.number()
        .integer()
        .positive()
        .optional(),
        isbn: Joi.string()
        .max(20)
        .optional(),
        cod_editorial: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.empty': 'La editorial es requerida',
            'string.max': 'La editorial no debe de exceder los 100 caracteres'
        }),
        autores: Joi.array()
        .items(Joi.string().max(20))
        .optional(),
    }),
    //schema para ACTUALIZAR un libro
    update: Joi.object({
        titulo_libro: Joi.string().max(200).optional(),
        volumen: Joi.number().integer().positive().optional(),  
        edition: Joi.number().integer().positive().optional(),
        isbn: Joi.string().max(20).optional(),
        cod_editorial: Joi.string().max(100).optional(),
        autores: Joi.array().items(Joi.string().max(20)).optional(),
    }).min(1), // Al menos un campo para actualizar
};

module.exports = libroSchemas;