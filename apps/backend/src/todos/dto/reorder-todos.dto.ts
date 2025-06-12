import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 待办事项排序项
 */
export class TodoOrderItem {
  /**
   * 待办事项 ID
   */
  @IsNumber({}, { message: 'ID 必须是数字' })
  id: number;

  /**
   * 新的排序位置
   */
  @IsNumber({}, { message: '排序位置必须是数字' })
  order: number;
}

/**
 * 重新排序待办事项的数据传输对象
 */
export class ReorderTodosDto {
  /**
   * 待办事项排序列表
   */
  @IsArray({ message: '排序列表必须是数组' })
  @ArrayMinSize(1, { message: '排序列表不能为空' })
  @Type(() => TodoOrderItem)
  items: TodoOrderItem[];
}