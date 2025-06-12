import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Todo } from '../todos/entities/todo.entity';

/**
 * 数据库配置
 * 根据环境变量配置 TypeORM 连接参数
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'todolist_user',
  password: process.env.DB_PASSWORD || 'todolist_password',
  database: process.env.DB_NAME || 'todolist',
  entities: [Todo],
  synchronize: process.env.NODE_ENV !== 'production', // 生产环境禁用自动同步
  logging: process.env.NODE_ENV === 'development',
  retryAttempts: 3,
  retryDelay: 3000,
};