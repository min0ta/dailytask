"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../../auth/auth");
const db_1 = require("../../db/db");
const tasks_dto_1 = require("../dto/tasks.dto");
let TasksService = class TasksService {
    async getTasks(req) {
        const id = auth_1.auth.AuthCheck(req);
        if (id == 0) {
            return {
                code: 400,
                tasks: [],
                error: tasks_dto_1.errors.Unauth
            };
        }
        try {
            const tasks = await db_1.db.getTasksByUserID({
                id
            });
            return { tasks, code: 200 };
        }
        catch (e) {
            return { code: 500, tasks: [], error: "unknown" };
        }
    }
    async addTask(req, taskRequest) {
        const id = auth_1.auth.AuthCheck(req);
        if (id == 0) {
            return r(400, tasks_dto_1.errors.Unauth);
        }
        if (!validateTask({ ...taskRequest, id: 0, userid: 0 })) {
            return r(400, tasks_dto_1.errors.InvalidData);
        }
        const task = {
            caption: taskRequest.caption,
            textvalue: taskRequest.textvalue,
            importancy: taskRequest.importancy,
            periodic: taskRequest.periodic,
            expires: taskRequest.expires,
            period_s: taskRequest.period_s,
            complete: false,
            userid: id
        };
        try {
            const taskid = await db_1.db.insertTask(task);
            return r(200, undefined, {
                ...task,
                id: taskid
            });
        }
        catch (e) {
            console.log(e);
            return r(500, 'unknown');
        }
    }
    async updateTask(req, task) {
        const userid = auth_1.auth.AuthCheck(req);
        if (userid == 0) {
            return r(400, tasks_dto_1.errors.Unauth);
        }
        if (!validateTask({ ...task, id: 0, userid: 0 })) {
            return r(400, tasks_dto_1.errors.InvalidData);
        }
        if (task.complete && task.periodic) {
            const expires = new Date(task.expires);
            expires.setDate(expires.getDate() + task.period_s);
            task.expires = expires;
            task.complete = false;
        }
        try {
            const res = await db_1.db.alterTask({
                userid,
                ...task
            });
            if (res == undefined) {
                return r(400, tasks_dto_1.errors.NoSuchTask);
            }
            return r(200, undefined, {
                userid,
                ...task
            });
        }
        catch (e) {
            return r(500, 'unknown');
        }
    }
    async deleteTask(req, id) {
        const userid = auth_1.auth.AuthCheck(req);
        if (userid == 0) {
            return r(400, tasks_dto_1.errors.Unauth);
        }
        try {
            const res = await db_1.db.deleteTask(id, userid);
            if (res == undefined) {
                return r(400, tasks_dto_1.errors.NoSuchTask);
            }
            return r(200, undefined, { id: res.id });
        }
        catch (e) {
            return r(500, 'unknown');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
function validateTask(task) {
    if (task.textvalue == null || task.caption == null || null == task.complete || null == task.expires || null == task.id || null == task.importancy || null == task.period_s || null == task.periodic || null == task.userid) {
        return false;
    }
    if (typeof task.textvalue != 'string' || typeof task.caption != 'string' || typeof task.complete != 'boolean' || new Date(task.expires).toString() == 'Invalid Date' || typeof task.id != 'number' || typeof task.importancy != 'number' || typeof task.period_s != 'number' || typeof task.userid != 'number') {
        return false;
    }
    if (!task.caption.trim() || !task.textvalue.trim()) {
        return false;
    }
    if (task.importancy < 0 || task.importancy > 3) {
        return false;
    }
    if (task.period_s < 0 || task.period_s > 5000) {
        return false;
    }
    if (task.caption.length > 30 || task.textvalue.length > 10000) {
        return false;
    }
    return true;
}
function r(code, error, result = undefined) {
    return {
        code,
        error,
        result
    };
}
//# sourceMappingURL=tasks.service.js.map