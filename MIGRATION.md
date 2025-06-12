# 🔄 Monorepo 迁移指南

本文档说明如何将现有的前后端分离项目迁移到 monorepo 架构。

## 📋 迁移前后对比

### 迁移前结构
```
todolist/
├── src/                    # Vue.js 前端代码
├── public/
├── todolist-backend/       # NestJS 后端代码
├── package.json           # 前端依赖
├── vite.config.js
└── ...
```

### 迁移后结构
```
todolist-monorepo/
├── apps/
│   ├── frontend/          # Vue.js 前端应用
│   └── backend/           # NestJS 后端应用
├── packages/              # 共享包
├── pnpm-workspace.yaml    # workspace 配置
├── package.json           # 根目录配置
└── ...
```

## 🚀 迁移步骤

### 1. 备份现有项目
```bash
cp -r todolist todolist-backup
```

### 2. 安装 pnpm（如果尚未安装）
```bash
npm install -g pnpm
```

### 3. 创建 workspace 配置
创建 `pnpm-workspace.yaml`：
```yaml
packages:
  - "packages/*"
  - "apps/*"
```

### 4. 重构目录结构
```bash
# 创建新的目录结构
mkdir -p apps packages

# 移动前端代码
mkdir apps/frontend
mv src public index.html vite.config.js jsconfig.json apps/frontend/

# 移动后端代码
mv todolist-backend apps/backend
```

### 5. 更新配置文件

#### 根目录 package.json
```json
{
  "name": "todolist-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter=./apps/* dev",
    "build": "pnpm --recursive --filter=./apps/* build",
    "frontend:dev": "pnpm --filter=frontend dev",
    "backend:dev": "pnpm --filter=backend start:dev"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### 前端 package.json
```json
{
  "name": "frontend",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.3",
    "vite": "^6.2.4"
  }
}
```

#### 后端 package.json
```json
{
  "name": "backend",
  "version": "0.0.1",
  "private": true,
  // ... 其他配置保持不变
}
```

### 6. 安装依赖
```bash
# 删除旧的 node_modules
rm -rf node_modules apps/frontend/node_modules apps/backend/node_modules

# 安装所有依赖
pnpm install
```

### 7. 测试迁移结果
```bash
# 测试前端
pnpm frontend:dev

# 测试后端
pnpm backend:dev

# 同时启动
pnpm dev
```

## ✅ 迁移检查清单

- [ ] 创建了 `pnpm-workspace.yaml` 文件
- [ ] 移动了前端代码到 `apps/frontend/`
- [ ] 移动了后端代码到 `apps/backend/`
- [ ] 更新了根目录 `package.json`
- [ ] 创建了前端 `package.json`
- [ ] 更新了后端 `package.json` 中的 name 字段
- [ ] 删除了旧的 `node_modules` 目录
- [ ] 运行了 `pnpm install`
- [ ] 测试了前端开发服务器
- [ ] 测试了后端开发服务器
- [ ] 测试了并行启动命令

## 🔧 常见问题

### Q: 为什么选择 pnpm 而不是 npm 或 yarn？
A: pnpm 在 monorepo 场景下有以下优势：
- 更高效的磁盘空间利用
- 更快的安装速度
- 更好的依赖管理
- 原生支持 workspace

### Q: 如何处理共享依赖？
A: 将共享依赖安装在根目录：
```bash
pnpm add -w typescript @types/node
```

### Q: 如何添加新的应用？
A: 在 `apps/` 目录下创建新应用，并确保有 `package.json` 文件。

### Q: 如何创建共享包？
A: 在 `packages/` 目录下创建包，例如：
```bash
mkdir packages/shared-utils
cd packages/shared-utils
pnpm init
```

## 🎯 下一步建议

1. **添加共享包**: 创建 `packages/ui`、`packages/utils` 等共享包
2. **统一代码规范**: 配置 ESLint、Prettier
3. **添加 Git hooks**: 使用 Husky 管理 Git hooks
4. **版本管理**: 考虑使用 Changesets 管理版本发布
5. **CI/CD 优化**: 配置针对 monorepo 的构建流水线

## 📚 参考资源

- [pnpm Workspace 文档](https://pnpm.io/workspaces)
- [Monorepo 最佳实践](https://monorepo.tools/)
- [NestJS 文档](https://docs.nestjs.com/)
- [Vue.js 文档](https://vuejs.org/)