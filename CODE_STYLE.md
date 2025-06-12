# 📋 代码风格指南

本项目已统一配置代码格式化工具，确保前后端代码风格一致。

## 🛠️ 工具配置

### Prettier 配置
- **配置文件**: `.prettierrc`
- **忽略文件**: `.prettierignore`
- **主要规则**:
  - 使用单引号
  - 尾随逗号
  - 分号结尾
  - 2 空格缩进
  - 80 字符行宽

### ESLint 配置
- **配置文件**: `eslint.config.mjs`
- **支持技术栈**:
  - TypeScript (后端)
  - Vue.js (前端)
  - JavaScript (通用)

## 🚀 使用命令

### 格式化代码
```bash
# 格式化所有文件
pnpm format

# 检查格式化状态（不修改文件）
pnpm format:check
```

### 代码检查
```bash
# 运行 ESLint 并自动修复
pnpm lint

# 仅检查问题（不修改文件）
pnpm lint:check
```

## 📁 配置文件说明

### 根目录配置文件
- `.prettierrc` - Prettier 格式化规则
- `.prettierignore` - Prettier 忽略文件
- `eslint.config.mjs` - ESLint 检查规则

### 应用特定配置
- 后端：继承根目录配置，针对 TypeScript 和 NestJS 优化
- 前端：继承根目录配置，针对 Vue.js 优化

## 🔧 IDE 集成

### VS Code
推荐安装以下扩展：
- ESLint
- Prettier - Code formatter
- Vetur (Vue 支持)

### 自动格式化设置
在 VS Code 的 `settings.json` 中添加：
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ]
}
```

## 📋 代码提交前检查

建议在提交代码前运行：
```bash
# 格式化代码
pnpm format

# 检查代码质量
pnpm lint

# 运行测试
pnpm test
```

## 🎯 最佳实践

1. **提交前格式化**: 确保代码符合项目规范
2. **遵循 ESLint 规则**: 修复所有 ESLint 警告和错误
3. **保持一致性**: 前后端使用相同的格式化规则
4. **定期更新**: 保持工具和规则的最新版本

## 🔄 迁移说明

如果你之前使用的是应用级别的配置：
1. 新的根目录配置会覆盖应用级别的配置
2. 可以删除 `apps/backend/.prettierrc` 和应用级别的 ESLint 配置
3. 运行 `pnpm install` 安装新的依赖
4. 运行 `pnpm format` 重新格式化所有代码