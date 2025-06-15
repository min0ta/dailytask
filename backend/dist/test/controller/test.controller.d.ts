import { TestService } from "../service/test.service";
import { Request, Response } from "express";
export declare class TestController {
    private readonly testService;
    constructor(testService: TestService);
    read(id: string, request: Request, res: Response): Promise<void>;
}
