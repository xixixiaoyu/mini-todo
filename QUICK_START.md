# 快速开始指南

本指南将帮助你在 5 分钟内启动 TodoList Monorepo 项目。

## 🚀 一键启动

### 前提条件

确保你的系统已安装：
- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0+)
- [Make](https://www.gnu.org/software/make/) (可选，用于简化命令)

### 克隆项目

```bash
git clone <your-repo-url>
cd todolist
```

### 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 可选：编辑配置（使用默认值即可快速启动）
# vim .env
```

### 启动项目

#### 方式一：使用 Makefile（推荐）

```bash
# 开发环境（支持热重载）
make dev

# 或者生产环境
make build && make up
```

#### 方式二：直接使用 Docker Compose

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up --build

# 或者生产环境
docker-compose up --build
```

### 访问应用

- **前端应用**: http://localhost (生产) 或 http://localhost:5173 (开发)
- **后端 API**: http://localhost:3000
- **数据库**: localhost:5432 (生产) 或 localhost:5433 (开发)
- **Redis**: localhost:6379 (生产) 或 localhost:6380 (开发)

## 🛠️ 常用命令

### 开发命令

```bash
# 查看服务状态
make status

# 查看实时日志
make logs

# 停止服务
make down  # 生产环境
make dev-down  # 开发环境

# 重启服务
make restart
```

### 数据库操作

```bash
# 进入数据库
make shell-db

# 备份数据库
make backup

# 重置数据库
make db-reset
```

### 清理命令

```bash
# 清理 Docker 资源
make clean

# 完全清理（包括镜像）
make clean-all
```

## 🔧 本地开发

如果你更喜欢本地开发而不是 Docker：

### 安装依赖

```bash
# 安装 pnpm（如果还没有）
npm install -g pnpm@8.15.0

# 安装项目依赖
pnpm install
```

### 启动开发服务器

```bash
# 同时启动前后端
pnpm dev

# 或者分别启动
pnpm frontend:dev  # 前端：http://localhost:5173
pnpm backend:dev   # 后端：http://localhost:3000
```

### 构建项目

```bash
# 构建所有应用
pnpm build

# 分别构建
pnpm frontend:build
pnpm backend:build
```

## 📋 健康检查

启动后，你可以验证所有服务是否正常运行：

```bash
# 自动检查所有服务
make health

# 手动检查
curl http://localhost/health      # 前端
curl http://localhost:3000/health # 后端
```

## 🐛 故障排除

### 端口冲突

如果遇到端口冲突，编辑 `.env` 文件修改端口：

```bash
FRONTEND_PORT=8080
BACKEND_PORT=3000
```

### 权限问题

在 Linux/macOS 上，如果遇到权限问题：

```bash
# 添加当前用户到 docker 组
sudo usermod -aG docker $USER

# 重新登录或执行
newgrp docker
```

### 容器启动失败

```bash
# 查看详细错误信息
docker-compose logs [service-name]

# 重新构建镜像
docker-compose build --no-cache
```

### 数据库连接问题

```bash
# 检查数据库状态
docker-compose exec database pg_isready -U todolist_user

# 如果数据库未初始化，重新创建
docker-compose down -v
docker-compose up --build
```

## 🚀 部署到生产环境

### 自动部署（推荐）

1. 配置 GitHub Secrets（参考 [DEPLOYMENT.md](./DEPLOYMENT.md)）
2. 推送代码到 main 分支：

```bash
git push origin main
```

### 手动部署

```bash
# 在服务器上
git pull origin main
make build
make up
```

## 📚 更多资源

- [完整部署指南](./DEPLOYMENT.md) - 详细的 CI/CD 配置
- [迁移指南](./MIGRATION.md) - 从单体应用迁移到 monorepo
- [项目文档](./README.md) - 完整的项目说明

## 🆘 获取帮助

如果遇到问题：

1. 查看 [故障排除](#故障排除) 部分
2. 检查 [GitHub Issues](https://github.com/your-repo/issues)
3. 联系开发团队

---

**提示**: 第一次启动可能需要几分钟来下载 Docker 镜像和构建应用。后续启动会更快。