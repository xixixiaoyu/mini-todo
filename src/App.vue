<script setup>
import { ref, computed, onMounted } from 'vue'
import TodoItem from './components/TodoItem.vue'
import TodoForm from './components/TodoForm.vue'
import TodoFilter from './components/TodoFilter.vue'

// 响应式数据
const todos = ref([])
const filter = ref('all') // all, active, completed
const nextId = ref(1)

// 计算属性
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const activeTodosCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

const completedTodosCount = computed(() => {
  return todos.value.filter(todo => todo.completed).length
})

// 方法
const addTodo = (text) => {
  if (text.trim()) {
    todos.value.push({
      id: nextId.value++,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    })
    saveTodos()
  }
}

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
  }
}

const deleteTodo = (id) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    saveTodos()
  }
}

const editTodo = (id, newText) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo && newText.trim()) {
    todo.text = newText.trim()
    saveTodos()
  }
}

const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed)
  saveTodos()
}

const toggleAll = () => {
  const allCompleted = todos.value.every(todo => todo.completed)
  todos.value.forEach(todo => {
    todo.completed = !allCompleted
  })
  saveTodos()
}

// 本地存储
const saveTodos = () => {
  localStorage.setItem('vue-todos', JSON.stringify(todos.value))
  localStorage.setItem('vue-todos-next-id', nextId.value.toString())
}

const loadTodos = () => {
  const saved = localStorage.getItem('vue-todos')
  const savedNextId = localStorage.getItem('vue-todos-next-id')
  
  if (saved) {
    todos.value = JSON.parse(saved)
  }
  
  if (savedNextId) {
    nextId.value = parseInt(savedNextId)
  }
}

// 生命周期
onMounted(() => {
  loadTodos()
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">📝 Vue TodoList</h1>
      <p class="subtitle">使用 Vue 3 Composition API 构建的现代化待办事项应用</p>
    </header>

    <main class="main">
      <div class="todo-container">
        <!-- 添加新任务 -->
        <TodoForm @add-todo="addTodo" />

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
              v-for="todo in filteredTodos"
              :key="todo.id"
              :todo="todo"
              @toggle="toggleTodo"
              @delete="deleteTodo"
              @edit="editTodo"
            />
          </TransitionGroup>
          
          <!-- 空状态 -->
          <div v-if="filteredTodos.length === 0" class="empty-state">
            <div class="empty-icon">🎯</div>
            <h3 class="empty-title">
              {{ filter === 'active' ? '没有待完成的任务' : 
                 filter === 'completed' ? '没有已完成的任务' : 
                 '还没有任务，添加一个开始吧！' }}
            </h3>
            <p class="empty-description">
              {{ filter === 'all' ? '点击上方输入框添加你的第一个任务' : '切换到其他标签查看任务' }}
            </p>
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
.app {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 8rem);
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.todo-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #64748b;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #374151;
}

.empty-description {
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
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
