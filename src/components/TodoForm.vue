<script setup>
import { ref } from 'vue'

// 定义事件
const emit = defineEmits(['add-todo'])

// 响应式数据
const newTodo = ref('')
const isComposing = ref(false)

// 方法
const handleSubmit = () => {
  if (newTodo.value.trim() && !isComposing.value) {
    emit('add-todo', newTodo.value)
    newTodo.value = ''
  }
}

const handleKeydown = (event) => {
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
</script>

<template>
  <div class="todo-form">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="input-group">
        <input
          v-model="newTodo"
          type="text"
          placeholder="添加新的待办事项..."
          class="todo-input"
          maxlength="200"
          @keydown="handleKeydown"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          autofocus
        />
        <button 
          type="submit" 
          class="add-button"
          :disabled="!newTodo.trim()"
          title="添加任务"
        >
          <svg class="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
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
    font-size: 0.9rem;
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
@keyframes pulse {
  0%, 100% {
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