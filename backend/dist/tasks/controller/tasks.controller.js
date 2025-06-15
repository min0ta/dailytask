"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("../service/tasks.service");
const tasks_dto_1 = require("../dto/tasks.dto");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async getTasks(res, req) {
        const response = await this.tasksService.getTasks(req);
        res.json({ error: response.error, result: response.tasks }).status(response.code).end();
    }
    async addTask(body, req, res) {
        const response = await this.tasksService.addTask(req, body);
        sendResult(res, response);
    }
    async updateTask(body, req, res, id) {
        const response = await this.tasksService.updateTask(req, { id, ...body });
        sendResult(res, response);
    }
    async deleteTask(req, res, id) {
        const response = await this.tasksService.deleteTask(req, id);
        sendResult(res, response);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tasks_dto_1.AddTaskRequest, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "addTask", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "deleteTask", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
function sendResult(res, response) {
    res.json({ error: response.error, result: response.result }).status(response.code).end();
}
//# sourceMappingURL=tasks.controller.js.map