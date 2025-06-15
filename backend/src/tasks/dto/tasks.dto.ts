import { Task } from "src/db/models"

export class GetTasksResponse {
    tasks: Task[]
    error?: string
    code: number
}

export class AddTaskRequest {
    caption: string
    textvalue: string
    importancy: number
    periodic: boolean
    expires: Date
    period_s: number
    complete: boolean
}

export class AddTaskResponse {
    result?: Task
    error?: string
    code: number
}

export class UpdateTaskRequest {
    id: number
    caption: string
    textvalue: string
    importancy: number
    periodic: boolean
    expires: Date
    period_s: number
    complete: boolean
}

export class UpdateTaskResponse {
    result?: Task
    error?: string
    code: number
}

export const errors = {
    InvalidData: "invalid data",
    NoSuchTask: "there is no such task",
    Unauth: "you are not logged in"
} 
