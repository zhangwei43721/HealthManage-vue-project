# 健康管理系统前端

本项目是一个使用 Vue 3、Vite 和 TypeScript 构建的健康管理系统前端界面。

## 主要功能

- **智能健康问答 (AI QA):** 提供基于 AI 的健康咨询，支持图文交互。
- **健康知识库:** 展示和搜索各类健康与运动知识。
- **健康评估报告:** 根据用户数据生成多维度健康分析报告。
- **健康数据日志:** 记录、管理和回顾用户的健康指标。
- **身体信息上传:** 用户录入个人健康相关数据。
- **用户认证:** 提供登录、注册和 Token 管理。
- **后台管理:** 包括用户管理、角色权限管理、运动信息管理、用户健康数据管理等。

## 技术栈

- **框架:** Vue 3
- **构建工具:** Vite
- **语言:** TypeScript
- **UI 库/样式:** Tailwind CSS (v4)
- **图标库:** IconPark
- **状态管理:** (如果使用了，例如 Pinia)
- **路由:** Vue Router
- **HTTP 请求:** Axios

## 推荐 IDE 设置

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (请禁用 Vetur 插件以避免冲突)

## 项目设置

```sh
# 安装依赖
npm install

# 启动开发服务器 (带热重载)
npm run dev

# 类型检查、编译和打包生产版本
npm run build

# 使用 ESLint 进行代码检查
npm run lint
```

## TypeScript 支持 `.vue` 文件

默认情况下，TypeScript 无法处理 `.vue` 文件的类型信息。本项目使用 `vue-tsc` 替代 `tsc` 进行类型检查。在编辑器中，推荐使用 Volar 插件，它能让 TypeScript 语言服务识别 `.vue` 文件中的类型。

## 配置参考

- [Vite 配置参考](https://vite.dev/config/)
- [Tailwind CSS 配置](https://tailwindcss.com/docs/configuration) (v4 使用 `@tailwindcss/vite` 插件集成，通常无需手动配置 `postcss.config.js`)
