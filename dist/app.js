"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = __importDefault(require("./config"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
const port = config_1.default.port;
// Trust the first proxy if behind one (helps with getting correct IP addresses)
app.set('trust proxy', 1);
// Middleware for request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Middleware for parsing JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Use routes
app.use(routes_1.default);
// Handle 404 - Route Not Found
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.url} not found`
    });
});
// Error handling middleware
app.use(errorHandler_1.default);
// Start server
app.listen(port, () => {
    console.log(`Express server is listening at http://localhost:${port}`);
    console.log(`Environment: ${config_1.default.environment}`);
});
//# sourceMappingURL=app.js.map