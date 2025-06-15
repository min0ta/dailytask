import { TasksService } from "../service/tasks.service";
import { Request, Response } from "express";
import { AddTaskRequest, UpdateTaskRequest } from "../dto/tasks.dto";
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getTasks(res: Response, req: Request): Promise<void>;
    addTask(body: AddTaskRequest, req: Request, res: Response): Promise<void>;
    updateTask(body: Omit<UpdateTaskRequest, 'id'>, req: Request, res: Response, id: number): Promise<void>;
    deleteTask(req: Request, res: Response, id: number): Promise<void>;
}
