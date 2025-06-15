import { Response } from "express";
import { LoginRequest, RegisterRequest } from "../dto/auth.dto";
export declare class AuthService {
    login(body: LoginRequest, res: Response): Promise<void>;
    logout(res: Response): Promise<{}>;
    register(body: RegisterRequest, res: Response): Promise<void>;
}
