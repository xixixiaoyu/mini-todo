# TodoList API 文档

本文档描述了 TodoList 后端 API 的所有端点和使用方法。

## 基础信息

- **基础 URL**: `http://localhost:3000/api`
- **内容类型**: `application/json`
- **支持的 HTTP 方法**: GET, POST, PUT, DELETE

## API 端点

### 1. 获取所有待办事项

```http
GET /api/todos
```

**查询参数**:
- `filter` (可选): 过滤条件
  - `all`: 所有待办事项（默认）
  - `active`: 未完成的待办事项
  - `completed`: 已完成的待办事项
- `search` (可选): 搜索关键词

**示例请求**:
```http
GET /api/todos?filter=active&search=学习
```

**响应**:
```json
[
  {
    "id": 1,
    "text": "学习 Vue.js",
    "completed": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "order": 0
  }
]
```

### 2. 获取统计信息

```http
GET /api/todos/stats
```

**响应**:
```json
{
  "total": 5,
  "active": 3,
  "completed": 2
}
```

### 3. 获取单个待办事项

```http
GET /api/todos/:id
```

**路径参数**:
- `id`: 待办事项 ID

**响应**:
```json
{
  "id": 1,
  "text": "学习 Vue.js",
  "completed": false,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "order": 0
}
```

### 4. 创建待办事项

```http
POST /api/todos
```

**请求体**:
```json
{
  "text": "学习 NestJS"
}
```

**验证规则**:
- `text`: 必填，字符串，最大长度 500 字符

**响应**:
```json
{
  "id": 2,
  "text": "学习 NestJS",
  "completed": false,
  "createdAt": "2024-01-01T11:00:00.000Z",
  "order": 1
}
```

### 5. 更新待办事项

```http
PUT /api/todos/:id
```

**路径参数**:
- `id`: 待办事项 ID

**请求体**:
```json
{
  "text": "学习 NestJS 框架",
  "completed": true
}
```

**验证规则**:
- `text` (可选): 字符串，最大长度 500 字符
- `completed` (可选): 布尔值

**响应**:
```json
{
  "id": 2,
  "text": "学习 NestJS 框架",
  "completed": true,
  "createdAt": "2024-01-01T11:00:00.000Z",
  "order": 1
}
```

### 6. 切换完成状态

```http
PUT /api/todos/:id/toggle
```

**路径参数**:
- `id`: 待办事项 ID

**响应**:
```json
{
  "id": 1,
  "text": "学习 Vue.js",
  "completed": true,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "order": 0
}
```

### 7. 删除待办事项

```http
DELETE /api/todos/:id
```

**路径参数**:
- `id`: 待办事项 ID

**响应**: 204 No Content

### 8. 清除已完成的待办事项

```http
DELETE /api/todos/completed
```

**响应**:
```json
{
  "message": "已删除 3 个已完成的待办事项",
  "deletedCount": 3
}
```

### 9. 切换所有待办事项状态

```http
PUT /api/todos/toggle-all
```

**响应**:
```json
[
  {
    "id": 1,
    "text": "学习 Vue.js",
    "completed": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "order": 0
  },
  {
    "id": 2,
    "text": "学习 NestJS",
    "completed": true,
    "createdAt": "2024-01-01T11:00:00.000Z",
    "order": 1
  }
]
```

### 10. 重新排序待办事项

```http
PUT /api/todos/reorder
```

**请求体**:
```json
{
  "items": [
    { "id": 2, "order": 0 },
    { "id": 1, "order": 1 }
  ]
}
```

**验证规则**:
- `items`: 必填，数组，至少包含一个元素
- `items[].id`: 必填，数字
- `items[].order`: 必填，数字

**响应**:
```json
[
  {
    "id": 2,
    "text": "学习 NestJS",
    "completed": false,
    "createdAt": "2024-01-01T11:00:00.000Z",
    "order": 0
  },
  {
    "id": 1,
    "text": "学习 Vue.js",
    "completed": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "order": 1
  }
]
```

## 错误响应

所有错误响应都遵循统一的格式：

```json
{
  "statusCode": 404,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/todos/999",
  "method": "GET",
  "message": "ID 为 999 的待办事项不存在",
  "error": "Not Found"
}
```

### 常见错误码

- **400 Bad Request**: 请求参数验证失败
- **404 Not Found**: 资源不存在
- **500 Internal Server Error**: 服务器内部错误

## 前端集成示例

### JavaScript/TypeScript

```typescript
// 获取所有待办事项
const fetchTodos = async (filter = 'all', search = '') => {
  const params = new URLSearchParams();
  if (filter !== 'all') params.append('filter', filter);
  if (search) params.append('search', search);
  
  const response = await fetch(`http://localhost:3000/api/todos?${params}`);
  return response.json();
};

// 创建待办事项
const createTodo = async (text: string) => {
  const response = await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  return response.json();
};

// 切换完成状态
const toggleTodo = async (id: number) => {
  const response = await fetch(`http://localhost:3000/api/todos/${id}/toggle`, {
    method: 'PUT',
  });
  return response.json();
};

// 删除待办事项
const deleteTodo = async (id: number) => {
  await fetch(`http://localhost:3000/api/todos/${id}`, {
    method: 'DELETE',
  });
};
```

### Vue.js 组合式 API 示例

```vue
<script setup>
import { ref, onMounted } from 'vue';

const todos = ref([]);
const filter = ref('all');
const search = ref('');

const API_BASE = 'http://localhost:3000/api';

// 获取待办事项
const fetchTodos = async () => {
  const params = new URLSearchParams();
  if (filter.value !== 'all') params.append('filter', filter.value);
  if (search.value) params.append('search', search.value);
  
  const response = await fetch(`${API_BASE}/todos?${params}`);
  todos.value = await response.json();
};

// 添加待办事项
const addTodo = async (text) => {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  
  if (response.ok) {
    await fetchTodos();
  }
};

// 切换完成状态
const toggleTodo = async (id) => {
  await fetch(`${API_BASE}/todos/${id}/toggle`, {
    method: 'PUT',
  });
  await fetchTodos();
};

onMounted(fetchTodos);
</script>
```

## 开发和测试

### 启动开发服务器

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm backend:dev
```

### 运行测试

```bash
# 运行单元测试
pnpm test

# 运行测试覆盖率
pnpm test:cov
```

### 使用 curl 测试 API

```bash
# 创建待办事项
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "测试待办事项"}'

# 获取所有待办事项
curl http://localhost:3000/api/todos

# 切换完成状态
curl -X PUT http://localhost:3000/api/todos/1/toggle

# 删除待办事项
curl -X DELETE http://localhost:3000/api/todos/1
```