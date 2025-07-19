# SnakeSnake 开发环境 Docker 配置
# 多阶段构建，支持开发和生产环境

# 基础镜像
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    git \
    curl \
    wget \
    && rm -rf /var/cache/apk/*

# 复制 package 文件
COPY package*.json ./

# 开发阶段
FROM base AS development

# 安装开发依赖
RUN npm ci --only=development

# 复制源代码
COPY . .

# 创建配置文件
RUN cp .env.example .env || echo "Creating .env file"

# 暴露端口
EXPOSE 3000

# 开发命令
CMD ["npm", "run", "dev"]

# 测试阶段
FROM development AS test

# 运行测试
RUN npm test

# 代码规范检查
RUN npm run lint

# 生产阶段
FROM base AS production

# 安装生产依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建配置文件
RUN cp .env.example .env || echo "Creating .env file"

# 暴露端口
EXPOSE 3000

# 生产命令
CMD ["npm", "start"]

# 构建阶段
FROM base AS builder

# 安装所有依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 最终生产镜像
FROM node:18-alpine AS final

# 设置工作目录
WORKDIR /app

# 安装生产依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制构建结果
COPY --from=builder /app/dist ./dist

# 创建配置文件
RUN cp .env.example .env || echo "Creating .env file"

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"] 