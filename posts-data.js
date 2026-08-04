// ⚠ 此文件由 build.js 自动生成，请勿手动编辑
// 运行 node build.js 重新生成
// 生成时间：2026-08-04T06:54:07.928Z
// 文章数量：7
// 分类数量：5

const postsData = [
  {
    "id": "how-to-configure-static-blog",
    "title": "如何配置静态博客",
    "date": "2026-08-04",
    "category": "技术",
    "tags": [
      "技术",
      "教程",
      "Web"
    ],
    "excerpt": "从零开始配置一个功能齐全的静态博客：Markdown 写作、Giscus 评论、代码高亮、站内搜索和访问统计。",
    "content": "搭建好博客只是第一步，让它变得好用还需要一些配置。这篇文章详细介绍每个功能的配置方法。\n\n## 文章写作流程\n\n所有文章放在 `articles/` 文件夹中，使用 Markdown 格式。每篇文章开头需要包含 **frontmatter** 元数据：\n\n```yaml\n---\ntitle: 文章标题\ndate: 2026-08-04\ntags: [标签1, 标签2, 标签3]\nexcerpt: 文章摘要，显示在首页卡片上。\n---\n```\n\n写完文章后，运行构建命令：\n\n```bash\nnode build.js\n```\n\n这会扫描 `articles/` 下所有 `.md` 文件，生成 `posts-data.js` 供前端加载。\n\n## 配置 Giscus 评论\n\nGiscus 是一个基于 GitHub Discussions 的评论系统，免费且数据归你自己所有。\n\n### 步骤\n\n1. 创建一个**公开的** GitHub 仓库（或使用已有的）\n2. 进入仓库 **Settings → Features**，勾选 **Discussions**\n3. 访问 [Giscus App](https://github.com/apps/giscus)，点击 Install，选择你的仓库\n4. 访问 [giscus.app](https://giscus.app/zh-CN)，填写仓库名\n5. 在「Discussion 分类」中选择 **Announcements**（或自建一个分类）\n6. 复制生成的 `data-repo-id` 和 `data-category-id`\n7. 打开 `script.js`，填入 `GISCUS_CONFIG`：\n\n```javascript\nconst GISCUS_CONFIG = {\n  owner: \"your-username\",        // GitHub 用户名\n  repo: \"your-repo-name\",        // 仓库名\n  repoId: \"R_kgDOXXXXXX\",        // 从 giscus.app 获取\n  category: \"Announcements\",\n  categoryId: \"DIC_kwDOXXXXXX\",  // 从 giscus.app 获取\n  // ... 其他保持不变\n};\n```\n\n配置完成后，每篇文章底部会自动显示评论区。\n\n## 配置代码高亮\n\n博客已集成 highlight.js，支持 190+ 种语言。要更换高亮主题，修改 `index.html` 中的 CSS 链接：\n\n```html\n<!-- 默认：Atom One Dark -->\n<link rel=\"stylesheet\"\n  href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css\">\n\n<!-- 可选主题： -->\n<!-- Monokai -->\n<!-- Github Dark -->\n<!-- Nord -->\n<!-- Tokyo Night Dark -->\n```\n\n所有可用主题请查看 [highlight.js 官方 demo](https://highlightjs.org/demo)。\n\n## 站内搜索\n\n搜索功能已内置，使用方式：\n\n| 操作 | 方式 |\n|------|------|\n| 鼠标 | 首页搜索框输入关键词 |\n| 键盘 | `Ctrl + K` 聚焦搜索框 |\n| 清除 | 点击 ✕ 按钮或清空内容 |\n\n搜索范围包括文章标题、摘要和标签。输入即筛选，无需按回车。\n\n## 访问统计\n\n不蒜子统计已集成，无需注册，自动生效：\n\n- **页脚**：全站总访问量（PV）和访客数（UV）\n- **文章页**：单篇文章阅读量\n- 数据存储在 `busuanzi.ibruce.info`，稳定运行多年\n\n> 注意：本地 `file://` 协议下统计数据可能异常，部署到线上服务器后即可正常工作。\n\n## 部署上线\n\n推荐免费部署方案：\n\n| 平台 | 特点 |\n|------|------|\n| **GitHub Pages** | 免费、绑定域名、自动 HTTPS |\n| **Vercel** | 免费、全球 CDN、部署极快 |\n| **Netlify** | 免费、拖拽部署、表单功能 |\n\n最简单的部署流程（GitHub Pages）：\n\n```bash\n# 1. 在 GitHub 创建仓库\n# 2. 推送代码\ngit init\ngit add .\ngit commit -m \"init blog\"\ngit remote add origin git@github.com:你的用户名/你的仓库.git\ngit push -u origin main\n\n# 3. 仓库 Settings → Pages → Source: main branch → Save\n# 4. 等 1-2 分钟，访问 https://你的用户名.github.io/你的仓库/\n```\n\n## 总结\n\n到此为止，你拥有了一个功能齐全的静态博客：\n\n- ✅ Markdown 写作 + 构建脚本\n- ✅ 代码语法高亮 + 一键复制\n- ✅ Giscus 评论系统\n- ✅ 站内实时搜索\n- ✅ 访问统计\n- ✅ 深色 / 浅色模式\n- ✅ 响应式设计\n- ✅ 粒子背景动效\n- ✅ 免费部署\n\n祝写作愉快！🎉"
  },
  {
    "id": "reading-notes-2026",
    "title": "2026 上半年读书笔记",
    "date": "2026-08-01",
    "category": "文学",
    "tags": [
      "阅读",
      "生活"
    ],
    "excerpt": "回顾上半年读过的几本好书，记录一些思考和收获。",
    "content": "2026年上半年读了不少书，挑几本印象深刻的记录一下。\n\n## 《原子习惯》\n\n这本书讲的是微小习惯如何带来巨大改变。核心观点是：**不要追求目标，而要建立系统**。每天进步 1%，一年后你会是现在的 37 倍。\n\n最有启发的概念是「习惯叠加」——在已有的习惯后面叠加新习惯，让新习惯更容易坚持。\n\n> 你不应该专注于目标，而应该专注于系统。目标关乎你想要达到的结果，系统关乎你通往结果的日常过程。\n\n## 《思考，快与慢》\n\n诺贝尔经济学奖得主丹尼尔·卡尼曼的经典之作。书中区分了两种思维模式：\n\n- **系统 1**：快速、直觉、自动\n- **系统 2**：慢速、理性、需要努力\n\n理解这两种模式如何影响我们的决策，对于提高判断力非常有帮助。\n\n## 《重构》\n\nMartin Fowler 的经典技术书。虽然是写给程序员的，但其中的很多思想——比如**小步前进**、**持续改进**——适用于任何领域。\n\n```javascript\n// 重构前\nfunction getPrice(quantity, itemPrice) {\n  return quantity * itemPrice -\n    Math.max(0, quantity - 500) * itemPrice * 0.05 +\n    Math.min(quantity * itemPrice * 0.1, 100);\n}\n\n// 重构后\nfunction getPrice(quantity, itemPrice) {\n  const basePrice = quantity * itemPrice;\n  const discount = getDiscount(quantity, itemPrice);\n  const shipping = Math.min(basePrice * 0.1, 100);\n  return basePrice - discount + shipping;\n}\n```\n\n好的代码是写给人看的。\n\n## 《人类简史》\n\n尤瓦尔·赫拉利从认知革命讲到科学革命，用宏大的视角审视人类历史。读完之后会对「我们是谁、我们从哪里来」有新的理解。\n\n---\n\n读书是性价比最高的投资。下半年继续加油 📚"
  },
  {
    "id": "building-blog",
    "title": "我是如何搭建这个博客的",
    "date": "2026-07-30",
    "category": "技术",
    "tags": [
      "技术",
      "Web",
      "教程"
    ],
    "excerpt": "从零开始构建一个轻量级个人博客的全过程，包含设计思路和技术选型。",
    "content": "这个博客从构思到完成只花了一个下午的时间。下面分享一下整个过程。\n\n## 技术选型\n\n我选择了一个极简的技术栈：\n\n- **纯 HTML**：结构清晰，语义化标签\n- **CSS 自定义属性**：实现深色/浅色主题切换\n- **原生 JavaScript**：实现前端路由和页面渲染\n- **marked.js**：Markdown 渲染引擎\n- **highlight.js**：代码语法高亮\n\n没有 Webpack、没有 React、没有数据库。所有文章以 Markdown 文件存储在 `articles/` 文件夹中，通过构建脚本生成文章索引，页面通过 hash 路由切换。\n\n## 设计原则\n\n1. **内容优先**：排版清晰，阅读体验好\n2. **响应式**：在手机和电脑上都有好的表现\n3. **可访问性**：语义化 HTML，支持键盘导航\n4. **性能**：零框架依赖，首屏加载极快\n\n## 主题切换\n\n使用 CSS 自定义属性（CSS Variables）实现主题切换。定义两套颜色变量，通过切换 `data-theme` 属性在深浅色之间切换。用户的选择会保存在 `localStorage` 中，下次访问自动应用。\n\n```css\n:root {\n  --bg: #050510;\n  --accent: #00e5ff;\n}\n\n[data-theme=\"light\"] {\n  --bg: #f0f4f8;\n  --accent: #0077ee;\n}\n```\n\n## 路由设计\n\n使用 hash 路由（`#/path`），监听 `hashchange` 事件来切换页面内容。这种方式兼容性好，不需要服务器配置。\n\n```javascript\nfunction router() {\n  const route = window.location.hash.slice(1) || '/';\n  const postMatch = route.match(/^\\/post\\/(.+)$/);\n  // 根据路由渲染不同页面\n}\n```\n\n## 插件集成\n\n这个博客还集成了几个实用的功能：\n\n| 功能 | 方案 | 说明 |\n|------|------|------|\n| 评论 | Giscus | 基于 GitHub Discussions，免费无后端 |\n| 搜索 | 原生 JS | 实时筛选标题和标签 |\n| 统计 | 不蒜子 | 轻量访问计数 |\n| 高亮 | highlight.js | 190+ 语言语法着色 |\n\n> 简单就是美。少即是多。\n\n如果你也想搭建自己的博客，希望这篇文章能给你一些启发。"
  },
  {
    "id": "javascript-tips",
    "title": "10 个实用的 JavaScript 小技巧",
    "date": "2026-07-25",
    "category": "技术",
    "tags": [
      "技术",
      "JavaScript"
    ],
    "excerpt": "分享一些在日常开发中非常实用的 JavaScript 技巧，让你的代码更简洁优雅。",
    "content": "JavaScript 是一门充满惊喜的语言。这里整理了一些我在日常开发中经常用到的小技巧，希望能帮到你。\n\n## 1. 解构赋值简化代码\n\n解构赋值可以让你从对象或数组中提取值，赋值给变量。这在处理函数参数时特别有用：\n\n```javascript\nconst user = { name: '小明', age: 25, city: '北京' };\nconst { name, age } = user;\nconsole.log(name); // 小明\n```\n\n## 2. 可选链操作符 ( ?. )\n\n访问深层嵌套的对象属性时，不用再写一堆 `&&` 判断了：\n\n```javascript\nconst city = user?.address?.city ?? '未知';\n// 等价于 user && user.address && user.address.city || '未知'\n```\n\n## 3. 模板字符串\n\n使用反引号可以轻松拼接字符串和多行文本，嵌入变量也非常方便。\n\n```javascript\nconst name = '小明';\nconsole.log(`你好，${name}！欢迎回来。`);\n```\n\n## 4. 数组方法：map / filter / reduce\n\n这三个方法是函数式编程的核心，熟练掌握后可以大大减少代码量。\n\n```javascript\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);        // [2, 4, 6, 8, 10]\nconst evens = nums.filter(n => n % 2 === 0); // [2, 4]\nconst sum = nums.reduce((a, b) => a + b, 0); // 15\n```\n\n## 5. 展开运算符\n\n`...` 运算符可以轻松合并数组和对象，或者在函数调用中展开参数。\n\n```javascript\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst merged = [...arr1, ...arr2]; // [1,2,3,4,5,6]\n\nconst defaults = { theme: 'dark', lang: 'zh' };\nconst userSettings = { lang: 'en' };\nconst config = { ...defaults, ...userSettings }; // { theme:'dark', lang:'en' }\n```\n\n## 6. 空值合并运算符 ( ?? )\n\n和 `||` 不同，`??` 只在左侧为 `null` 或 `undefined` 时才取右侧的值，`0` 和空字符串不会被误判。\n\n```javascript\nconst count = 0;\nconsole.log(count || 10);  // 10  (可能不是你想要的)\nconsole.log(count ?? 10);  // 0   (这才是对的)\n```\n\n## 7. Promise.all 并行请求\n\n当需要同时发起多个请求时，用 `Promise.all` 可以显著提升性能。\n\n```javascript\nconst [users, posts, comments] = await Promise.all([\n  fetch('/api/users').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json()),\n  fetch('/api/comments').then(r => r.json()),\n]);\n```\n\n## 8. 对象简写\n\n当属性名和变量名相同时，可以直接简写。\n\n```javascript\nconst name = '小明';\nconst age = 25;\nconst user = { name, age }; // 而不是 { name: name, age: age }\n```\n\n## 9. 动态属性名\n\n可以用方括号在对象字面量中使用变量作为属性名。\n\n```javascript\nconst key = 'favoriteColor';\nconst user = {\n  name: '小明',\n  [key]: 'blue', // 动态属性名\n};\n```\n\n## 10. console.table\n\n在调试数组或对象数据时，`console.table()` 比 `console.log()` 更直观。\n\n```javascript\nconst users = [\n  { name: '小明', age: 25, city: '北京' },\n  { name: '小红', age: 23, city: '上海' },\n];\nconsole.table(users);\n// 以表格形式打印，一目了然\n```\n\n---\n\n这些技巧虽然基础，但每天都会用到。熟能生巧，共勉！"
  },
  {
    "id": "hello-world",
    "title": "你好，世界！这是我的第一篇博客",
    "date": "2026-07-20",
    "category": "随笔",
    "tags": [
      "生活",
      "随笔"
    ],
    "excerpt": "欢迎来到我的个人博客！这是我在互联网上的一片小天地，记录生活、技术和思考。",
    "content": "你好！欢迎来到我的个人博客 👋\n\n搭建一个属于自己的博客是我一直以来的小目标。在这个信息爆炸的时代，拥有一个安静、属于自己的表达空间，是一件很珍贵的事情。\n\n## 为什么写博客？\n\n写作是最好的思考方式。当你把想法写下来的时候，你会发现自己真正理解了多少，又有多少还需要深入学习。\n\n这个博客会记录：\n\n- 日常的技术学习心得\n- 读过的好书和感悟\n- 生活中的有趣发现\n- 对世界的观察与思考\n\n## 关于这个网站\n\n这个博客是用纯 HTML、CSS 和 JavaScript 构建的。没有使用任何框架，简洁轻量，加载速度飞快。支持深色模式和浅色模式切换，在移动端也能获得良好的阅读体验。\n\n> \"种一棵树最好的时间是十年前，其次是现在。\" —— 非洲谚语\n\n希望我能坚持写下去。也欢迎你常来看看！"
  },
  {
    "id": "sample-movie-review",
    "title": "示例：一部电影的观后感",
    "date": "2026-07-15",
    "category": "电影",
    "tags": [
      "电影",
      "随笔"
    ],
    "excerpt": "这是一篇示例影评文章，放在 articles_movies/ 目录下即可自动归类到「电影」分区。",
    "content": "## 关于这篇文章\n\n这是一篇示例文章，展示电影分类的用法。\n\n在 `articles_movies/` 目录下新建 `.md` 文件，运行 `node build.js`，文章就会自动出现在博客的「电影」分区中。\n\n## 文章格式\n\n和原来完全一样，只需在文件头写好 frontmatter：\n\n```yaml\n---\ntitle: 你的文章标题\ndate: 2026-08-04\ntags: [电影, 科幻]\nexcerpt: 简短摘要\n---\n```\n\n标签可以自由添加，分类由**所在目录**自动决定。\n\n## 开始写作吧\n\n删除这篇示例，放入你自己的影评文章即可。"
  },
  {
    "id": "sample-novel-chapter",
    "title": "示例：小说第一章",
    "date": "2026-06-20",
    "category": "小说",
    "tags": [
      "小说",
      "创作"
    ],
    "excerpt": "这是一篇示例小说章节，放在 articles_novels/ 目录下即可自动归类到「小说」分区。",
    "content": "## 关于这个分区\n\n在 `articles_novels/` 目录下新建 `.md` 文件，运行 `node build.js`，文章就会自动出现在博客的「小说」分区中。\n\n## 写作格式\n\n完全兼容标准 Markdown，支持：\n\n- **加粗**、*斜体*、`行内代码`\n- 引用块\n- 代码高亮\n- 表格\n\n> 写作是孤独的，但文字可以穿越时空。\n\n## 开始创作\n\n删除这篇示例，开始你的小说创作之旅。"
  }
];
