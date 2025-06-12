import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * 应用启动函数
 * 配置全局中间件、管道和 CORS
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS，允许前端跨域访问
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // 允许的前端地址
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 全局验证管道，自动验证请求数据
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动转换数据类型
      whitelist: true, // 过滤掉不在 DTO 中定义的属性
      forbidNonWhitelisted: true, // 如果有未定义的属性则抛出错误
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
    }),
  );

  // 全局异常过滤器，统一处理错误响应
  app.useGlobalFilters(new HttpExceptionFilter());

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  console.log(`🚀 TodoList 后端服务已启动`);
  console.log(`📍 服务地址: http://localhost:${port}`);
  console.log(`📖 API 文档: http://localhost:${port}/api`);
}

void bootstrap();
