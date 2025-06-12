import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';

/**
 * 更新待办事项的数据传输对象
 */
export class UpdateTodoDto {
  /**
   * 待办事项内容（可选）
   */
  @IsOptional()
  @IsString({ message: '待办事项内容必须是字符串' })
  @MaxLength(500, { message: '待办事项内容不能超过 500 个字符' })
  text?: string;

  /**
   * 完成状态（可选）
   */
  @IsOptional()
  @IsBoolean({ message: '完成状态必须是布尔值' })
  completed?: boolean;
}