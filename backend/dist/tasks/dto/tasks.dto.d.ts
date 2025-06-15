import { Task } from "src/db/models";
export declare class GetTasksResponse {
    tasks: Task[];
    error?: string;
    code: number;
}
export declare class AddTaskRequest {
    caption: string;
    textvalue: string;
    importancy: number;
    periodic: boolean;
    expires: Date;
    period_s: number;
    complete: boolean;
}
export declare class AddTaskResponse {
    result?: Task;
    error?: string;
    code: number;
}
export declare class UpdateTaskRequest {
    id: number;
    caption: string;
    textvalue: string;
    importancy: number;
    periodic: boolean;
    expires: Date;
    period_s: number;
    complete: boolean;
}
export declare class UpdateTaskResponse {
    result?: Task;
    error?: string;
    code: number;
}
export declare const errors: {
    InvalidData: string;
    NoSuchTask: string;
    Unauth: string;
};
