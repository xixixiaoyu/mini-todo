<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import TodoItem from './components/TodoItem.vue'
import TodoForm from './components/TodoForm.vue'
import TodoFilter from './components/TodoFilter.vue'

// 响应式数据
const todos = ref([])
const filter = ref('all') // all, active, completed
const nextId = ref(1)
const searchQuery = ref('')
const isDarkMode = ref(false)

// 计算属性
const filteredTodos = computed(() => {
  let filtered = todos.value

  // 根据搜索查询过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((todo) => todo.text.toLowerCase().includes(query))
  }

  // 根据状态过滤
  switch (filter.value) {
    case 'active':
      return filtered.filter((todo) => !todo.completed)
    case 'completed':
      return filtered.filter((todo) => todo.completed)
    default:
      return filtered
  }
})

const activeTodosCount = computed(() => {
  return todos.value.filter((todo) => !todo.completed).length
})

const completedTodosCount = computed(() => {
  return todos.value.filter((todo) => todo.completed).length
})

// 方法
const addTodo = (text) => {
  if (text.trim()) {
    todos.value.push({
      id: nextId.value++,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    })
    saveTodos()
  }
}

const toggleTodo = (id) => {
  const todo = todos.value.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
  }
}

const deleteTodo = (id) => {
  const index = todos.value.findIndex((t) => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    saveTodos()
  }
}

const editTodo = (id, newText) => {
  const todo = todos.value.find((t) => t.id === id)
  if (todo && newText.trim()) {
    todo.text = newText.trim()
    saveTodos()
  }
}

const clearCompleted = () => {
  todos.value = todos.value.filter((todo) => !todo.completed)
  saveTodos()
}

const toggleAll = () => {
  const allCompleted = todos.value.every((todo) => todo.completed)
  todos.value.forEach((todo) => {
    todo.completed = !allCompleted
  })
  saveTodos()
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

const handleDrop = (event, dropIndex) => {
  event.preventDefault()
  const dragIndex = parseInt(event.dataTransfer.getData('text/plain'))

  if (dragIndex !== dropIndex) {
    const draggedTodo = filteredTodos.value[dragIndex]
    const originalDragIndex = todos.value.findIndex((todo) => todo.id === draggedTodo.id)
    const dropTodo = filteredTodos.value[dropIndex]
    const originalDropIndex = todos.value.findIndex((todo) => todo.id === dropTodo.id)

    // 重新排序
    const [removed] = todos.value.splice(originalDragIndex, 1)
    todos.value.splice(originalDropIndex, 0, removed)
    saveTodos()
  }
}

// 主题切换功能
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('vue-todos-theme', isDarkMode.value ? 'dark' : 'light')
  updateTheme()
}

const updateTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 搜索功能
const updateSearch = (query) => {
  searchQuery.value = query
}

const clearSearch = () => {
  searchQuery.value = ''
}

// 本地存储
const saveTodos = () => {
  localStorage.setItem('vue-todos', JSON.stringify(todos.value))
  localStorage.setItem('vue-todos-next-id', nextId.value.toString())
}

const loadTodos = () => {
  const saved = localStorage.getItem('vue-todos')
  const savedNextId = localStorage.getItem('vue-todos-next-id')
  const savedTheme = localStorage.getItem('vue-todos-theme')

  if (saved) {
    todos.value = JSON.parse(saved)
  }

  if (savedNextId) {
    nextId.value = parseInt(savedNextId)
  }

  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
    updateTheme()
  }
}

// 生命周期
onMounted(() => {
  loadTodos()
})

// 提供暗黑模式状态给子组件
provide('isDarkMode', isDarkMode)
</script>

