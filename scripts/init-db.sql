-- 创建 TodoList 应用所需的基础表结构

-- 创建待办事项表（匹配当前 TypeORM 实体）
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_order ON todos("order");
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos("createdAt");

-- 插入示例数据
INSERT INTO todos (text, completed, "order") VALUES 
('学习 TypeORM 和数据库集成', false, 1),
('完成待办事项应用的后端开发', false, 2),
('测试数据库连接和 CRUD 操作', false, 3),
('部署应用到生产环境', false, 4)
ON CONFLICT DO NOTHING;