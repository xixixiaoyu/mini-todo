<script setup>
import { ref, inject } from 'vue'

// 定义 props
const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

// 使用 props 中的 searchQuery
const searchQuery = ref(props.searchQuery)

// 定义事件
const emit = defineEmits(['add-todo', 'update-search', 'clear-search'])

// 响应式数据
const newTodo = ref('')
const isComposing = ref(false)
const showSearch = ref(false)

// 注入暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false))

// 方法
const handleSubmit = () => {
  if (newTodo.value.trim() && !isComposing.value) {
    emit('add-todo', newTodo.value)
    newTodo.value = ''
  }
}

const handleKeydown = event => {
  if (event.key === 'Enter' && !isComposing.value) {
    event.preventDefault()
    handleSubmit()
  }
}

const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = () => {
  isComposing.value = false
}

// 搜索相关方法
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    emit('clear-search')
  }
}

const handleSearchInput = event => {
  emit('update-search', event.target.value)
}

const clearSearch = () => {
  emit('clear-search')
  showSearch.value = false
}
</script>

<template>
  <div class="todo-form" :class="{ 'dark-mode': isDarkMode }">
    <!-- 搜索栏 -->
    <div v-if="showSearch" class="search-container">
      <div class="search-group">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          :value="searchQuery"
          type="text"
          placeholder="搜索任务..."
          class="search-input"
          maxlength="100"
          @input="handleSearchInput"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="clear-search-button"
          title="清除搜索"
          @click="clearSearch"
        >
          <svg class="clear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 添加任务表单 -->
    <form class="form" @submit.prevent="handleSubmit">
      <div class="input-group">
        <input
          v-model="newTodo"
          type="text"
          placeholder="添加新的待办事项..."
          class="todo-input"
          maxlength="200"
          autofocus
          @keydown="handleKeydown"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
        />
        <button
          type="button"
          class="search-toggle-button"
          :class="{ active: showSearch }"
          title="搜索任务"
          @click="toggleSearch"
        >
          <svg
            class="search-toggle-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <button
          type="submit"
          class="add-button"
          :disabled="!newTodo.trim()"
          title="添加任务"
        >
          <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      <div class="input-hint">
        <span class="hint-text">按 Enter 键快速添加</span>
        <span class="char-count" :class="{ 'char-limit': newTodo.length > 180 }">
          {{ newTodo.length }}/200
        </span>
      </div>
    </form>
  </div>
</template>

<style scoped>
.todo-form {
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* 搜索容器样式 */
.search-container {
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  color: #9ca3af;
  stroke-width: 2;
  z-index: 1;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.clear-search-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-search-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.clear-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2;
}

.form {
  max-width: 100%;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
  background: white;
  transition: all 0.2s ease;
  outline: none;
}

.search-toggle-button {
  width: 44px;
  height: 44px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-toggle-button:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.search-toggle-button.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.search-toggle-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.todo-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.todo-input::placeholder {
  color: #9ca3af;
}

.add-button {
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  outline: none;
}

.add-button:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.add-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.add-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

.input-hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.hint-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hint-text::before {
  content: '💡';
  font-size: 0.75rem;
}

.char-count {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.char-count.char-limit {
  background: #fef2f2;
  color: #dc2626;
  font-weight: 600;
}

/* 暗黑模式样式 */
.todo-form.dark-mode .search-icon {
  color: #64748b;
}

.todo-form.dark-mode .search-input {
  border: 2px solid #475569;
  background: #334155;
  color: #f1f5f9;
}

.todo-form.dark-mode .search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.todo-form.dark-mode .search-input::placeholder {
  color: #64748b;
}

.todo-form.dark-mode .clear-search-button {
  background: #475569;
  color: #94a3b8;
}

.todo-form.dark-mode .clear-search-button:hover {
  background: #64748b;
  color: #f1f5f9;
}

.todo-form.dark-mode .todo-input {
  border: 2px solid #475569;
  background: #334155;
  color: #f1f5f9;
}

.todo-form.dark-mode .todo-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.todo-form.dark-mode .todo-input::placeholder {
  color: #64748b;
}

.todo-form.dark-mode .search-toggle-button {
  border: 2px solid #475569;
  background: #334155;
  color: #94a3b8;
}

.todo-form.dark-mode .search-toggle-button:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.todo-form.dark-mode .search-toggle-button.active {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

.todo-form.dark-mode .add-button {
  background: #6366f1;
}

.todo-form.dark-mode .add-button:hover:not(:disabled) {
  background: #5b21b6;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.todo-form.dark-mode .add-button:disabled {
  background: #475569;
}

.todo-form.dark-mode .input-hint {
  color: #94a3b8;
}

.todo-form.dark-mode .char-count {
  background: #475569;
  color: #94a3b8;
}

.todo-form.dark-mode .char-count.char-limit {
  background: #7f1d1d;
  color: #fca5a5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .todo-form {
    padding: 1.5rem 1rem;
  }

  .input-group {
    gap: 0.5rem;
  }

  .todo-input {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }

  .search-input {
    font-size: 1rem;
  }

  .add-button {
    padding: 0.875rem;
    min-width: 48px;
  }

  .add-icon {
    width: 18px;
    height: 18px;
  }

  .input-hint {
    font-size: 0.8rem;
  }

  .hint-text::before {
    display: none;
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.add-button:disabled .add-icon {
  animation: pulse 2s infinite;
}
</style>
