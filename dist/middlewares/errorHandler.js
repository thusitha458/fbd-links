"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    console.error(`[ERROR] ${message}`);
    res.status(status).json({
        error: {
            status,
            message
        }
    });
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
//# sourceMappingURL=errorHandler.js.map