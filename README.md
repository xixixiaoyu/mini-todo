# 📝 Vue TodoList 应用

一个使用 Vue 3 和 Composition API 构建的现代化待办事项应用，具有优雅的界面设计和丰富的功能。

## ✨ 功能特性

### 🎯 核心功能
- **添加任务**: 快速添加新的待办事项
- **完成任务**: 点击复选框标记任务完成状态
- **编辑任务**: 双击任务文本或点击编辑按钮进行修改
- **删除任务**: 删除不需要的任务
- **任务过滤**: 按状态筛选任务（全部/待完成/已完成）
- **批量操作**: 一键标记所有任务完成/未完成，清除已完成任务
- **数据持久化**: 使用 localStorage 自动保存数据

### 🎨 界面特性
- **现代化设计**: 采用渐变背景和卡片式布局
- **响应式布局**: 完美适配桌面端和移动端
- **流畅动画**: 丰富的过渡动画和交互效果
- **直观统计**: 实时显示任务完成情况统计
- **优雅交互**: 悬停效果、焦点状态等细节优化

### 📱 用户体验
- **键盘快捷键**: Enter 键快速添加，Escape 键取消编辑
- **智能提示**: 字符计数、输入提示等贴心功能
- **空状态处理**: 友好的空状态提示信息
- **时间显示**: 显示任务创建时间（相对时间）
- **无障碍支持**: 完善的 ARIA 标签和键盘导航

## 🛠️ 技术栈

- **Vue 3**: 最新的 Vue.js 框架
- **Composition API**: 使用 `<script setup>` 语法
- **Vite**: 快速的构建工具
- **CSS3**: 现代 CSS 特性（Grid、Flexbox、动画等）
- **ES6+**: 现代 JavaScript 语法
- **响应式设计**: 移动优先的设计理念

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd todolist
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   访问 `http://localhost:5173` 查看应用

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # Vue 组件
│   ├── TodoForm.vue    # 添加任务表单组件
│   ├── TodoItem.vue    # 单个任务项组件
│   └── TodoFilter.vue  # 过滤器和批量操作组件
├── assets/             # 静态资源
│   ├── main.css       # 全局样式
│   └── base.css       # 基础样式
├── App.vue            # 根组件
└── main.js           # 应用入口
```

## 🎮 使用指南

### 添加任务
1. 在顶部输入框中输入任务内容
2. 按 Enter 键或点击 ➕ 按钮添加
3. 支持最多 200 个字符，实时显示字符计数

### 管理任务
- **完成任务**: 点击任务前的圆形复选框
- **编辑任务**: 双击任务文本或点击编辑图标
- **删除任务**: 点击删除图标（垃圾桶）
- **批量操作**: 使用过滤器区域的批量操作按钮

### 过滤任务
- **全部**: 显示所有任务
- **待完成**: 只显示未完成的任务
- **已完成**: 只显示已完成的任务

### 键盘快捷键
- `Enter`: 添加新任务或保存编辑
- `Escape`: 取消编辑
- `Tab`: 在界面元素间导航

## 🎨 设计理念

### 视觉设计
- **色彩方案**: 使用紫色渐变主题，营造现代感
- **排版**: 清晰的层次结构和适当的留白
- **图标**: 使用 SVG 图标，确保清晰度和可缩放性
- **动画**: 微妙的过渡效果，提升用户体验

### 交互设计
- **即时反馈**: 所有操作都有即时的视觉反馈
- **容错性**: 防止误操作，提供撤销机制
- **一致性**: 统一的交互模式和视觉语言
- **可访问性**: 支持键盘导航和屏幕阅读器

## 🔧 自定义配置

### 修改主题色彩
在 `src/assets/main.css` 中修改 CSS 变量：

```css
:root {
  --primary-color: #4f46e5;    /* 主色调 */
  --success-color: #16a34a;    /* 成功色 */
  --danger-color: #dc2626;     /* 危险色 */
  --background: #f8fafc;       /* 背景色 */
}
```

### 修改存储键名
在 `src/App.vue` 中修改 localStorage 键名：

```javascript
const STORAGE_KEY = 'my-custom-todos'
const STORAGE_ID_KEY = 'my-custom-todos-id'
```

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
