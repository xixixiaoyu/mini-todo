# 部署指南

本文档详细介绍了 TodoList Monorepo 项目的 CI/CD 流程配置和部署方法。

## 目录

- [架构概览](#架构概览)
- [环境准备](#环境准备)
- [Docker 配置](#docker-配置)
- [CI/CD 流程](#cicd-流程)
- [部署方式](#部署方式)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)

## 架构概览

### 技术栈

- **前端**: Vue.js 3 + Vite
- **后端**: NestJS + TypeScript
- **数据库**: PostgreSQL 15
- **缓存**: Redis 7
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **监控**: Docker Health Checks

### 环境分层

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   开发环境       │    │   测试环境       │    │   生产环境       │
│  Development    │    │    Staging      │    │   Production    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • 热重载        │    │ • 自动部署       │    │ • 手动部署       │
│ • 调试模式      │    │ • 集成测试       │    │ • 性能优化       │
│ • 本地数据库    │    │ • 模拟数据       │    │ • 生产数据       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 环境准备

### 1. 系统要求

- **操作系统**: Linux (Ubuntu 20.04+ 推荐) / macOS / Windows
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 18.0+ (本地开发)
- **pnpm**: 8.0+ (本地开发)

### 2. 服务器配置

#### 最小配置
- **CPU**: 2 核
- **内存**: 4GB
- **存储**: 20GB SSD
- **网络**: 100Mbps

#### 推荐配置
- **CPU**: 4 核
- **内存**: 8GB
- **存储**: 50GB SSD
- **网络**: 1Gbps

### 3. 环境变量配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
```

必须配置的环境变量：
- `DATABASE_PASSWORD`: 数据库密码
- `JWT_SECRET`: JWT 密钥
- `PRODUCTION_URL`: 生产环境域名

## Docker 配置

### 文件结构

```
├── docker-compose.yml          # 生产环境配置
├── docker-compose.dev.yml      # 开发环境配置
├── .dockerignore              # Docker 忽略文件
├── apps/
│   ├── frontend/
│   │   ├── Dockerfile         # 前端生产镜像
│   │   ├── Dockerfile.dev     # 前端开发镜像
│   │   └── nginx.conf         # Nginx 配置
│   └── backend/
│       ├── Dockerfile         # 后端生产镜像
│       └── Dockerfile.dev     # 后端开发镜像
└── scripts/
    └── init-db.sql           # 数据库初始化脚本
```

### 镜像构建策略

#### 多阶段构建

1. **Base 阶段**: 安装基础依赖
2. **Builder 阶段**: 编译和构建应用
3. **Production 阶段**: 运行时环境

#### 优化特性

- **层缓存**: 利用 Docker 层缓存加速构建
- **多平台支持**: 支持 AMD64 和 ARM64 架构
- **安全扫描**: 集成 Trivy 安全扫描
- **最小镜像**: 使用 Alpine Linux 减小镜像体积

## CI/CD 流程

### GitHub Actions 工作流

```yaml
# .github/workflows/ci-cd.yml
触发条件:
  - push to main/develop
  - pull request to main

工作流程:
  1. 代码检查和测试
  2. 安全扫描
  3. 构建 Docker 镜像
  4. 推送到容器注册表
  5. 部署到目标环境
  6. 健康检查
  7. 通知
```

### 流程详解

#### 1. 测试阶段 (test)

```bash
# 多 Node.js 版本测试
node-version: [18.x, 20.x]

# 执行步骤
- 代码检出
- 环境设置
- 依赖安装
- 代码检查 (ESLint)
- 格式检查 (Prettier)
- 单元测试
- 构建验证
```

#### 2. 安全扫描 (security)

```bash
# 使用 Trivy 扫描
- 文件系统扫描
- 依赖漏洞检查
- 结果上传到 GitHub Security
```

#### 3. 构建和推送 (build-and-push)

```bash
# 并行构建前后端镜像
services: [frontend, backend]

# 镜像标签策略
- latest (main 分支)
- branch-sha (特性分支)
- pr-number (Pull Request)
```

#### 4. 部署 (deploy)

```bash
# 生产环境部署
- SSH 连接到服务器
- 拉取最新代码
- 更新 Docker 镜像
- 滚动更新服务
- 清理旧资源
```

### 必需的 GitHub Secrets

```bash
# 服务器配置
PRODUCTION_HOST=your-server-ip
PRODUCTION_USER=deploy-user
PRODUCTION_SSH_KEY=your-private-key
PRODUCTION_URL=https://your-domain.com

# 通知配置
SLACK_WEBHOOK=your-slack-webhook-url
```

## 部署方式

### 1. 本地开发

```bash
# 使用 Makefile
make dev                 # 启动开发环境
make dev-logs           # 查看日志
make dev-down           # 停止环境

# 或直接使用 Docker Compose
docker-compose -f docker-compose.dev.yml up --build
```

### 2. 生产部署

#### 方式一：自动部署 (推荐)

```bash
# 推送到 main 分支触发自动部署
git push origin main
```

#### 方式二：手动部署

```bash
# 服务器上执行
cd /opt/todolist
git pull origin main
make build
make up
```

#### 方式三：使用 Makefile

```bash
# 本地执行
make deploy-prod        # 部署到生产环境
make deploy-staging     # 部署到测试环境
```

### 3. 滚动更新

```bash
# 零停机更新
docker-compose pull
docker-compose up -d --remove-orphans
```

### 4. 回滚策略

```bash
# 快速回滚到上一个版本
docker-compose down
docker tag todolist:previous todolist:latest
docker-compose up -d
```

## 监控和维护

### 1. 健康检查

```bash
# 自动健康检查
make health

# 手动检查
curl -f http://localhost/health
curl -f http://localhost:3000/health
```

### 2. 日志管理

```bash
# 查看实时日志
make logs

# 查看特定服务日志
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 3. 性能监控

```bash
# 资源使用情况
make monitor

# 容器状态
make status
```

### 4. 数据备份

```bash
# 自动备份
make backup

# 恢复数据
make restore BACKUP_FILE=backup_20231201_120000.sql
```

### 5. 安全维护

```bash
# 定期安全扫描
make security-scan

# 更新依赖
pnpm update
docker-compose pull
```

## 故障排除

### 常见问题

#### 1. 容器启动失败

```bash
# 检查容器状态
docker-compose ps

# 查看错误日志
docker-compose logs [service-name]

# 重新构建镜像
docker-compose build --no-cache
```

#### 2. 数据库连接问题

```bash
# 检查数据库状态
docker-compose exec database pg_isready -U todolist_user

# 进入数据库容器
make shell-db

# 重置数据库
make db-reset
```

#### 3. 前端无法访问后端

```bash
# 检查网络连接
docker network ls
docker network inspect todolist_todolist-network

# 检查环境变量
docker-compose exec frontend env | grep API
```

#### 4. 构建缓存问题

```bash
# 清理构建缓存
docker builder prune

# 完全重新构建
make clean-all
make build
```

### 性能优化

#### 1. 镜像优化

- 使用多阶段构建
- 优化层顺序
- 使用 .dockerignore
- 选择合适的基础镜像

#### 2. 容器优化

- 设置资源限制
- 配置健康检查
- 使用非 root 用户
- 启用安全选项

#### 3. 网络优化

- 使用自定义网络
- 配置服务发现
- 启用 HTTP/2
- 配置负载均衡

### 扩展建议

1. **容器编排**: 考虑使用 Kubernetes 进行大规模部署
2. **服务网格**: 使用 Istio 或 Linkerd 管理微服务通信
3. **监控系统**: 集成 Prometheus + Grafana
4. **日志聚合**: 使用 ELK Stack 或 Loki
5. **配置管理**: 使用 Consul 或 etcd
6. **密钥管理**: 使用 Vault 或 AWS Secrets Manager

## 联系和支持

如果在部署过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 联系开发团队

---

**注意**: 在生产环境中部署前，请确保已经充分测试所有配置，并备份重要数据。