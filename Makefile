# TodoList Monorepo Makefile
# 简化 Docker 和开发命令的使用

.PHONY: help dev build up down logs clean test lint format install

# 默认目标
help: ## 显示帮助信息
	@echo "TodoList Monorepo 可用命令:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# 开发环境命令
dev: ## 启动开发环境
	docker-compose -f docker-compose.dev.yml up --build

dev-detached: ## 后台启动开发环境
	docker-compose -f docker-compose.dev.yml up --build -d

dev-down: ## 停止开发环境
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## 查看开发环境日志
	docker-compose -f docker-compose.dev.yml logs -f

# 生产环境命令
build: ## 构建生产镜像
	docker-compose build

up: ## 启动生产环境
	docker-compose up -d

down: ## 停止生产环境
	docker-compose down

restart: ## 重启生产环境
	docker-compose restart

logs: ## 查看生产环境日志
	docker-compose logs -f

status: ## 查看容器状态
	docker-compose ps

# 本地开发命令
install: ## 安装依赖
	pnpm install

local-dev: ## 本地启动开发服务器
	pnpm dev

local-build: ## 本地构建项目
	pnpm build

test: ## 运行测试
	pnpm test

lint: ## 代码检查
	pnpm lint

format: ## 代码格式化
	pnpm format

# 数据库命令
db-migrate: ## 运行数据库迁移
	docker-compose exec backend pnpm run migration:run

db-seed: ## 填充测试数据
	docker-compose exec backend pnpm run seed

db-reset: ## 重置数据库
	docker-compose exec database psql -U todolist_user -d todolist -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker-compose restart backend

# 清理命令
clean: ## 清理 Docker 资源
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

clean-all: ## 清理所有 Docker 资源（包括镜像）
	docker-compose down -v --rmi all
	docker system prune -af
	docker volume prune -f

# 监控和调试命令
health: ## 检查服务健康状态
	@echo "检查前端服务..."
	@curl -f http://localhost:80/health || echo "前端服务不可用"
	@echo "检查后端服务..."
	@curl -f http://localhost:3000/health || echo "后端服务不可用"
	@echo "检查数据库服务..."
	@docker-compose exec database pg_isready -U todolist_user -d todolist || echo "数据库服务不可用"

shell-frontend: ## 进入前端容器 shell
	docker-compose exec frontend sh

shell-backend: ## 进入后端容器 shell
	docker-compose exec backend sh

shell-db: ## 进入数据库容器 shell
	docker-compose exec database psql -U todolist_user -d todolist

# 部署命令
deploy-staging: ## 部署到测试环境
	@echo "部署到测试环境..."
	git push origin develop

deploy-prod: ## 部署到生产环境
	@echo "部署到生产环境..."
	git push origin main

# 备份和恢复
backup: ## 备份数据库
	mkdir -p backups
	docker-compose exec database pg_dump -U todolist_user todolist > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql

restore: ## 恢复数据库（需要指定备份文件：make restore BACKUP_FILE=backup.sql）
	@if [ -z "$(BACKUP_FILE)" ]; then echo "请指定备份文件：make restore BACKUP_FILE=backup.sql"; exit 1; fi
	docker-compose exec -T database psql -U todolist_user -d todolist < $(BACKUP_FILE)

# 性能监控
monitor: ## 监控容器资源使用情况
	docker stats

# 安全扫描
security-scan: ## 运行安全扫描
	docker run --rm -v $(PWD):/app aquasec/trivy fs /app