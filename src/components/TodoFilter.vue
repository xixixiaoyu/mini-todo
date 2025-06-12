<script setup>
import { computed, inject, ref } from 'vue'

// 定义 props
const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  },
  activeCount: {
    type: Number,
    default: 0
  },
  completedCount: {
    type: Number,
    default: 0
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'toggle-all', 'clear-completed'])

// 计算属性
const totalCount = computed(() => props.activeCount + props.completedCount)
const allCompleted = computed(() => totalCount.value > 0 && props.activeCount === 0)

// 注入暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false))

// 过滤选项
const filterOptions = [
  { value: 'all', label: '全部', icon: '📋' },
  { value: 'active', label: '待完成', icon: '⏳' },
  { value: 'completed', label: '已完成', icon: '✅' }
]

// 方法
const setFilter = (filter) => {
  emit('update:modelValue', filter)
}

const handleToggleAll = () => {
  emit('toggle-all')
}

const handleClearCompleted = () => {
  emit('clear-completed')
}
</script>

<template>
  <div class="todo-filter" :class="{ 'dark-mode': isDarkMode }">
    <!-- 批量操作区域 -->
    <div class="bulk-actions">
      <button 
        class="toggle-all-button"
        :class="{ 'all-completed': allCompleted }"
        @click="handleToggleAll"
        :title="allCompleted ? '标记全部为未完成' : '标记全部为已完成'"
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline v-if="allCompleted" points="20,6 9,17 4,12"></polyline>
          <circle v-else cx="12" cy="12" r="10"></circle>
        </svg>
        <span class="toggle-text">
          {{ allCompleted ? '全部已完成' : '全部标记完成' }}
        </span>
      </button>
      
      <button 
        v-if="completedCount > 0"
        class="clear-completed-button"
        @click="handleClearCompleted"
        title="清除已完成的任务"
      >
        <svg class="clear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
        </svg>
        <span class="clear-text">清除已完成 ({{ completedCount }})</span>
      </button>
    </div>

    <!-- 过滤器标签 -->
    <div class="filter-tabs">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        class="filter-tab"
        :class="{ 'active': modelValue === option.value }"
        @click="setFilter(option.value)"
      >
        <span class="filter-icon">{{ option.icon }}</span>
        <span class="filter-label">{{ option.label }}</span>
        <span 
          v-if="option.value === 'active' && activeCount > 0"
          class="filter-count"
        >
          {{ activeCount }}
        </span>
        <span 
          v-if="option.value === 'completed' && completedCount > 0"
          class="filter-count"
        >
          {{ completedCount }}
        </span>
        <span 
          v-if="option.value === 'all' && totalCount > 0"
          class="filter-count"
        >
          {{ totalCount }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-filter {
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.bulk-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.toggle-all-button,
.clear-completed-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  font-weight: 500;
}

.toggle-all-button:hover,
.clear-completed-button:hover {
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-all-button.all-completed {
  background: #dcfce7;
  border-color: #16a34a;
  color: #15803d;
}

.clear-completed-button {
  color: #dc2626;
}

.clear-completed-button:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

.toggle-icon,
.clear-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: #e2e8f0;
  padding: 0.25rem;
  border-radius: 12px;
}

.filter-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #374151;
}

.filter-tab.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.filter-icon {
  font-size: 1rem;
}

.filter-label {
  white-space: nowrap;
}

.filter-count {
  background: #4f46e5;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
  line-height: 1.2;
}

.filter-tab.active .filter-count {
  background: #4f46e5;
}

.filter-tab:not(.active) .filter-count {
  background: #9ca3af;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .todo-filter {
    padding: 1rem;
  }
  
  .bulk-actions {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .toggle-all-button,
  .clear-completed-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
  
  .toggle-text,
  .clear-text {
    display: none;
  }
  
  .filter-tabs {
    gap: 0.25rem;
  }
  
  .filter-tab {
    padding: 0.625rem 0.5rem;
    font-size: 0.8rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .filter-label {
    font-size: 0.75rem;
  }
  
  .filter-count {
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    min-width: 18px;
  }
}

@media (max-width: 480px) {
  .bulk-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .toggle-all-button,
  .clear-completed-button {
    width: 100%;
    justify-content: center;
  }
  
  .toggle-text,
  .clear-text {
    display: inline;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-filter {
  animation: fadeIn 0.3s ease;
}

.filter-count {
  animation: fadeIn 0.2s ease;
}

/* 暗黑模式样式 */
.todo-filter.dark-mode {
  background: #1e293b;
  border-color: #334155;
}

.todo-filter.dark-mode .toggle-all-button {
  background: #334155;
  border-color: #475569;
  color: #e2e8f0;
}

.todo-filter.dark-mode .toggle-all-button:hover {
  background: #475569;
  border-color: #64748b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.todo-filter.dark-mode .toggle-all-button.all-completed {
  background: #166534;
  border-color: #16a34a;
  color: #bbf7d0;
}

.todo-filter.dark-mode .clear-completed-button {
  color: #f87171;
}

.todo-filter.dark-mode .clear-completed-button:hover {
  background: #450a0a;
  border-color: #dc2626;
}

.todo-filter.dark-mode .filter-tabs {
  background: #334155;
}

.todo-filter.dark-mode .filter-tab {
  color: #94a3b8;
}

.todo-filter.dark-mode .filter-tab:hover {
  background: rgba(71, 85, 105, 0.5);
  color: #e2e8f0;
}

.todo-filter.dark-mode .filter-tab.active {
  background: #475569;
  color: #a78bfa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.todo-filter.dark-mode .filter-count {
  background: #6366f1;
  color: white;
}

.todo-filter.dark-mode .filter-tab.active .filter-count {
  background: #6366f1;
}

.todo-filter.dark-mode .filter-tab:not(.active) .filter-count {
  background: #64748b;
}
</style>