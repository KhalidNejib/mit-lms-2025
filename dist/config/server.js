"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("../app"));
const database_1 = require("./database");
const enviroment_1 = require("./enviroment");
const PORT = enviroment_1.config.port;
(0, database_1.connectDB)().then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`✅ Health check: http://localhost:${PORT}/health`);
        console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    });
});
