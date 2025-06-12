import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 全局 HTTP 异常过滤器
 * 统一处理应用中的异常，返回标准化的错误响应
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 构建错误响应
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || '服务器内部错误',
      error:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).error
          : HttpStatus[status],
    };

    // 如果是验证错误，提供更详细的信息
    if (
      typeof exceptionResponse === 'object' &&
      (exceptionResponse as any).message &&
      Array.isArray((exceptionResponse as any).message)
    ) {
      errorResponse.message = (exceptionResponse as any).message;
    }

    response.status(status).json(errorResponse);
  }
}