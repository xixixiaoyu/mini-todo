import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * 创建待办事项的数据传输对象
 */
export class CreateTodoDto {
  /**
   * 待办事项内容
   * 必填，最大长度 500 字符
   */
  @IsNotEmpty({ message: '待办事项内容不能为空' })
  @IsString({ message: '待办事项内容必须是字符串' })
  @MaxLength(500, { message: '待办事项内容不能超过 500 个字符' })
  text: string;
}