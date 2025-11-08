const Joi = require('joi');

const autorSchemas = {
    //schema para crear un autor
    create: Joi.object({
        ced_autor: Joi.string().max(20).required().messages({
            'string.empty': 'La cédula del autor es requerida',
            'string.max': 'La cédula del autor no debe de exceder los 200 caracteres'
        }),
        nombre_autor: Joi.string().max(100).required().messages({
            'string.empty': 'El nombre del autor es requerido',
            'string.max': 'El nombre del autor no debe de exceder los 100 caracteres'
        }),
        apellido_autor: Joi.string().max(100).required().messages({
            'string.empty': 'El apellido del autor es requerido',
            'string.max': 'El apellido del autor no debe de exceder los 100 caracteres'
        })
    }),
    //Schema para actualizar un autor  
    update: Joi.object({
        nombre_autor: Joi.string().max(100).optional().messages({
            'string.max': 'El nombre del autor no debe de exceder los 100 caracteres'
        }),
        apellido_autor: Joi.string().max(100).optional().message({
            'string.max': 'El apellido del autor no debe de exceder los 100 caracteres'
        })
    }).min(1)
}

module.exports = autorSchemas;