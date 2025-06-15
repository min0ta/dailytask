"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.cfg = void 0;
const fs_1 = require("fs");
class Config {
    DB_HOST = "localhost";
    DB_PASSWORD = "root";
    DB_USER = "postgres";
    DB_NAME = "dailytasks";
    DB_PORT = 5432;
    JWT_SIGING_KEY = "ANDTSDONTMAKENOSENSE";
    JWT_EXPIRES = 30 * 24 * 60;
    constructor(path) {
        if (path == null) {
            return;
        }
        const file = (0, fs_1.readFileSync)(path).toString();
        const parsed = JSON.parse(file);
        Object.keys(parsed).forEach(v => {
            this[v] = parsed[v];
        });
    }
}
exports.Config = Config;
const cfg = new Config();
exports.cfg = cfg;
//# sourceMappingURL=config.js.map