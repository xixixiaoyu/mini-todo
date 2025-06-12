/**
 * HTTP 客户端工具
 * 提供统一的 HTTP 请求处理，包括错误处理、请求拦截等功能
 */

import { apiConfig, HTTP_STATUS } from '../config/api.js'

/**
 * 自定义错误类
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * HTTP 客户端类
 */
class HttpClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || apiConfig.baseURL
    this.timeout = config.timeout || apiConfig.timeout
    this.defaultHeaders = { ...apiConfig.headers, ...config.headers }
  }

  /**
   * 构建完整的 URL
   * @param {string} endpoint - API 端点
   * @returns {string} 完整的 URL
   */
  buildURL(endpoint) {
    return `${this.baseURL}${endpoint}`
  }

  /**
   * 处理响应
   * @param {Response} response - Fetch 响应对象
   * @returns {Promise<any>} 解析后的响应数据
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')
    
    let data = null
    if (isJson) {
      data = await response.json()
    } else if (response.status !== HTTP_STATUS.NO_CONTENT) {
      data = await response.text()
    }

    if (!response.ok) {
      const errorMessage = data?.message || data || `HTTP Error: ${response.status}`
      throw new ApiError(errorMessage, response.status, data)
    }

    return data
  }

  /**
   * 发送 HTTP 请求
   * @param {string} endpoint - API 端点
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} 响应数据
   */
  async request(endpoint, options = {}) {
    const url = this.buildURL(endpoint)
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    }

    // 设置请求超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      return await this.handleResponse(response)
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new ApiError('请求超时', 0)
      }
      
      if (error instanceof ApiError) {
        throw error
      }
      
      // 网络错误或其他未知错误
      throw new ApiError('网络连接失败，请检查网络设置', 0, error)
    }
  }

  /**
   * GET 请求
   * @param {string} endpoint - API 端点
   * @param {Object} params - 查询参数
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} 响应数据
   */
  async get(endpoint, params = {}, options = {}) {
    const url = new URL(this.buildURL(endpoint))
    
    // 添加查询参数
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key])
      }
    })

    return this.request(url.pathname + url.search, {
      method: 'GET',
      ...options,
    })
  }

  /**
   * POST 请求
   * @param {string} endpoint - API 端点
   * @param {any} data - 请求体数据
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} 响应数据
   */
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * PUT 请求
   * @param {string} endpoint - API 端点
   * @param {any} data - 请求体数据
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} 响应数据
   */
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * DELETE 请求
   * @param {string} endpoint - API 端点
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} 响应数据
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    })
  }
}

// 创建默认的 HTTP 客户端实例
export const httpClient = new HttpClient()

// 导出 HttpClient 类供自定义使用
export default HttpClient