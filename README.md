# 📝 TodoList Monorepo

这是一个使用 Vue.js + NestJS 构建的全栈 TodoList 应用，采用 monorepo 架构管理前后端代码。

## 🏗️ 项目结构

```
todolist-monorepo/
├── apps/
│   ├── frontend/          # Vue.js 前端应用
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   └── backend/           # NestJS 后端应用
│       ├── src/
│       ├── test/
│       └── package.json
├── packages/              # 共享包（未来扩展）
├── pnpm-workspace.yaml    # pnpm workspace 配置
├── package.json           # 根目录配置
└── README.md
```

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- pnpm 8.0 或更高版本（推荐使用 pnpm 作为包管理器）

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd todolist-monorepo
   ```

2. **安装 pnpm（如果尚未安装）**
   ```bash
   npm install -g pnpm
   ```

3. **安装所有依赖**
   ```bash
   pnpm install
   ```

4. **启动开发环境**
   ```bash
   # 同时启动前后端开发服务器
   pnpm dev
   
   # 或者分别启动
   pnpm frontend:dev    # 启动前端开发服务器
   pnpm backend:dev     # 启动后端开发服务器
   ```

5. **构建生产版本**
   ```bash
   pnpm build           # 构建所有应用
   pnpm frontend:build  # 仅构建前端
   pnpm backend:build   # 仅构建后端
   ```

6. **运行生产版本**
   ```bash
   pnpm start           # 启动所有应用
   pnpm backend:start   # 仅启动后端生产服务器
   ```

## 🛠️ 技术栈

### 前端 (Frontend)
- **Vue 3**: 最新的 Vue.js 框架
- **Composition API**: 使用 `<script setup>` 语法
- **Vite**: 快速的构建工具
- **CSS3**: 现代 CSS 特性

### 后端 (Backend)
- **NestJS**: 企业级 Node.js 框架
- **TypeScript**: 类型安全的 JavaScript
- **Express**: 底层 HTTP 服务器

### 开发工具
- **pnpm**: 高效的包管理器
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查

## 📁 详细项目结构

```
todolist-monorepo/
├── apps/
│   ├── frontend/                # Vue.js 前端应用
│   │   ├── src/
│   │   │   ├── components/      # Vue 组件
│   │   │   │   ├── TodoForm.vue
│   │   │   │   ├── TodoItem.vue
│   │   │   │   ├── TodoFilter.vue
│   │   │   │   └── icons/       # 图标组件
│   │   │   ├── assets/          # 静态资源
│   │   │   ├── App.vue          # 根组件
│   │   │   └── main.js          # 应用入口
│   │   ├── public/              # 公共资源
│   │   ├── index.html           # HTML 模板
│   │   ├── vite.config.js       # Vite 配置
│   │   ├── jsconfig.json        # JS 项目配置
│   │   └── package.json         # 前端依赖
│   └── backend/                 # NestJS 后端应用
│       ├── src/
│       │   ├── app.controller.ts
│       │   ├── app.service.ts
│       │   ├── app.module.ts
│       │   └── main.ts          # 应用入口
│       ├── test/                # 测试文件
│       ├── nest-cli.json        # NestJS CLI 配置
│       ├── tsconfig.json        # TypeScript 配置
│       └── package.json         # 后端依赖
├── packages/                    # 共享包（未来扩展）
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── package.json                 # 根目录配置
├── .gitignore                   # Git 忽略文件
└── README.md                    # 项目说明
```

## 🎮 使用指南

### 开发模式
- **前端开发**: `pnpm frontend:dev` - 启动 Vite 开发服务器 (http://localhost:5173)
- **后端开发**: `pnpm backend:dev` - 启动 NestJS 开发服务器 (http://localhost:3000)
- **同时开发**: `pnpm dev` - 并行启动前后端开发服务器

### 生产部署
- **构建应用**: `pnpm build` - 构建前后端生产版本
- **启动服务**: `pnpm start` - 启动生产环境服务

### 代码质量
- **代码检查**: `pnpm lint` - 运行 ESLint 检查所有应用
- **代码格式化**: `pnpm format` - 使用 Prettier 格式化代码
- **运行测试**: `pnpm test` - 运行所有测试

## 🔧 Monorepo 优势

### 代码共享
- **共享组件**: 在 `packages/` 目录下创建可复用的组件库
- **共享工具**: 统一的工具函数和类型定义
- **统一配置**: 共享 ESLint、Prettier、TypeScript 配置

### 开发效率
- **统一依赖管理**: 使用 pnpm workspace 管理所有依赖
- **原子化提交**: 前后端代码变更可以在同一个提交中
- **统一构建**: 一键构建和部署整个应用

### 版本控制
- **同步版本**: 前后端版本保持同步
- **统一发布**: 简化发布流程
- **依赖追踪**: 更好地追踪跨应用的依赖关系

## Docker 和 CI/CD

### Docker 支持

项目已完全容器化，支持开发和生产环境：

```bash
# 开发环境（支持热重载）
make dev

# 生产环境
make build
make up

# 查看服务状态
make status

# 查看日志
make logs
```

### CI/CD 流程

- **自动化测试**: 代码推送时自动运行测试
- **安全扫描**: 使用 Trivy 进行漏洞扫描
- **镜像构建**: 自动构建和推送 Docker 镜像
- **自动部署**: main 分支自动部署到生产环境
- **健康检查**: 部署后自动验证服务状态

详细配置请参考 [部署指南](./DEPLOYMENT.md)

### 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置
vim .env
```

## 🚀 扩展建议

### 添加共享包
```bash
# 创建共享 UI 组件库
mkdir -p packages/ui

# 创建共享工具库
mkdir -p packages/utils

# 创建共享类型定义
mkdir -p packages/types
```

### 集成更多工具
- **Husky**: Git hooks 管理
- **Commitlint**: 提交信息规范
- **Changesets**: 版本管理和发布
- **Turborepo**: 更高效的构建缓存
- **Kubernetes**: 大规模部署时考虑使用 K8s
- **监控系统**: 集成 Prometheus + Grafana
- **服务网格**: 使用 Istio 管理微服务通信

## 🌟 特色亮点

1. **现代化架构**: 使用 Vue 3 Composition API，代码更简洁易维护
2. **优雅动画**: 丰富的 CSS 动画和 Vue 过渡效果
3. **响应式设计**: 完美适配各种屏幕尺寸
4. **性能优化**: 使用 Vite 构建，开发和生产环境都有出色性能
5. **用户体验**: 注重细节的交互设计和无障碍支持
6. **代码质量**: 清晰的组件结构和完善的注释

## 📱 浏览器支持

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- Vue.js 团队提供的优秀框架
- Vite 团队提供的快速构建工具
- 所有开源贡献者的无私奉献

---

**Made with ❤️ using Vue 3 & Composition API**
