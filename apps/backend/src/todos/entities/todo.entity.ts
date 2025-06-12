import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Todo 实体类
 * 定义待办事项的数据结构
 */
@Entity('todos')
export class Todo {
  /**
   * 唯一标识符
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 待办事项内容
   */
  @Column({ type: 'varchar', length: 500 })
  text: string;

  /**
   * 完成状态
   */
  @Column({ type: 'boolean', default: false })
  completed: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * 排序字段，用于拖拽排序
   */
  @Column({ type: 'integer', default: 0 })
  order: number;

  constructor(partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}