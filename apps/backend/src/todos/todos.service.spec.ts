import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', () => {
      const createTodoDto: CreateTodoDto = {
        text: '测试待办事项',
      };

      const result = service.create(createTodoDto);

      expect(result).toMatchObject({
        id: expect.any(Number),
        text: '测试待办事项',
        completed: false,
        createdAt: expect.any(String),
        order: expect.any(Number),
      });
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      service.create({ text: '待办事项 1' });
      service.create({ text: '待办事项 2' });
      service.toggle(1); // 标记第一个为已完成
    });

    it('should return all todos when no filter', () => {
      const result = service.findAll();
      expect(result).toHaveLength(2);
    });

    it('should return only active todos when filter is "active"', () => {
      const result = service.findAll('active');
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(false);
    });

    it('should return only completed todos when filter is "completed"', () => {
      const result = service.findAll('completed');
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
    });

    it('should filter by search query', () => {
      const result = service.findAll('all', '事项 1');
      expect(result).toHaveLength(1);
      expect(result[0].text).toContain('事项 1');
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', () => {
      const created = service.create({ text: '测试待办事项' });
      const result = service.findOne(created.id);
      expect(result).toEqual(created);
    });

    it('should throw NotFoundException for non-existent id', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', () => {
      const created = service.create({ text: '原始文本' });
      const updateDto: UpdateTodoDto = {
        text: '更新后的文本',
        completed: true,
      };

      const result = service.update(created.id, updateDto);

      expect(result.text).toBe('更新后的文本');
      expect(result.completed).toBe(true);
    });
  });

  describe('toggle', () => {
    it('should toggle todo completion status', () => {
      const created = service.create({ text: '测试待办事项' });
      expect(created.completed).toBe(false);

      const toggled = service.toggle(created.id);
      expect(toggled.completed).toBe(true);

      const toggledAgain = service.toggle(created.id);
      expect(toggledAgain.completed).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a todo', () => {
      const created = service.create({ text: '测试待办事项' });
      service.remove(created.id);

      expect(() => service.findOne(created.id)).toThrow(NotFoundException);
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      service.create({ text: '待办事项 1' });
      service.create({ text: '待办事项 2' });
      service.create({ text: '待办事项 3' });
      
      service.toggle(1);
      service.toggle(2);

      const deletedCount = service.clearCompleted();
      expect(deletedCount).toBe(2);

      const remaining = service.findAll();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].completed).toBe(false);
    });
  });

  describe('toggleAll', () => {
    it('should toggle all todos to completed when some are incomplete', () => {
      service.create({ text: '待办事项 1' });
      service.create({ text: '待办事项 2' });
      service.toggle(1); // 标记第一个为已完成

      const result = service.toggleAll();
      expect(result.every(todo => todo.completed)).toBe(true);
    });

    it('should toggle all todos to incomplete when all are completed', () => {
      service.create({ text: '待办事项 1' });
      service.create({ text: '待办事项 2' });
      service.toggle(1);
      service.toggle(2);

      const result = service.toggleAll();
      expect(result.every(todo => !todo.completed)).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      service.create({ text: '待办事项 1' });
      service.create({ text: '待办事项 2' });
      service.create({ text: '待办事项 3' });
      service.toggle(1);

      const stats = service.getStats();
      expect(stats).toEqual({
        total: 3,
        active: 2,
        completed: 1,
      });
    });
  });
});