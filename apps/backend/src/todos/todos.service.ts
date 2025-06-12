import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ReorderTodosDto } from './dto/reorder-todos.dto';

/**
 * 待办事项服务类
 * 负责处理所有待办事项相关的业务逻辑
 */
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  /**
   * 获取所有待办事项
   * @param filter 过滤条件：'all' | 'active' | 'completed'
   * @param search 搜索关键词
   * @returns 过滤后的待办事项列表
   */
  async findAll(filter?: string, search?: string): Promise<Todo[]> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    // 根据搜索关键词过滤
    if (search && search.trim()) {
      queryBuilder.where('LOWER(todo.text) LIKE LOWER(:search)', {
        search: `%${search.trim()}%`,
      });
    }

    // 根据状态过滤
    switch (filter) {
      case 'active':
        queryBuilder.andWhere('todo.completed = :completed', {
          completed: false,
        });
        break;
      case 'completed':
        queryBuilder.andWhere('todo.completed = :completed', {
          completed: true,
        });
        break;
    }

    // 按创建时间排序
    queryBuilder
      .orderBy('todo.order', 'ASC')
      .addOrderBy('todo.createdAt', 'ASC');

    return await queryBuilder.getMany();
  }

  /**
   * 根据 ID 查找待办事项
   * @param id 待办事项 ID
   * @returns 待办事项
   */
  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`ID 为 ${id} 的待办事项不存在`);
    }
    return todo;
  }

  /**
   * 创建新的待办事项
   * @param createTodoDto 创建待办事项的数据
   * @returns 新创建的待办事项
   */
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    // 获取当前最大的 order 值
    const maxOrder = await this.todoRepository
      .createQueryBuilder('todo')
      .select('MAX(todo.order)', 'maxOrder')
      .getRawOne();

    const newTodo = this.todoRepository.create({
      text: createTodoDto.text.trim(),
      completed: false,
      order: (maxOrder?.maxOrder || 0) + 1,
    });

    return await this.todoRepository.save(newTodo);
  }

  /**
   * 更新待办事项
   * @param id 待办事项 ID
   * @param updateTodoDto 更新数据
   * @returns 更新后的待办事项
   */
  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);

    if (updateTodoDto.text !== undefined) {
      todo.text = updateTodoDto.text.trim();
    }

    if (updateTodoDto.completed !== undefined) {
      todo.completed = updateTodoDto.completed;
    }

    return await this.todoRepository.save(todo);
  }

  /**
   * 切换待办事项的完成状态
   * @param id 待办事项 ID
   * @returns 更新后的待办事项
   */
  async toggle(id: number): Promise<Todo> {
    const todo = await this.findOne(id);
    todo.completed = !todo.completed;
    return await this.todoRepository.save(todo);
  }

  /**
   * 删除待办事项
   * @param id 待办事项 ID
   */
  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
  }

  /**
   * 清除所有已完成的待办事项
   * @returns 删除的待办事项数量
   */
  async clearCompleted(): Promise<number> {
    const completedTodos = await this.todoRepository.find({
      where: { completed: true },
    });

    if (completedTodos.length > 0) {
      await this.todoRepository.remove(completedTodos);
    }

    return completedTodos.length;
  }

  /**
   * 切换所有待办事项的完成状态
   * @returns 操作后的待办事项列表
   */
  async toggleAll(): Promise<Todo[]> {
    const allTodos = await this.todoRepository.find();
    const allCompleted = allTodos.every((todo) => todo.completed);

    // 批量更新所有待办事项的状态
    await this.todoRepository.update({}, { completed: !allCompleted });

    // 返回更新后的数据
    return await this.todoRepository.find({
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  /**
   * 重新排序待办事项
   * @param reorderDto 排序数据
   * @returns 排序后的待办事项列表
   */
  async reorder(reorderDto: ReorderTodosDto): Promise<Todo[]> {
    // 验证所有 ID 都存在
    for (const item of reorderDto.items) {
      await this.findOne(item.id); // 如果不存在会抛出异常
    }

    // 批量更新排序
    const updatePromises = reorderDto.items.map((item) =>
      this.todoRepository.update(item.id, { order: item.order }),
    );

    await Promise.all(updatePromises);

    // 返回排序后的数据
    return await this.todoRepository.find({
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  /**
   * 获取统计信息
   * @returns 统计信息对象
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    completed: number;
  }> {
    const [total, completed] = await Promise.all([
      this.todoRepository.count(),
      this.todoRepository.count({ where: { completed: true } }),
    ]);

    const active = total - completed;

    return {
      total,
      active,
      completed,
    };
  }
}
