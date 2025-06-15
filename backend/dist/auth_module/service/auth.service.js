"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../../auth/auth");
const invalidDataError = 'invalid data';
let AuthService = class AuthService {
    async login(body, res) {
        const user = {
            id: 0,
            email: body.email,
            password: body.password
        };
        await auth_1.auth.Login(user, res);
    }
    async logout(res) {
        await auth_1.auth.LogOut(res);
        return {};
    }
    async register(body, res) {
        const userToRegister = {
            id: 0,
            email: body.email,
            password: body.password
        };
        try {
            await auth_1.auth.Register(userToRegister);
            await auth_1.auth.Login({
                ...userToRegister,
                password: body.password
            }, res);
        }
        catch (e) {
            throw e;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map