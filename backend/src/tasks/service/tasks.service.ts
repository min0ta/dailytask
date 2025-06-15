import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { auth } from "src/auth/auth";
import { db } from "src/db/db";
import { AddTaskRequest, AddTaskResponse, GetTasksResponse, errors, UpdateTaskRequest, UpdateTaskResponse } from "../dto/tasks.dto";
import { Task } from "src/db/models";

@Injectable()
export class TasksService {
    async getTasks(req: Request): Promise<GetTasksResponse> {
        const id = auth.AuthCheck(req)
        if (id == 0) {
            return {
                code: 400,
                tasks:[],
                error: errors.Unauth
            }
        }
        try {
            const tasks = await db.getTasksByUserID({
                id
            })
            return {tasks, code:200}
        } catch(e) {
            return {code: 500, tasks:[], error: "unknown"}
        }
    }
    async addTask(req: Request, taskRequest: AddTaskRequest): Promise<AddTaskResponse> {
        const id = auth.AuthCheck(req)
        if (id == 0) {
            return r(400, errors.Unauth)
        }
        if (!validateTask({...taskRequest, id: 0, userid: 0})) {
            return r(400, errors.InvalidData)
        }

        const task: Omit<Task, 'id'> = {
            caption: taskRequest.caption,
            textvalue: taskRequest.textvalue,
            importancy: taskRequest.importancy,
            periodic: taskRequest.periodic,
            expires: taskRequest.expires,
            period_s: taskRequest.period_s,
            complete: false,
            userid: id
        }
        try {
            const taskid = await db.insertTask(task)

            return r(200, undefined, {
                    ...task,
                    id: taskid
                })
        } catch(e) {
            console.log(e)
            return r(500, 'unknown')
        }
    }
    async updateTask(req: Request, task: UpdateTaskRequest): Promise<UpdateTaskResponse> {
        const userid = auth.AuthCheck(req)
        if (userid == 0) {
            return r(400, errors.Unauth)
        }
        if (!validateTask({...task, id: 0, userid: 0})) {
            return r(400, errors.InvalidData)
        }

        if (task.complete && task.periodic) {
            const expires = new Date(task.expires);
            expires.setDate(expires.getDate() + task.period_s);
            task.expires = expires
            task.complete = false;
        }
        try {
            const res = await db.alterTask({
                userid,
                ...task
            })

            if (res == undefined) {
                return r(400, errors.NoSuchTask)
            }

            return r(200, undefined, {
                userid,
                ...task
            })
        }
        catch(e) {
            return r(500, 'unknown')
        }
    }
    async deleteTask(req: Request, id: number) {
        const userid = auth.AuthCheck(req)
        if (userid == 0) {
            return r(400, errors.Unauth)
        }
        try {
            const res = await db.deleteTask(id, userid)
            if (res == undefined) {
                return r(400, errors.NoSuchTask)
            }
            return r(200, undefined, {id: res.id})
        } catch(e) {
            return r(500, 'unknown')
        }
    }
}
function validateTask(task: Task) {
    if (task.textvalue == null || task.caption == null || null == task.complete || null == task.expires || null == task.id || null == task.importancy || null == task.period_s || null == task.periodic || null == task.userid) {
        return false
    }
    if (typeof task.textvalue != 'string' || typeof task.caption != 'string' || typeof task.complete != 'boolean' || new Date(task.expires).toString() == 'Invalid Date' || typeof task.id != 'number' || typeof task.importancy != 'number' || typeof task.period_s != 'number' || typeof task.userid != 'number')  {
        return false
    }
    if (!task.caption.trim() || !task.textvalue.trim()) {
        return false
    }
    if (task.importancy < 0 || task.importancy > 3) {
        return false
    }
    if (task.period_s < 0 || task.period_s > 5000) {
        return false
    }
    if (task.caption.length > 30 || task.textvalue.length > 10000) {
        return false
    }
    return true
}

function r<T>(code: number, error: string | undefined, result: T | undefined = undefined) {
    return {
        code,
        error,
        result
    }
}