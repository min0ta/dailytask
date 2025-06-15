"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../service/auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const errors_1 = require("../../auth/errors");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(body, res) {
        if (!validate(body)) {
            res.json({ error: auth_dto_1.errors.InvalidData }).status(400).end();
            return;
        }
        try {
            await this.authService.login(body, res);
            res.json({}).status(204).end();
        }
        catch (e) {
            if (e == errors_1.authErrors.authFail) {
                res.json({ error: e.message }).status(400).end();
                return;
            }
            res.status(500).json({ error: auth_dto_1.errors.Unknown }).end();
        }
    }
    async logout(res) {
        res.json(await this.authService.logout(res)).end();
    }
    async register(body, res) {
        if (!validate(body)) {
            res.json({ error: auth_dto_1.errors.InvalidData }).status(400).end();
            return;
        }
        try {
            await this.authService.register(body, res);
            res.json({}).status(200).end();
        }
        catch (e) {
            if (e == errors_1.authErrors.alreadyExists) {
                res.json({ error: errors_1.authErrors.alreadyExists.message }).status(400).end();
                return;
            }
            res.status(500).json({ error: auth_dto_1.errors.Unknown }).end();
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
function validate(user) {
    if (typeof user.password != 'string' || typeof user.email != 'string') {
        return false;
    }
    if (user.password.length < 3) {
        return false;
    }
    return true;
}
//# sourceMappingURL=auth.controller.js.map