<template>
  <div class="app" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">📝 Vue TodoList</h1>
          <p class="subtitle">使用 Vue 3 Composition API 构建的现代化待办事项应用</p>
        </div>
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :title="isDarkMode ? '切换到浅色主题' : '切换到深色主题'"
          aria-label="主题切换"
        >
          <svg
            v-if="isDarkMode"
            class="theme-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </header>

    <main class="main">
      <div class="todo-container">
        <!-- 添加新任务和搜索 -->
        <TodoForm
          @add-todo="addTodo"
          @update-search="updateSearch"
          @clear-search="clearSearch"
          :search-query="searchQuery"
        />

        <!-- 任务统计 -->
        <div v-if="todos.length > 0" class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ activeTodosCount }}</span>
            <span class="stat-label">待完成</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ completedTodosCount }}</span>
            <span class="stat-label">已完成</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ todos.length }}</span>
            <span class="stat-label">总计</span>
          </div>
        </div>

        <!-- 过滤器 -->
        <TodoFilter
          v-if="todos.length > 0"
          v-model="filter"
          :active-count="activeTodosCount"
          :completed-count="completedTodosCount"
          @toggle-all="toggleAll"
          @clear-completed="clearCompleted"
        />

        <!-- 任务列表 -->
        <div class="todo-list">
          <TransitionGroup name="todo" tag="div">
            <TodoItem
              v-for="(todo, index) in filteredTodos"
              :key="todo.id"
              :todo="todo"
              :index="index"
              @toggle="toggleTodo"
              @delete="deleteTodo"
              @edit="editTodo"
              @drag-start="handleDragStart"
              @drag-over="handleDragOver"
              @drop="handleDrop"
              draggable="true"
            />
          </TransitionGroup>

          <!-- 空状态 -->
          <div v-if="filteredTodos.length === 0" class="empty-state">
            <div class="empty-icon">
              {{ searchQuery ? '🔍' : '🎯' }}
            </div>
            <h3 class="empty-title">
              {{
                searchQuery
                  ? '没有找到匹配的任务'
                  : filter === 'active'
                  ? '没有待完成的任务'
                  : filter === 'completed'
                  ? '没有已完成的任务'
                  : '还没有任务，添加一个开始吧！'
              }}
            </h3>
            <p class="empty-description">
              {{
                searchQuery
                  ? '尝试使用不同的关键词搜索，或清除搜索条件查看所有任务'
                  : filter === 'all'
                  ? '点击上方输入框添加你的第一个任务'
                  : '切换到其他标签查看任务'
              }}
            </p>
            <button v-if="searchQuery" class="clear-search-btn" @click="clearSearch">
              清除搜索
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Made with ❤️ using Vue 3 & Composition API</p>
    </footer>
  </div>
</template>

<style scoped>
/* CSS 变量定义 */
.app {
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bg-gradient-dark: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  --text-primary: #1f2937;
  --text-primary-dark: #f1f5f9;
  --text-secondary: rgba(255, 255, 255, 0.9);
  --text-secondary-dark: rgba(148, 163, 184, 0.9);
  --bg-container: white;
  --bg-container-dark: #1e293b;
  --bg-stats: #f8fafc;
  --bg-stats-dark: #0f172a;
  --border-color: #e2e8f0;
  --border-color-dark: #334155;
  --accent-color: #4f46e5;
  --accent-color-dark: #6366f1;
  --text-muted: #64748b;
  --text-muted-dark: #94a3b8;
}

.app {
  height: 100vh;
  background: var(--bg-gradient);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.app.dark-mode {
  background: var(--bg-gradient-dark);
  color: var(--text-primary-dark);
}

.header {
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

.title-section {
  text-align: center;
  flex: 1;
}

.theme-toggle {
  width: 44px;
  height: 44px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.theme-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
}

.main {
  display: flex;
  justify-content: center;
  flex: 1;
  min-height: 0;
}

.todo-container {
  width: 100%;
  max-width: 600px;
  background: var(--bg-container);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 8rem);
  transition: all 0.3s ease;
}

.app.dark-mode .todo-container {
  background: var(--bg-container-dark);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: var(--bg-stats);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.app.dark-mode .stats {
  background: var(--bg-stats-dark);
  border-bottom: 1px solid var(--border-color-dark);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  transition: color 0.3s ease;
}

.app.dark-mode .stat-number {
  color: var(--accent-color-dark);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.3s ease;
}

.app.dark-mode .stat-label {
  color: var(--text-muted-dark);
}

.todo-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.app.dark-mode .empty-state {
  color: var(--text-muted-dark);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.app.dark-mode .empty-title {
  color: var(--text-primary-dark);
}

.empty-description {
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
  opacity: 0.8;
}

.clear-search-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.clear-search-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
}

.app.dark-mode .clear-search-btn {
  background: var(--accent-color-dark);
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

.app.dark-mode .clear-search-btn:hover {
  background: #5b21b6;
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.4);
}

.footer {
  text-align: center;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  flex-shrink: 0;
}

/* 过渡动画 */
.todo-enter-active,
.todo-leave-active {
  transition: all 0.3s ease;
}

.todo-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.todo-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app {
    padding: 1rem 0.5rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .stats {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .empty-state {
    padding: 3rem 1rem;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-title {
    font-size: 1.25rem;
  }
}
</style>
