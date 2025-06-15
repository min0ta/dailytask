import { Request, Response } from "express";
import { User } from "src/db/models";
declare class Authorization {
    private createJWTCookie;
    AuthCheck(req: Request): any;
    Login(queryUser: User, res: Response): Promise<void>;
    Register(user: User): Promise<User>;
    LogOut(res: Response): Promise<void>;
}
export declare const auth: Authorization;
export {};
