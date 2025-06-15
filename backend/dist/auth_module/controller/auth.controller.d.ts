import { Response } from "express";
import { AuthService } from "../service/auth.service";
import { LoginRequest, RegisterRequest } from "../dto/auth.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginRequest, res: Response): Promise<void>;
    logout(res: Response): Promise<void>;
    register(body: RegisterRequest, res: Response): Promise<void>;
}
