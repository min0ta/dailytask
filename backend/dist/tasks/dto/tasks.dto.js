"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.UpdateTaskResponse = exports.UpdateTaskRequest = exports.AddTaskResponse = exports.AddTaskRequest = exports.GetTasksResponse = void 0;
class GetTasksResponse {
    tasks;
    error;
    code;
}
exports.GetTasksResponse = GetTasksResponse;
class AddTaskRequest {
    caption;
    textvalue;
    importancy;
    periodic;
    expires;
    period_s;
    complete;
}
exports.AddTaskRequest = AddTaskRequest;
class AddTaskResponse {
    result;
    error;
    code;
}
exports.AddTaskResponse = AddTaskResponse;
class UpdateTaskRequest {
    id;
    caption;
    textvalue;
    importancy;
    periodic;
    expires;
    period_s;
    complete;
}
exports.UpdateTaskRequest = UpdateTaskRequest;
class UpdateTaskResponse {
    result;
    error;
    code;
}
exports.UpdateTaskResponse = UpdateTaskResponse;
exports.errors = {
    InvalidData: "invalid data",
    NoSuchTask: "there is no such task",
    Unauth: "you are not logged in"
};
//# sourceMappingURL=tasks.dto.js.map