import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { databaseConfig } from './config/database.config';

/**
 * 应用主模块
 * 组织整个应用的模块结构
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
