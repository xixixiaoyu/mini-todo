<script setup>
import { ref, nextTick, inject } from 'vue'

// 定义 props
const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

// 定义事件
const emit = defineEmits(['toggle', 'delete', 'edit', 'drag-start', 'drag-over', 'drop'])

// 响应式数据
const isEditing = ref(false)
const editText = ref('')
const editInput = ref(null)
const isDragging = ref(false)
const isDragOver = ref(false)

// 注入暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false))

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

const handleKeydown = event => {
  if (event.key === 'Enter') {
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}

// 拖拽相关方法
const handleDragStart = event => {
  isDragging.value = true
  emit('drag-start', event, props.index)
}

const handleDragEnd = () => {
  isDragging.value = false
  isDragOver.value = false
}

const handleDragOver = event => {
  event.preventDefault()
  isDragOver.value = true
  emit('drag-over', event)
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = event => {
  isDragOver.value = false
  emit('drop', event, props.index)
}

// 格式化创建时间
const formatDate = dateString => {
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
    day: 'numeric',
  })
}
</script>

<template>
  <div
    class="todo-item"
    :class="{
      completed: todo.completed,
      editing: isEditing,
      dragging: isDragging,
      'drag-over': isDragOver,
      'dark-mode': isDarkMode,
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="todo-content">
      <!-- 复选框 -->
      <button
        class="checkbox"
        :class="{ checked: todo.completed }"
        :title="todo.completed ? '标记为未完成' : '标记为已完成'"
        @click="handleToggle"
      >
        <svg
          v-if="todo.completed"
          class="check-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <polyline points="20,6 9,17 4,12" />
        </svg>
      </button>

      <!-- 任务文本 -->
      <div class="todo-text-container">
        <div
          v-if="!isEditing"
          class="todo-text"
          :class="{ 'completed-text': todo.completed }"
          :title="'双击编辑 - 创建于 ' + formatDate(todo.createdAt)"
          @dblclick="startEdit"
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
        title="编辑任务"
        @click="startEdit"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="m18 2 4 4-14 14H4v-4L18 2z" />
        </svg>
      </button>

      <button
        v-if="isEditing"
        class="action-button save-button"
        title="保存"
        @click="saveEdit"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20,6 9,17 4,12" />
        </svg>
      </button>

      <button
        v-if="isEditing"
        class="action-button cancel-button"
        title="取消"
        @click="cancelEdit"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        v-if="!isEditing"
        class="action-button delete-button"
        title="删除任务"
        @click="handleDelete"
      >
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3,6 5,6 21,6" />
          <path
            d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"
          />
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

/* 暗黑模式样式 */
.todo-item.dark-mode {
  border-bottom: 1px solid #334155;
  background: #1e293b;
  color: #f1f5f9;
}

.todo-item.dark-mode:hover {
  background: #334155;
}

.todo-item.dark-mode.completed {
  background: #0f172a;
}

.todo-item.dark-mode.editing {
  background: #1e1b4b;
  border-left: 4px solid #6366f1;
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

/* 暗黑模式复选框 */
.todo-item.dark-mode .checkbox {
  border: 2px solid #64748b;
  background: #334155;
}

.todo-item.dark-mode .checkbox:hover {
  border-color: #6366f1;
}

.todo-item.dark-mode .checkbox.checked {
  background: #6366f1;
  border-color: #6366f1;
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

/* 暗黑模式文本 */
.todo-item.dark-mode .todo-text {
  color: #f1f5f9;
}

.todo-item.dark-mode .todo-text:hover {
  color: #6366f1;
}

.todo-item.dark-mode .todo-text.completed-text {
  color: #64748b;
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

/* 暗黑模式输入框 */
.todo-item.dark-mode .edit-input {
  border: 2px solid #6366f1;
  background: #334155;
  color: #f1f5f9;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
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

/* 暗黑模式元数据 */
.todo-item.dark-mode .created-time {
  color: #64748b;
}

.todo-item.dark-mode .completed-badge {
  color: #10b981;
  background: #064e3b;
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

/* 暗黑模式按钮 */
.todo-item.dark-mode .action-button {
  background: #475569;
  color: #94a3b8;
}

.todo-item.dark-mode .edit-button:hover {
  background: #1e40af;
  color: #93c5fd;
}

.todo-item.dark-mode .save-button {
  background: #065f46;
  color: #6ee7b7;
}

.todo-item.dark-mode .save-button:hover {
  background: #047857;
  color: #34d399;
}

.todo-item.dark-mode .cancel-button {
  background: #7f1d1d;
  color: #fca5a5;
}

.todo-item.dark-mode .cancel-button:hover {
  background: #991b1b;
  color: #f87171;
}

.todo-item.dark-mode .delete-button:hover {
  background: #7f1d1d;
  color: #fca5a5;
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

/* 拖拽样式 */
.todo-item.dragging {
  opacity: 0.5;
  transform: rotate(5deg) scale(1.05);
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.todo-item.drag-over {
  border-top: 3px solid #4f46e5;
  background: #f0f9ff;
  transform: translateY(-2px);
}

/* 暗黑模式拖拽样式 */
.todo-item.dark-mode.dragging {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.todo-item.dark-mode.drag-over {
  border-top: 3px solid #6366f1;
  background: #1e1b4b;
}

.todo-item {
  cursor: grab;
}

.todo-item:active {
  cursor: grabbing;
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
