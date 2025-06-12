/**
 * 待办事项 API 服务
 * 封装所有与待办事项相关的 API 调用
 */

import { httpClient, ApiError } from './httpClient.js'
import { endpoints } from '../config/api.js'

/**
 * 待办事项数据类型定义（JSDoc）
 * @typedef {Object} Todo
 * @property {number} id - 待办事项 ID
 * @property {string} text - 待办事项内容
 * @property {boolean} completed - 是否已完成
 * @property {string} createdAt - 创建时间
 * @property {number} order - 排序位置
 */

/**
 * 统计信息数据类型定义
 * @typedef {Object} TodoStats
 * @property {number} total - 总数
 * @property {number} active - 未完成数量
 * @property {number} completed - 已完成数量
 */

/**
 * 待办事项 API 服务类
 */
class TodoApiService {
  /**
   * 获取所有待办事项
   * @param {Object} params - 查询参数
   * @param {string} [params.filter] - 过滤条件：'all' | 'active' | 'completed'
   * @param {string} [params.search] - 搜索关键词
   * @returns {Promise<Todo[]>} 待办事项列表
   */
  async getTodos(params = {}) {
    try {
      const data = await httpClient.get(endpoints.todos.list, params)
      return data || []
    } catch (error) {
      console.error('获取待办事项失败:', error)
      throw new ApiError('获取待办事项失败', error.status, error)
    }
  }

  /**
   * 根据 ID 获取单个待办事项
   * @param {number} id - 待办事项 ID
   * @returns {Promise<Todo>} 待办事项详情
   */
  async getTodoById(id) {
    try {
      const data = await httpClient.get(endpoints.todos.getById(id))
      return data
    } catch (error) {
      console.error(`获取待办事项 ${id} 失败:`, error)
      throw new ApiError(`获取待办事项失败`, error.status, error)
    }
  }

  /**
   * 创建新的待办事项
   * @param {Object} todoData - 待办事项数据
   * @param {string} todoData.text - 待办事项内容
   * @returns {Promise<Todo>} 创建的待办事项
   */
  async createTodo(todoData) {
    try {
      // 验证输入数据
      if (!todoData.text || !todoData.text.trim()) {
        throw new ApiError('待办事项内容不能为空', 400)
      }

      const data = await httpClient.post(endpoints.todos.create, {
        text: todoData.text.trim(),
      })
      return data
    } catch (error) {
      console.error('创建待办事项失败:', error)
      throw new ApiError('创建待办事项失败', error.status, error)
    }
  }

  /**
   * 更新待办事项
   * @param {number} id - 待办事项 ID
   * @param {Object} updateData - 更新数据
   * @param {string} [updateData.text] - 新的内容
   * @param {boolean} [updateData.completed] - 新的完成状态
   * @returns {Promise<Todo>} 更新后的待办事项
   */
  async updateTodo(id, updateData) {
    try {
      // 验证输入数据
      if (updateData.text !== undefined && (!updateData.text || !updateData.text.trim())) {
        throw new ApiError('待办事项内容不能为空', 400)
      }

      const payload = {}
      if (updateData.text !== undefined) {
        payload.text = updateData.text.trim()
      }
      if (updateData.completed !== undefined) {
        payload.completed = updateData.completed
      }

      const data = await httpClient.put(endpoints.todos.update(id), payload)
      return data
    } catch (error) {
      console.error(`更新待办事项 ${id} 失败:`, error)
      throw new ApiError('更新待办事项失败', error.status, error)
    }
  }

  /**
   * 切换待办事项的完成状态
   * @param {number} id - 待办事项 ID
   * @returns {Promise<Todo>} 更新后的待办事项
   */
  async toggleTodo(id) {
    try {
      const data = await httpClient.put(endpoints.todos.toggle(id))
      return data
    } catch (error) {
      console.error(`切换待办事项 ${id} 状态失败:`, error)
      throw new ApiError('切换待办事项状态失败', error.status, error)
    }
  }

  /**
   * 删除待办事项
   * @param {number} id - 待办事项 ID
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    try {
      await httpClient.delete(endpoints.todos.delete(id))
    } catch (error) {
      console.error(`删除待办事项 ${id} 失败:`, error)
      throw new ApiError('删除待办事项失败', error.status, error)
    }
  }

  /**
   * 获取待办事项统计信息
   * @returns {Promise<TodoStats>} 统计信息
   */
  async getStats() {
    try {
      const data = await httpClient.get(endpoints.todos.stats)
      return data
    } catch (error) {
      console.error('获取统计信息失败:', error)
      throw new ApiError('获取统计信息失败', error.status, error)
    }
  }

  /**
   * 清除所有已完成的待办事项
   * @returns {Promise<{message: string, deletedCount: number}>} 删除结果
   */
  async clearCompleted() {
    try {
      const data = await httpClient.delete(endpoints.todos.clearCompleted)
      return data
    } catch (error) {
      console.error('清除已完成待办事项失败:', error)
      throw new ApiError('清除已完成待办事项失败', error.status, error)
    }
  }

  /**
   * 切换所有待办事项的完成状态
   * @returns {Promise<Todo[]>} 更新后的所有待办事项
   */
  async toggleAll() {
    try {
      const data = await httpClient.put(endpoints.todos.toggleAll)
      return data || []
    } catch (error) {
      console.error('切换所有待办事项状态失败:', error)
      throw new ApiError('切换所有待办事项状态失败', error.status, error)
    }
  }

  /**
   * 重新排序待办事项
   * @param {Array<{id: number, order: number}>} items - 排序项目列表
   * @returns {Promise<Todo[]>} 重新排序后的待办事项列表
   */
  async reorderTodos(items) {
    try {
      // 验证输入数据
      if (!Array.isArray(items) || items.length === 0) {
        throw new ApiError('排序数据不能为空', 400)
      }

      // 验证每个项目的数据格式
      for (const item of items) {
        if (typeof item.id !== 'number' || typeof item.order !== 'number') {
          throw new ApiError('排序数据格式不正确', 400)
        }
      }

      const data = await httpClient.put(endpoints.todos.reorder, { items })
      return data || []
    } catch (error) {
      console.error('重新排序待办事项失败:', error)
      throw new ApiError('重新排序待办事项失败', error.status, error)
    }
  }
}

// 创建并导出 API 服务实例
export const todoApi = new TodoApiService()

// 导出服务类供自定义使用
export default TodoApiService