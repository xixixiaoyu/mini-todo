# 前端 Dockerfile - 多阶段构建
FROM node:20-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm@8.15.0

# 设置工作目录
WORKDIR /app

# 复制 workspace 配置文件
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# 复制前端应用的 package.json
COPY apps/frontend/package.json ./apps/frontend/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder

# 复制前端源代码
COPY apps/frontend ./apps/frontend

# 构建前端应用
RUN pnpm --filter=frontend build

# 生产阶段 - 使用 nginx 提供静态文件服务
FROM nginx:alpine AS production

# 复制构建产物到 nginx 目录
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]