---
title: 如何配置静态博客
date: 2026-08-04
tags: [技术, 教程, Web]
excerpt: 从零开始配置一个功能齐全的静态博客：Markdown 写作、Giscus 评论、代码高亮、站内搜索和访问统计。
---

搭建好博客只是第一步，让它变得好用还需要一些配置。这篇文章详细介绍每个功能的配置方法。

## 文章写作流程

所有文章放在 `articles/` 文件夹中，使用 Markdown 格式。每篇文章开头需要包含 **frontmatter** 元数据：

```yaml
---
title: 文章标题
date: 2026-08-04
tags: [标签1, 标签2, 标签3]
excerpt: 文章摘要，显示在首页卡片上。
---
```

写完文章后，运行构建命令：

```bash
node build.js
```

这会扫描 `articles/` 下所有 `.md` 文件，生成 `posts-data.js` 供前端加载。

## 配置 Giscus 评论

Giscus 是一个基于 GitHub Discussions 的评论系统，免费且数据归你自己所有。

### 步骤

1. 创建一个**公开的** GitHub 仓库（或使用已有的）
2. 进入仓库 **Settings → Features**，勾选 **Discussions**
3. 访问 [Giscus App](https://github.com/apps/giscus)，点击 Install，选择你的仓库
4. 访问 [giscus.app](https://giscus.app/zh-CN)，填写仓库名
5. 在「Discussion 分类」中选择 **Announcements**（或自建一个分类）
6. 复制生成的 `data-repo-id` 和 `data-category-id`
7. 打开 `script.js`，填入 `GISCUS_CONFIG`：

```javascript
const GISCUS_CONFIG = {
  owner: "your-username",        // GitHub 用户名
  repo: "your-repo-name",        // 仓库名
  repoId: "R_kgDOXXXXXX",        // 从 giscus.app 获取
  category: "Announcements",
  categoryId: "DIC_kwDOXXXXXX",  // 从 giscus.app 获取
  // ... 其他保持不变
};
```

配置完成后，每篇文章底部会自动显示评论区。

## 配置代码高亮

博客已集成 highlight.js，支持 190+ 种语言。要更换高亮主题，修改 `index.html` 中的 CSS 链接：

```html
<!-- 默认：Atom One Dark -->
<link rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">

<!-- 可选主题： -->
<!-- Monokai -->
<!-- Github Dark -->
<!-- Nord -->
<!-- Tokyo Night Dark -->
```

所有可用主题请查看 [highlight.js 官方 demo](https://highlightjs.org/demo)。

## 站内搜索

搜索功能已内置，使用方式：

| 操作 | 方式 |
|------|------|
| 鼠标 | 首页搜索框输入关键词 |
| 键盘 | `Ctrl + K` 聚焦搜索框 |
| 清除 | 点击 ✕ 按钮或清空内容 |

搜索范围包括文章标题、摘要和标签。输入即筛选，无需按回车。

## 访问统计

不蒜子统计已集成，无需注册，自动生效：

- **页脚**：全站总访问量（PV）和访客数（UV）
- **文章页**：单篇文章阅读量
- 数据存储在 `busuanzi.ibruce.info`，稳定运行多年

> 注意：本地 `file://` 协议下统计数据可能异常，部署到线上服务器后即可正常工作。

## 部署上线

推荐免费部署方案：

| 平台 | 特点 |
|------|------|
| **GitHub Pages** | 免费、绑定域名、自动 HTTPS |
| **Vercel** | 免费、全球 CDN、部署极快 |
| **Netlify** | 免费、拖拽部署、表单功能 |

最简单的部署流程（GitHub Pages）：

```bash
# 1. 在 GitHub 创建仓库
# 2. 推送代码
git init
git add .
git commit -m "init blog"
git remote add origin git@github.com:你的用户名/你的仓库.git
git push -u origin main

# 3. 仓库 Settings → Pages → Source: main branch → Save
# 4. 等 1-2 分钟，访问 https://你的用户名.github.io/你的仓库/
```

## 总结

到此为止，你拥有了一个功能齐全的静态博客：

- ✅ Markdown 写作 + 构建脚本
- ✅ 代码语法高亮 + 一键复制
- ✅ Giscus 评论系统
- ✅ 站内实时搜索
- ✅ 访问统计
- ✅ 深色 / 浅色模式
- ✅ 响应式设计
- ✅ 粒子背景动效
- ✅ 免费部署

祝写作愉快！🎉
