# 后端 Dockerfile - 多阶段构建
FROM node:18-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm@8.15.0

# 设置工作目录
WORKDIR /app

# 复制 workspace 配置文件
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# 复制后端应用的 package.json
COPY apps/backend/package.json ./apps/backend/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder

# 复制后端源代码
COPY apps/backend ./apps/backend

# 构建后端应用
RUN pnpm --filter=backend build

# 生产阶段
FROM node:18-alpine AS production

# 安装 pnpm
RUN npm install -g pnpm@8.15.0

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制 workspace 配置文件
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# 更改文件所有者
RUN chown -R nestjs:nodejs /app
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 启动应用
CMD ["pnpm", "--filter=backend", "start:prod"]