import { Module } from "@nestjs/common";
import { TasksController } from "./controller/tasks.controller";
import { TasksService } from "./service/tasks.service";

@Module({
    imports: [],
    controllers: [TasksController],
    providers: [TasksService],
  })
  export class TasksModule {}
  