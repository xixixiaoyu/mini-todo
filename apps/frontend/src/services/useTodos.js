/**
 * 待办事项组合式 API Hook
 * 提供响应式的待办事项数据管理和操作方法
 */

import { ref, computed, onMounted } from 'vue'
import { todoApi, ApiError } from './todoApi.js'

/**
 * 待办事项管理 Hook
 * @returns {Object} 包含响应式数据和操作方法的对象
 */
export function useTodos() {
  // 响应式数据
  const todos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filter = ref('all') // 'all' | 'active' | 'completed'
  const searchQuery = ref('')
  const stats = ref({ total: 0, active: 0, completed: 0 })

  // 计算属性
  const filteredTodos = computed(() => {
    let filtered = todos.value

    // 根据搜索查询过滤
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(query)
      )
    }

    // 根据状态过滤
    switch (filter.value) {
      case 'active':
        return filtered.filter(todo => !todo.completed)
      case 'completed':
        return filtered.filter(todo => todo.completed)
      default:
        return filtered
    }
  })

  const activeTodosCount = computed(() => {
    return todos.value.filter(todo => !todo.completed).length
  })

  const completedTodosCount = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  })

  const totalTodosCount = computed(() => {
    return todos.value.length
  })

  const hasActiveTodos = computed(() => {
    return activeTodosCount.value > 0
  })

  const hasCompletedTodos = computed(() => {
    return completedTodosCount.value > 0
  })

  const allCompleted = computed(() => {
    return todos.value.length > 0 && todos.value.every(todo => todo.completed)
  })

  // 错误处理
  const handleError = (err, defaultMessage = '操作失败') => {
    console.error(err)
    if (err instanceof ApiError) {
      error.value = err.message
    } else {
      error.value = defaultMessage
    }
    // 3秒后自动清除错误信息
    setTimeout(() => {
      error.value = null
    }, 3000)
  }

  const clearError = () => {
    error.value = null
  }

  // API 操作方法
  const fetchTodos = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const fetchParams = {
        filter: filter.value !== 'all' ? filter.value : undefined,
        search: searchQuery.value.trim() || undefined,
        ...params
      }
      
      const data = await todoApi.getTodos(fetchParams)
      todos.value = data
    } catch (err) {
      handleError(err, '获取待办事项失败')
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      const data = await todoApi.getStats()
      stats.value = data
    } catch (err) {
      handleError(err, '获取统计信息失败')
    }
  }

  const addTodo = async (text) => {
    if (!text || !text.trim()) {
      error.value = '待办事项内容不能为空'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const newTodo = await todoApi.createTodo({ text: text.trim() })
      todos.value.push(newTodo)
      await fetchStats() // 更新统计信息
      return true
    } catch (err) {
      handleError(err, '添加待办事项失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const updateTodo = async (id, updateData) => {
    loading.value = true
    error.value = null

    try {
      const updatedTodo = await todoApi.updateTodo(id, updateData)
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
      await fetchStats() // 更新统计信息
      return true
    } catch (err) {
      handleError(err, '更新待办事项失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const toggleTodo = async (id) => {
    loading.value = true
    error.value = null

    try {
      const updatedTodo = await todoApi.toggleTodo(id)
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
      await fetchStats() // 更新统计信息
      return true
    } catch (err) {
      handleError(err, '切换待办事项状态失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteTodo = async (id) => {
    loading.value = true
    error.value = null

    try {
      await todoApi.deleteTodo(id)
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todos.value.splice(index, 1)
      }
      await fetchStats() // 更新统计信息
      return true
    } catch (err) {
      handleError(err, '删除待办事项失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const clearCompleted = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await todoApi.clearCompleted()
      // 从本地数组中移除已完成的项目
      todos.value = todos.value.filter(todo => !todo.completed)
      await fetchStats() // 更新统计信息
      return result
    } catch (err) {
      handleError(err, '清除已完成待办事项失败')
      return null
    } finally {
      loading.value = false
    }
  }

  const toggleAll = async () => {
    loading.value = true
    error.value = null

    try {
      const updatedTodos = await todoApi.toggleAll()
      todos.value = updatedTodos
      await fetchStats() // 更新统计信息
      return true
    } catch (err) {
      handleError(err, '切换所有待办事项状态失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const reorderTodos = async (items) => {
    loading.value = true
    error.value = null

    try {
      const reorderedTodos = await todoApi.reorderTodos(items)
      todos.value = reorderedTodos
      return true
    } catch (err) {
      handleError(err, '重新排序待办事项失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 搜索和过滤方法
  const setFilter = (newFilter) => {
    filter.value = newFilter
    fetchTodos() // 重新获取数据
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
    fetchTodos() // 重新获取数据
  }

  const clearSearch = () => {
    searchQuery.value = ''
    fetchTodos() // 重新获取数据
  }

  // 刷新数据
  const refresh = async () => {
    await Promise.all([
      fetchTodos(),
      fetchStats()
    ])
  }

  // 初始化数据
  const initialize = async () => {
    await refresh()
  }

  // 组件挂载时自动初始化
  onMounted(() => {
    initialize()
  })

  return {
    // 响应式数据
    todos,
    loading,
    error,
    filter,
    searchQuery,
    stats,
    
    // 计算属性
    filteredTodos,
    activeTodosCount,
    completedTodosCount,
    totalTodosCount,
    hasActiveTodos,
    hasCompletedTodos,
    allCompleted,
    
    // 操作方法
    fetchTodos,
    fetchStats,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    toggleAll,
    reorderTodos,
    
    // 搜索和过滤
    setFilter,
    setSearchQuery,
    clearSearch,
    
    // 工具方法
    refresh,
    initialize,
    clearError,
  }
}

export default useTodos