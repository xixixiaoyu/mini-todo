/**
 * API 配置文件
 * 定义后端服务的基础配置
 */

// 根据环境变量或开发/生产环境设置 API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

/**
 * API 配置对象
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json',
  },
}

/**
 * API 端点定义
 */
export const endpoints = {
  // 待办事项相关端点
  todos: {
    list: '/todos',                    // GET - 获取所有待办事项
    create: '/todos',                  // POST - 创建待办事项
    getById: (id) => `/todos/${id}`,   // GET - 获取单个待办事项
    update: (id) => `/todos/${id}`,    // PUT - 更新待办事项
    delete: (id) => `/todos/${id}`,    // DELETE - 删除待办事项
    toggle: (id) => `/todos/${id}/toggle`, // PUT - 切换完成状态
    stats: '/todos/stats',             // GET - 获取统计信息
    clearCompleted: '/todos/completed', // DELETE - 清除已完成
    toggleAll: '/todos/toggle-all',    // PUT - 切换所有状态
    reorder: '/todos/reorder',         // PUT - 重新排序
  },
}

/**
 * HTTP 状态码常量
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}