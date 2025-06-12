# 前端 API 服务层文档

本目录包含了与后端 API 交互的所有服务和工具，提供了完整的待办事项管理功能。

## 📁 文件结构

```
src/services/
├── index.js          # 服务层统一入口
├── httpClient.js     # HTTP 客户端工具
├── todoApi.js        # 待办事项 API 服务
├── useTodos.js       # Vue 组合式 API Hook
└── README.md         # 本文档
```

## 🚀 快速开始

### 1. 基础配置

首先确保在项目根目录创建 `.env` 文件：

```env
# 后端 API 地址
VITE_API_BASE_URL=http://localhost:3001/api
```

### 2. 在 Vue 组件中使用

#### 方式一：使用组合式 API Hook（推荐）

```vue
<template>
  <div>
    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>
    
    <!-- 加载状态 -->
    <div v-if="loading">加载中...</div>
    
    <!-- 添加待办事项 -->
    <form @submit.prevent="handleAdd">
      <input v-model="newTodo" placeholder="添加待办事项" />
      <button type="submit">添加</button>
    </form>
    
    <!-- 待办事项列表 -->
    <div v-for="todo in filteredTodos" :key="todo.id">
      <input 
        type="checkbox" 
        :checked="todo.completed" 
        @change="toggleTodo(todo.id)"
      />
      <span>{{ todo.text }}</span>
      <button @click="deleteTodo(todo.id)">删除</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodos } from '@/services/useTodos.js'

// 使用待办事项 Hook
const {
  // 响应式数据
  loading,
  error,
  filteredTodos,
  
  // 操作方法
  addTodo,
  toggleTodo,
  deleteTodo,
  clearError,
} = useTodos()

const newTodo = ref('')

const handleAdd = async () => {
  if (newTodo.value.trim()) {
    const success = await addTodo(newTodo.value)
    if (success) {
      newTodo.value = ''
    }
  }
}
</script>
```

#### 方式二：直接使用 API 服务

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { todoApi } from '@/services/todoApi.js'

const todos = ref([])
const loading = ref(false)

const fetchTodos = async () => {
  loading.value = true
  try {
    todos.value = await todoApi.getTodos()
  } catch (error) {
    console.error('获取待办事项失败:', error)
  } finally {
    loading.value = false
  }
}

const addTodo = async (text) => {
  try {
    const newTodo = await todoApi.createTodo({ text })
    todos.value.push(newTodo)
  } catch (error) {
    console.error('添加待办事项失败:', error)
  }
}

onMounted(fetchTodos)
</script>
```

## 📚 API 参考

### useTodos Hook

组合式 API Hook，提供完整的待办事项管理功能。

#### 返回值

```typescript
interface UseTodosReturn {
  // 响应式数据
  todos: Ref<Todo[]>                    // 所有待办事项
  loading: Ref<boolean>                 // 加载状态
  error: Ref<string | null>             // 错误信息
  filter: Ref<string>                   // 当前过滤条件
  searchQuery: Ref<string>              // 搜索关键词
  stats: Ref<TodoStats>                 // 统计信息
  
  // 计算属性
  filteredTodos: ComputedRef<Todo[]>    // 过滤后的待办事项
  activeTodosCount: ComputedRef<number> // 未完成数量
  completedTodosCount: ComputedRef<number> // 已完成数量
  totalTodosCount: ComputedRef<number>  // 总数量
  hasActiveTodos: ComputedRef<boolean>  // 是否有未完成项
  hasCompletedTodos: ComputedRef<boolean> // 是否有已完成项
  allCompleted: ComputedRef<boolean>    // 是否全部完成
  
  // 操作方法
  addTodo: (text: string) => Promise<boolean>
  updateTodo: (id: number, data: UpdateData) => Promise<boolean>
  toggleTodo: (id: number) => Promise<boolean>
  deleteTodo: (id: number) => Promise<boolean>
  clearCompleted: () => Promise<ClearResult | null>
  toggleAll: () => Promise<boolean>
  reorderTodos: (items: ReorderItem[]) => Promise<boolean>
  
  // 搜索和过滤
  setFilter: (filter: string) => void
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  
  // 工具方法
  refresh: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
}
```

### todoApi 服务

直接的 API 调用服务。

#### 方法列表

```typescript
class TodoApiService {
  // 获取待办事项
  getTodos(params?: GetTodosParams): Promise<Todo[]>
  getTodoById(id: number): Promise<Todo>
  
  // 创建和更新
  createTodo(data: CreateTodoData): Promise<Todo>
  updateTodo(id: number, data: UpdateTodoData): Promise<Todo>
  
