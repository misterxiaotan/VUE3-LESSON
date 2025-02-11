# 基于 Vue 3.4 的 Vue 功能实现

目标是逐步实现 Vue 的所有功能，项目仍在随缘更新中。

---

## 更新日志

### v0.1.0 - 初始版本

- 初步实现 Vue 3.4 的响应式系统。
- 添加了 `reactive` 和 `ref` 的基本功能。
- 实现了 `watch` 和 `watchEffect` 的基础逻辑。

## 项目启动说明

```bash
pnpm dev
```

因为使用的是 Monorepo 结构 ，esbuild 动态热更新，最终代码会打包到 dist 目录，在对应包的 dist 文件中跑 html 文件，导入打包后的 js 就能看效果。

### 安装依赖

在项目根目录运行以下命令以安装依赖：

```bash
pnpm install
```
