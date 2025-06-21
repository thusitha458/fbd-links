"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    // Add more configuration variables here as needed
};
exports.default = exports.config;
//# sourceMappingURL=index.js.map