  // 状态操作
  toggleTodo(id: number): Promise<Todo>
  toggleAll(): Promise<Todo[]>
  
  // 删除操作
  deleteTodo(id: number): Promise<void>
  clearCompleted(): Promise<ClearResult>
  
  // 其他操作
  getStats(): Promise<TodoStats>
  reorderTodos(items: ReorderItem[]): Promise<Todo[]>
}
```

### httpClient 工具

通用的 HTTP 客户端。

```typescript
class HttpClient {
  get(endpoint: string, params?: object): Promise<any>
  post(endpoint: string, data?: any): Promise<any>
  put(endpoint: string, data?: any): Promise<any>
  delete(endpoint: string): Promise<any>
}
```

## 🔧 配置选项

### API 配置

在 `src/config/api.js` 中可以配置：

```javascript
export const apiConfig = {
  baseURL: 'http://localhost:3000/api', // API 基础地址
  timeout: 10000,                       // 请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
}
```

### 环境变量

支持的环境变量：

- `VITE_API_BASE_URL`: API 基础地址

## 🎯 使用场景

### 1. 基础 CRUD 操作

```javascript
import { useTodos } from '@/services/useTodos.js'

const { addTodo, updateTodo, deleteTodo } = useTodos()

// 添加
await addTodo('学习 Vue.js')

// 更新
await updateTodo(1, { text: '深入学习 Vue.js', completed: true })

// 删除
await deleteTodo(1)
```

### 2. 搜索和过滤

```javascript
const { setFilter, setSearchQuery, filteredTodos } = useTodos()

// 设置过滤条件
setFilter('active')     // 显示未完成的
setFilter('completed')  // 显示已完成的
setFilter('all')        // 显示全部

// 搜索
setSearchQuery('学习')  // 搜索包含"学习"的待办事项
```

### 3. 批量操作

```javascript
const { toggleAll, clearCompleted } = useTodos()

// 全选/取消全选
await toggleAll()

// 清除已完成的待办事项
const result = await clearCompleted()
console.log(`删除了 ${result.deletedCount} 个待办事项`)
```

### 4. 拖拽排序

```javascript
const { reorderTodos } = useTodos()

// 重新排序
const reorderItems = [
  { id: 1, order: 0 },
  { id: 2, order: 1 },
  { id: 3, order: 2 },
]

await reorderTodos(reorderItems)
```

### 5. 错误处理

```javascript
const { error, clearError } = useTodos()

// 监听错误
watch(error, (newError) => {
  if (newError) {
    // 显示错误提示
    console.error('操作失败:', newError)
    
    // 3秒后自动清除错误
    setTimeout(clearError, 3000)
  }
})
```

## 🔍 调试和开发

### 启用调试日志

在浏览器控制台中设置：

```javascript
// 启用详细日志
localStorage.setItem('debug', 'todoapp:*')

// 重新加载页面
location.reload()
```

### 常见问题

1. **网络连接失败**
   - 检查后端服务是否启动
   - 确认 API 地址配置正确
   - 检查 CORS 设置

2. **请求超时**
   - 增加 `timeout` 配置
   - 检查网络连接

3. **数据不同步**
   - 调用 `refresh()` 方法刷新数据
   - 检查是否有并发操作冲突

## 🚀 性能优化

### 1. 请求去重

```javascript
// Hook 内部已实现请求去重，避免重复调用
const { fetchTodos } = useTodos()

// 多次快速调用只会执行一次
fetchTodos()
fetchTodos()
fetchTodos()
```

### 2. 本地缓存

```javascript
// 可以结合本地存储实现缓存
const { todos, refresh } = useTodos()

// 定期刷新数据
setInterval(refresh, 30000) // 每30秒刷新一次
```

### 3. 分页加载

```javascript
// 对于大量数据，可以实现分页
const { getTodos } = todoApi

const loadMore = async (page = 1, limit = 20) => {
  const params = { page, limit }
  return await getTodos(params)
}
```

## 📝 类型定义

```typescript
// 待办事项类型
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
  order: number
}

// 统计信息类型
interface TodoStats {
  total: number
  active: number
  completed: number
}

// 创建待办事项数据
interface CreateTodoData {
  text: string
}

// 更新待办事项数据
interface UpdateTodoData {
  text?: string
  completed?: boolean
}

// 重新排序项目
interface ReorderItem {
  id: number
  order: number
}

// 清除结果
interface ClearResult {
  message: string
  deletedCount: number
}
```

## 🤝 贡献指南

1. 遵循现有的代码风格
2. 添加适当的错误处理
3. 编写清晰的注释
4. 更新相关文档
5. 添加单元测试

## 📄 许可证

本项目采用 MIT 许可证。