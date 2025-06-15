"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.RegisterResponse = exports.RegisterRequest = exports.LoginResponse = exports.LoginRequest = void 0;
class LoginRequest {
    email;
    password;
}
exports.LoginRequest = LoginRequest;
class LoginResponse {
    error;
    code;
}
exports.LoginResponse = LoginResponse;
class RegisterRequest {
    email;
    password;
}
exports.RegisterRequest = RegisterRequest;
class RegisterResponse {
    error;
    code;
}
exports.RegisterResponse = RegisterResponse;
exports.errors = {
    Unknown: 'unknown error',
    InvalidData: 'invalid data'
};
//# sourceMappingURL=auth.dto.js.map