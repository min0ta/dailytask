import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common"
import { TasksService } from "../service/tasks.service"
import { Request, Response } from "express"
import { AddTaskRequest, UpdateTaskRequest } from "../dto/tasks.dto"

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    @Get()
    async getTasks(@Res() res: Response, @Req() req: Request) {
        const response = await this.tasksService.getTasks(req)
        res.json({error: response.error, result: response.tasks}).status(response.code).end()
    }
    @Post()
    async addTask(@Body() body: AddTaskRequest, @Req() req: Request, @Res() res: Response) {
        const response = await this.tasksService.addTask(req, body)
        sendResult(res, response)
    }
    @Put(":id")
    async updateTask(@Body() body: Omit<UpdateTaskRequest, 'id'>, @Req() req: Request, @Res() res: Response, @Param("id") id: number) {
        const response = await this.tasksService.updateTask(req, {id, ...body})
        sendResult(res, response)
    } 
    @Delete(":id")
    async deleteTask(@Req() req: Request, @Res() res: Response, @Param("id") id: number) {
        const response = await this.tasksService.deleteTask(req, id)
        sendResult(res, response)
    }
}

function sendResult(res: Response, response: any) {
    res.json({error: response.error, result: response.result}).status(response.code).end()
}