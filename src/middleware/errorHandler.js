const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = error.statuscode || 500;
    err.message = error.message || 'Error interno del servidor';


    if(err.isJoi){
        err.statusCode = 400;
        err.message = `Validation error: ${err.details.map(detail => detail.message).join(', ')}`;

    }

    if (err.code  && err.code.startsWith('ER_')) {
        err.statusCode = 400;
        switch(err.code) {
            case 'ER_DUP_ENTRY':
                err.message = 'El registro ya existe';
                break;
            case 'ER_NO_REFERENCED_ROW_2':
                err.message = 'Referencia inválida a otra tabla';
                break;
            default:
                err.message = 'Database error';
        }
    }

    res.status(err.statusCode).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

module.exports = errorHandler;