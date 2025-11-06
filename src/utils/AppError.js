class AppError extends Error {

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        error.captureStackTrace(this, this.constructor);
    }

}

module.exports = AppError;