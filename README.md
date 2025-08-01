# wegic-cli

前端项目脚手架工具，支持创建组件库、工具包和类型包项目。

## 特性

- 🚀 快速创建组件库、工具包和类型包项目
- 📦 基于React、TypeScript、Vite的现代化技术栈
- 🎨 支持多种样式方案 (Less, Tailwind CSS, CSS Modules)
- 📚 支持Storybook文档集成
- 🧩 支持monorepo项目结构 (pnpm workspace)
- 📝 自动生成更新日志和版本管理

## 安装

### 全局安装

```bash
npm install -g wegic-cli
```

或者

```bash
pnpm add -g wegic-cli
```

## 使用方法

### 创建新项目

```bash
wegic-cli create my-project
```

按照提示选择项目类型和配置：

- 组件库项目 - 创建一个React组件库项目
- 工具包项目 - 创建一个通用JavaScript/TypeScript工具库
- 类型包项目 - 创建一个TypeScript类型定义包

### 可选功能

- 文档展示 - 使用Storybook进行组件开发和文档展示
- 样式解决方案 - 选择Less、Tailwind CSS、CSS Modules (可多选)

## 项目类型说明

### 组件库项目

- 基于React和TypeScript的组件库
- 支持按需引入
- 支持组件文档生成
- 支持国际化
- 提供完整TypeScript类型声明

### 工具包项目

- 通用JavaScript/TypeScript工具库
- 支持ESM, CJS, UMD多种模块格式
- 自动生成API文档
- 优化的打包配置

### 类型包项目

- 纯TypeScript类型定义包
- 支持自动生成类型声明文件
- 包含类型测试
- 标准化的类型发布流程

## 开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/wegic-cli.git
cd wegic-cli

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 贡献指南

欢迎提交问题和贡献代码！请遵循以下步骤：

1. Fork此仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 许可证

MIT © [你的名字] 