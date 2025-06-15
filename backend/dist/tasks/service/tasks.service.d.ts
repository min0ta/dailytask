import { Request } from "express";
import { AddTaskRequest, AddTaskResponse, GetTasksResponse, UpdateTaskRequest, UpdateTaskResponse } from "../dto/tasks.dto";
export declare class TasksService {
    getTasks(req: Request): Promise<GetTasksResponse>;
    addTask(req: Request, taskRequest: AddTaskRequest): Promise<AddTaskResponse>;
    updateTask(req: Request, task: UpdateTaskRequest): Promise<UpdateTaskResponse>;
    deleteTask(req: Request, id: number): Promise<{
        code: number;
        error: string | undefined;
        result: unknown;
    }>;
}
