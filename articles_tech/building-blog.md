---
title: 我是如何搭建这个博客的
date: 2026-07-30
tags: [技术, Web, 教程]
excerpt: 从零开始构建一个轻量级个人博客的全过程，包含设计思路和技术选型。
---

这个博客从构思到完成只花了一个下午的时间。下面分享一下整个过程。

## 技术选型

我选择了一个极简的技术栈：

- **纯 HTML**：结构清晰，语义化标签
- **CSS 自定义属性**：实现深色/浅色主题切换
- **原生 JavaScript**：实现前端路由和页面渲染
- **marked.js**：Markdown 渲染引擎
- **highlight.js**：代码语法高亮

没有 Webpack、没有 React、没有数据库。所有文章以 Markdown 文件存储在 `articles/` 文件夹中，通过构建脚本生成文章索引，页面通过 hash 路由切换。

## 设计原则

1. **内容优先**：排版清晰，阅读体验好
2. **响应式**：在手机和电脑上都有好的表现
3. **可访问性**：语义化 HTML，支持键盘导航
4. **性能**：零框架依赖，首屏加载极快

## 主题切换

使用 CSS 自定义属性（CSS Variables）实现主题切换。定义两套颜色变量，通过切换 `data-theme` 属性在深浅色之间切换。用户的选择会保存在 `localStorage` 中，下次访问自动应用。

```css
:root {
  --bg: #050510;
  --accent: #00e5ff;
}

[data-theme="light"] {
  --bg: #f0f4f8;
  --accent: #0077ee;
}
```

## 路由设计

使用 hash 路由（`#/path`），监听 `hashchange` 事件来切换页面内容。这种方式兼容性好，不需要服务器配置。

```javascript
function router() {
  const route = window.location.hash.slice(1) || '/';
  const postMatch = route.match(/^\/post\/(.+)$/);
  // 根据路由渲染不同页面
}
```

## 插件集成

这个博客还集成了几个实用的功能：

| 功能 | 方案 | 说明 |
|------|------|------|
| 评论 | Giscus | 基于 GitHub Discussions，免费无后端 |
| 搜索 | 原生 JS | 实时筛选标题和标签 |
| 统计 | 不蒜子 | 轻量访问计数 |
| 高亮 | highlight.js | 190+ 语言语法着色 |

> 简单就是美。少即是多。

如果你也想搭建自己的博客，希望这篇文章能给你一些启发。
