const Joi = require('joi');

const validateRequest = (schema) => {

    return (req, res, next) => {
        //validar request.boy contra el schema
        const {error, value} = schema.validate(req.body, {
            abortEarly: false, // ver todos los errores
            stripUnknown: true, // ignorar campos que no estan en el schema
        });

        ///si hay error
        if(error){
            error.isJoi = true;
            return next(error);
        }
        req.validatedData = value;
        next();
    };
};
//validar parametors de la URL
const validateParams = (schema) => {
    return (req, res, next) => {
        const {error, value} = schema.validate(req.params, {
            abortEarly: false,
        });
        if(error){
            error.isJoi = true;
            return next(error);
        }
        req.validateParams = value;
        next();
        
    };
};

modole.exports = {
    validateRequest,
    validateParams,
};