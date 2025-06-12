<template>
  <div class="todo-app">
    <!-- 错误提示 -->
    <div v-if="error" class="error-message" @click="clearError">
      <span>{{ error }}</span>
      <button class="close-btn">×</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 头部区域 -->
    <header class="app-header">
      <h1>📝 TodoList</h1>
      <div class="stats">
        <span>总计: {{ totalTodosCount }}</span>
        <span>待完成: {{ activeTodosCount }}</span>
        <span>已完成: {{ completedTodosCount }}</span>
      </div>
    </header>

    <!-- 添加待办事项表单 -->
    <form @submit.prevent="handleAddTodo" class="add-form">
      <input
        v-model="newTodoText"
        type="text"
        placeholder="添加新的待办事项..."
        class="add-input"
        :disabled="loading"
      />
      <button type="submit" class="add-btn" :disabled="loading || !newTodoText.trim()">
        添加
      </button>
    </form>

    <!-- 搜索和过滤 -->
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索待办事项..."
        class="search-input"
        @input="handleSearch"
      />
      
      <div class="filter-buttons">
        <button
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          :class="['filter-btn', { active: filter === filterOption.value }]"
          @click="setFilter(filterOption.value)"
        >
          {{ filterOption.label }}
        </button>
      </div>
    </div>

    <!-- 批量操作 -->
    <div v-if="totalTodosCount > 0" class="bulk-actions">
      <button
        @click="toggleAll"
        class="bulk-btn"
        :disabled="loading"
      >
        {{ allCompleted ? '取消全选' : '全选' }}
      </button>
      
      <button
        v-if="hasCompletedTodos"
        @click="handleClearCompleted"
        class="bulk-btn danger"
        :disabled="loading"
      >
        清除已完成
      </button>
      
      <button
        @click="refresh"
        class="bulk-btn"
        :disabled="loading"
      >
        刷新
      </button>
    </div>

    <!-- 待办事项列表 -->
    <div class="todo-list">
      <div v-if="filteredTodos.length === 0" class="empty-state">
        <p v-if="searchQuery">没有找到匹配的待办事项</p>
        <p v-else-if="filter === 'active'">没有待完成的事项</p>
        <p v-else-if="filter === 'completed'">没有已完成的事项</p>
        <p v-else>还没有待办事项，添加一个吧！</p>
      </div>
      
      <div
        v-for="(todo, index) in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ completed: todo.completed }"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover="handleDragOver"
        @drop="handleDrop($event, index)"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="handleToggleTodo(todo.id)"
          class="todo-checkbox"
        />
        
        <div
          v-if="editingId !== todo.id"
          class="todo-content"
          @dblclick="startEdit(todo)"
        >
          <span class="todo-text">{{ todo.text }}</span>
          <small class="todo-date">{{ formatDate(todo.createdAt) }}</small>
        </div>
        
        <input
          v-else
          v-model="editText"
          type="text"
          class="edit-input"
          @blur="finishEdit(todo.id)"
          @keyup.enter="finishEdit(todo.id)"
          @keyup.escape="cancelEdit"
          ref="editInput"
        />
        
        <div class="todo-actions">
          <button
            v-if="editingId !== todo.id"
            @click="startEdit(todo)"
            class="action-btn edit"
            title="编辑"
          >
            ✏️
          </button>
          
          <button
            @click="handleDeleteTodo(todo.id)"
            class="action-btn delete"
            title="删除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useTodos } from '../services/useTodos.js'

// 使用待办事项 Hook
const {
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
  clearError,
} = useTodos()

// 本地状态
const newTodoText = ref('')
const editingId = ref(null)
const editText = ref('')
const editInput = ref(null)

// 过滤选项
const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '待完成' },
  { value: 'completed', label: '已完成' },
]

// 事件处理方法
const handleAddTodo = async () => {
  if (newTodoText.value.trim()) {
    const success = await addTodo(newTodoText.value)
    if (success) {
      newTodoText.value = ''
    }
  }
}

const handleToggleTodo = async (id) => {
  await toggleTodo(id)
}

const handleDeleteTodo = async (id) => {
  if (confirm('确定要删除这个待办事项吗？')) {
    await deleteTodo(id)
  }
}

const handleClearCompleted = async () => {
  if (confirm('确定要清除所有已完成的待办事项吗？')) {
    const result = await clearCompleted()
    if (result) {
      console.log(`已删除 ${result.deletedCount} 个已完成的待办事项`)
    }
  }
}

const handleSearch = () => {
  setSearchQuery(searchQuery.value)
}

// 编辑功能
const startEdit = async (todo) => {
  editingId.value = todo.id
  editText.value = todo.text
  await nextTick()
  if (editInput.value) {
    editInput.value.focus()
  }
}

const finishEdit = async (id) => {
  if (editText.value.trim() && editText.value !== todos.value.find(t => t.id === id)?.text) {
    await updateTodo(id, { text: editText.value.trim() })
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingId.value = null
  editText.value = ''
}

// 拖拽排序功能
const handleDragStart = (event, index) => {
  event.dataTransfer.setData('text/plain', index)
  event.dataTransfer.effectAllowed = 'move'
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDrop = async (event, dropIndex) => {
  event.preventDefault()
  const dragIndex = parseInt(event.dataTransfer.getData('text/plain'))

  if (dragIndex !== dropIndex) {
    const draggedTodo = filteredTodos.value[dragIndex]
    const dropTodo = filteredTodos.value[dropIndex]
    
    // 构建重新排序的数据
    const reorderItems = []
    const newOrder = dropTodo.order
    
    // 简单的重新排序逻辑
    filteredTodos.value.forEach((todo, index) => {
      if (todo.id === draggedTodo.id) {
        reorderItems.push({ id: todo.id, order: newOrder })
      } else if (index >= Math.min(dragIndex, dropIndex) && index <= Math.max(dragIndex, dropIndex)) {
        const offset = dragIndex < dropIndex ? -1 : 1
        reorderItems.push({ id: todo.id, order: todo.order + offset })
      }
    })
    
    await reorderTodos(reorderItems)
  }
}

// 工具方法
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #c33;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
}

.app-header h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.add-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.add-input:focus {
  outline: none;
  border-color: #007bff;
}

.add-btn {
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.add-btn:hover:not(:disabled) {
  background: #0056b3;
}

.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-buttons {
  display: flex;
  gap: 5px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.filter-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.bulk-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.bulk-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.bulk-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.bulk-btn.danger {
  color: #dc3545;
  border-color: #dc3545;
}

.bulk-btn.danger:hover:not(:disabled) {
  background: #dc3545;
  color: white;
}

.todo-list {
  space-y: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: white;
  margin-bottom: 8px;
  cursor: move;
}

.todo-item:hover {
  border-color: #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.todo-content {
  flex: 1;
  cursor: pointer;
}

.todo-text {
  display: block;
  font-size: 16px;
  line-height: 1.4;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
}

.todo-date {
  display: block;
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.edit-input {
  flex: 1;
  padding: 8px;
  border: 2px solid #007bff;
  border-radius: 4px;
  font-size: 16px;
}

.todo-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.action-btn:hover {
  background: #f8f9fa;
}

.action-btn.delete:hover {
  background: #fee;
}

@media (max-width: 768px) {
  .todo-app {
    padding: 10px;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .bulk-actions {
    justify-content: center;
  }
}
</style>