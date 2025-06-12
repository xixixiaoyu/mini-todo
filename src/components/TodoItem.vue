<script setup>
import { ref, nextTick } from 'vue'

// 定义 props
const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

// 定义事件
const emit = defineEmits(['toggle', 'delete', 'edit'])

// 响应式数据
const isEditing = ref(false)
const editText = ref('')
const editInput = ref(null)

// 方法
const handleToggle = () => {
  emit('toggle', props.todo.id)
}

const handleDelete = () => {
  emit('delete', props.todo.id)
}

const startEdit = async () => {
  isEditing.value = true
  editText.value = props.todo.text
  await nextTick()
  editInput.value?.focus()
  editInput.value?.select()
}

const saveEdit = () => {
  if (editText.value.trim() && editText.value.trim() !== props.todo.text) {
    emit('edit', props.todo.id, editText.value.trim())
  }
  cancelEdit()
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = ''
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}

// 格式化创建时间
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div 
    class="todo-item" 
    :class="{ 
      'completed': todo.completed,
      'editing': isEditing 
    }"
  >
    <div class="todo-content">
      <!-- 复选框 -->
      <button 
        class="checkbox" 
        :class="{ 'checked': todo.completed }"
        @click="handleToggle"
        :title="todo.completed ? '标记为未完成' : '标记为已完成'"
      >
        <svg 
          v-if="todo.completed" 
          class="check-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </button>

      <!-- 任务文本 -->
      <div class="todo-text-container">
        <div 
          v-if="!isEditing"
          class="todo-text"
          :class="{ 'completed-text': todo.completed }"
          @dblclick="startEdit"
          :title="'双击编辑 - 创建于 ' + formatDate(todo.createdAt)"
        >
          {{ todo.text }}
        </div>
        
        <input
          v-else
          ref="editInput"
          v-model="editText"
          type="text"
          class="edit-input"
          maxlength="200"
          @blur="saveEdit"
          @keydown="handleKeydown"
        />
        
        <div class="todo-meta">
          <span class="created-time">{{ formatDate(todo.createdAt) }}</span>
          <span v-if="todo.completed" class="completed-badge">已完成</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="todo-actions">
      <button 
        v-if="!isEditing"
        class="action-button edit-button"
        @click="startEdit"
        title="编辑任务"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m18 2 4 4-14 14H4v-4L18 2z"></path>
        </svg>
      </button>
      
      <button 
        v-if="isEditing"
        class="action-button save-button"
        @click="saveEdit"
        title="保存"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </button>
      
      <button 
        v-if="isEditing"
        class="action-button cancel-button"
        @click="cancelEdit"
        title="取消"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <button 
        v-if="!isEditing"
        class="action-button delete-button"
        @click="handleDelete"
        title="删除任务"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  transition: all 0.2s ease;
  position: relative;
}

.todo-item:hover {
  background: #fafbfc;
  transform: translateX(4px);
}

.todo-item.completed {
  background: #f8fdf8;
}

.todo-item.editing {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
}

.todo-content {
  display: flex;
  align-items: flex-start;
  flex: 1;
  gap: 1rem;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox:hover {
  border-color: #4f46e5;
  transform: scale(1.1);
}

.checkbox.checked {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.check-icon {
  width: 14px;
  height: 14px;
  stroke-width: 3;
}

.todo-text-container {
  flex: 1;
  min-width: 0;
}

.todo-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #374151;
  cursor: pointer;
  word-wrap: break-word;
  transition: all 0.2s ease;
  padding: 2px 0;
}

.todo-text:hover {
  color: #4f46e5;
}

.todo-text.completed-text {
  text-decoration: line-through;
  color: #9ca3af;
}

.edit-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #4f46e5;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  background: white;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.created-time {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.completed-badge {
  font-size: 0.7rem;
  color: #059669;
  background: #d1fae5;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.todo-item.editing .todo-actions {
  opacity: 1;
}

.action-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: #f3f4f6;
  color: #6b7280;
}

.action-button:hover {
  transform: scale(1.1);
}

.edit-button:hover {
  background: #dbeafe;
  color: #2563eb;
}

.save-button {
  background: #dcfce7;
  color: #16a34a;
}

.save-button:hover {
  background: #bbf7d0;
  color: #15803d;
}

.cancel-button {
  background: #fef2f2;
  color: #dc2626;
}

.cancel-button:hover {
  background: #fee2e2;
  color: #b91c1c;
}

.delete-button:hover {
  background: #fef2f2;
  color: #dc2626;
}

.action-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .todo-item {
    padding: 1rem;
  }
  
  .todo-content {
    gap: 0.75rem;
  }
  
  .checkbox {
    width: 20px;
    height: 20px;
  }
  
  .check-icon {
    width: 12px;
    height: 12px;
  }
  
  .todo-text {
    font-size: 0.9rem;
  }
  
  .todo-actions {
    opacity: 1;
    gap: 0.25rem;
  }
  
  .action-button {
    width: 28px;
    height: 28px;
  }
  
  .action-icon {
    width: 14px;
    height: 14px;
  }
  
  .todo-meta {
    margin-top: 0.25rem;
  }
  
  .created-time {
    font-size: 0.7rem;
  }
  
  .completed-badge {
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
  }
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.todo-item {
  animation: slideIn 0.3s ease;
}
</style>