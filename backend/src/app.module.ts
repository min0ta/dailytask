import { Module } from '@nestjs/common';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth_module/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TestModule, AuthModule, TasksModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'frontend')
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
