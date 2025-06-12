import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ReorderTodosDto } from './dto/reorder-todos.dto';
import { Todo } from './entities/todo.entity';

/**
 * 待办事项控制器
 * 定义所有待办事项相关的 API 端点
 */
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  /**
   * 获取所有待办事项
   * GET /todos?filter=all&search=keyword
   */
  @Get()
  async findAll(
    @Query('filter') filter?: string,
    @Query('search') search?: string,
  ): Promise<Todo[]> {
    return await this.todosService.findAll(filter, search);
  }

  /**
   * 获取待办事项统计信息
   * GET /todos/stats
   */
  @Get('stats')
  async getStats(): Promise<{ total: number; active: number; completed: number }> {
    return await this.todosService.getStats();
  }

  /**
   * 根据 ID 获取单个待办事项
   * GET /todos/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return await this.todosService.findOne(id);
  }

  /**
   * 创建新的待办事项
   * POST /todos
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return await this.todosService.create(createTodoDto);
  }

  /**
   * 更新待办事项
   * PUT /todos/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return await this.todosService.update(id, updateTodoDto);
  }

  /**
   * 切换待办事项的完成状态
   * PUT /todos/:id/toggle
   */
  @Put(':id/toggle')
  async toggle(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return await this.todosService.toggle(id);
  }

  /**
   * 删除待办事项
   * DELETE /todos/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.todosService.remove(id);
  }

  /**
   * 清除所有已完成的待办事项
   * DELETE /todos/completed
   */
  @Delete('completed')
  async clearCompleted(): Promise<{ message: string; deletedCount: number }> {
    const deletedCount = await this.todosService.clearCompleted();
    return {
      message: `已删除 ${deletedCount} 个已完成的待办事项`,
      deletedCount,
    };
  }

  /**
   * 切换所有待办事项的完成状态
   * PUT /todos/toggle-all
   */
  @Put('toggle-all')
  async toggleAll(): Promise<Todo[]> {
    return await this.todosService.toggleAll();
  }

  /**
   * 重新排序待办事项
   * PUT /todos/reorder
   */
  @Put('reorder')
  async reorder(@Body() reorderDto: ReorderTodosDto): Promise<Todo[]> {
    return await this.todosService.reorder(reorderDto);
  }
}