"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexController_1 = require("../controllers/indexController");
const router = express_1.default.Router();
// Define routes
router.get('/', indexController_1.home);
router.get('/api/status', indexController_1.getStatus);
router.get('/api/visitors', indexController_1.getVisitors);
exports.default = router;
//# sourceMappingURL=index.js.map