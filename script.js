/* ==========================================
   配置：Giscus 评论系统
   使用前请按以下步骤设置：
   1. 确保你的 GitHub 仓库是公开的 (Public)
   2. 仓库 Settings → Features → 勾选 Discussions
   3. 访问 https://github.com/apps/giscus 安装 Giscus App
   4. 访问 https://giscus.app/zh-CN 填写仓库名，获取 repo_id 和 category_id
   5. 把下面的值替换成你自己的
   ========================================== */
const GISCUS_CONFIG = {
  owner: "YOUR_GITHUB_USERNAME",    // ← 改成你的 GitHub 用户名
  repo: "YOUR_REPO_NAME",           // ← 改成你的仓库名
  repoId: "YOUR_REPO_ID",           // ← 从 giscus.app 获取
  category: "Announcements",         // ← 一般用 "Announcements" 或 "General"
  categoryId: "YOUR_CATEGORY_ID",   // ← 从 giscus.app 获取
  mapping: "pathname",              // 用页面路径关联评论
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "dark",                    // 默认深色，加载时会自动切换
  lang: "zh-CN",
};

/* ==========================================
   粒子网络背景
   ========================================== */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 70;
  const CONNECT_DIST = 140;
  const MOUSE_RADIUS = 180;

  let mouse = { x: -1000, y: -1000 };
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function getColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      particle: isLight ? 'rgba(0,119,238,0.55)' : 'rgba(0,229,255,0.55)',
      line: isLight ? 'rgba(0,119,238,0.12)' : 'rgba(0,229,255,0.10)',
      lineNear: isLight ? 'rgba(0,119,238,0.3)' : 'rgba(0,229,255,0.28)',
    };
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }
  createParticles();
  window.addEventListener('resize', createParticles);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colors = getColors();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      p.pulse += 0.015;
      const pulseR = p.radius + Math.sin(p.pulse) * 0.6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = colors.particle;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR + 2, 0, Math.PI * 2);
      ctx.fillStyle = colors.particle.replace('0.55', '0.12');
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const alpha = (1 - dist / MOUSE_RADIUS) * 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = colors.lineNear;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        const force = (1 - dist / MOUSE_RADIUS) * 0.03;
        p.vx += dx * force;
        p.vy += dy * force;
      }
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].vx *= 0.999;
      particles[i].vy *= 0.999;
      const speed = Math.sqrt(particles[i].vx ** 2 + particles[i].vy ** 2);
      if (speed > 1.2) {
        particles[i].vx *= 0.98;
        particles[i].vy *= 0.98;
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================
   配置 marked.js + highlight.js
   ========================================== */
function initMarked() {
  if (typeof marked === 'undefined') return;

  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // 配置 highlight.js 作为代码高亮引擎
  if (typeof hljs !== 'undefined') {
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (e) { /* fall through */ }
        }
        // 自动检测语言
        try {
          return hljs.highlightAuto(code).value;
        } catch (e) {
          return escapeHtml(code);
        }
      },
    });
  }

  // 重写 renderer 以包装代码块（添加复制按钮）
  const renderer = new marked.Renderer();
  const originalCode = renderer.code.bind(renderer);

  renderer.code = function (code, language) {
    const langClass = language ? ` language-${language}` : '';
    const langLabel = language || 'code';

    // 先高亮
    let highlighted;
    if (typeof hljs !== 'undefined') {
      if (language && hljs.getLanguage(language)) {
        try {
          highlighted = hljs.highlight(code, { language }).value;
        } catch (e) {
          highlighted = escapeHtml(code);
        }
      } else {
        try {
          highlighted = hljs.highlightAuto(code).value;
        } catch (e) {
          highlighted = escapeHtml(code);
        }
      }
    } else {
      highlighted = escapeHtml(code);
    }

    return `<div class="code-block-wrapper">` +
      `<button class="copy-btn" onclick="copyCode(this)" title="复制代码">[ copy ]</button>` +
      `<pre class="hljs${langClass}"><code class="hljs${langClass}">${highlighted}</code></pre>` +
      `</div>`;
  };

  marked.use({ renderer });
}

/* ==========================================
   复制代码功能
   ========================================== */
function copyCode(btn) {
  const code = btn.nextElementSibling.querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '[ copied! ]';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '[ copy ]';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    btn.textContent = '[ copied! ]';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '[ copy ]';
      btn.classList.remove('copied');
    }, 2000);
  });
}

/* ==========================================
   工具函数
   ========================================== */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, c => map[c]);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('zh-CN', opts);
}

function estimateReadTime(content) {
  const text = content.replace(/[#*`\[\]()>!\-\n\r|]/g, '');
  const chars = text.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(chars / 400));
}

function mdToHtml(md) {
  if (typeof marked !== 'undefined') {
    return marked.parse(md);
  }
  // fallback: basic Markdown → HTML
  return md
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');
}

/* ==========================================
   博客文章数据（Markdown 格式）
   ========================================== */
const posts = [
  {
    id: "hello-world",
    title: "你好，世界！这是我的第一篇博客",
    date: "2026-07-20",
    tags: ["生活", "随笔"],
    excerpt: "欢迎来到我的个人博客！这是我在互联网上的一片小天地，记录生活、技术和思考。",
    content: `你好！欢迎来到我的个人博客 👋

搭建一个属于自己的博客是我一直以来的小目标。在这个信息爆炸的时代，拥有一个安静、属于自己的表达空间，是一件很珍贵的事情。

## 为什么写博客？

写作是最好的思考方式。当你把想法写下来的时候，你会发现自己真正理解了多少，又有多少还需要深入学习。

这个博客会记录：

- 日常的技术学习心得
- 读过的好书和感悟
- 生活中的有趣发现
- 对世界的观察与思考

## 关于这个网站

这个博客是用纯 HTML、CSS 和 JavaScript 构建的。没有使用任何框架，简洁轻量，加载速度飞快。支持深色模式和浅色模式切换，在移动端也能获得良好的阅读体验。

> "种一棵树最好的时间是十年前，其次是现在。" —— 非洲谚语

希望我能坚持写下去。也欢迎你常来看看！`
  },
  {
    id: "javascript-tips",
    title: "10 个实用的 JavaScript 小技巧",
    date: "2026-07-25",
    tags: ["技术", "JavaScript"],
    excerpt: "分享一些在日常开发中非常实用的 JavaScript 技巧，让你的代码更简洁优雅。",
    content: `JavaScript 是一门充满惊喜的语言。这里整理了一些我在日常开发中经常用到的小技巧，希望能帮到你。

## 1. 解构赋值简化代码

解构赋值可以让你从对象或数组中提取值，赋值给变量。这在处理函数参数时特别有用：

\`\`\`javascript
const user = { name: '小明', age: 25, city: '北京' };
const { name, age } = user;
console.log(name); // 小明
\`\`\`

## 2. 可选链操作符 ( ?. )

访问深层嵌套的对象属性时，不用再写一堆 \`&&\` 判断了：

\`\`\`javascript
const city = user?.address?.city ?? '未知';
// 等价于 user && user.address && user.address.city || '未知'
\`\`\`

## 3. 模板字符串

使用反引号可以轻松拼接字符串和多行文本，嵌入变量也非常方便。

\`\`\`javascript
const name = '小明';
console.log(\`你好，\${name}！欢迎回来。\`);
\`\`\`

## 4. 数组方法：map / filter / reduce

这三个方法是函数式编程的核心，熟练掌握后可以大大减少代码量。

\`\`\`javascript
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);   // [2, 4, 6, 8, 10]
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
const sum = nums.reduce((a, b) => a + b, 0); // 15
\`\`\`

## 5. 展开运算符

\`...\` 运算符可以轻松合并数组和对象，或者在函数调用中展开参数。

\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2]; // [1,2,3,4,5,6]

const defaults = { theme: 'dark', lang: 'zh' };
const userSettings = { lang: 'en' };
const config = { ...defaults, ...userSettings }; // { theme:'dark', lang:'en' }
\`\`\`

## 6. 空值合并运算符 ( ?? )

和 \`||\` 不同，\`??\` 只在左侧为 \`null\` 或 \`undefined\` 时才取右侧的值，\`0\` 和空字符串不会被误判。

\`\`\`javascript
const count = 0;
console.log(count || 10);  // 10  (可能不是你想要的)
console.log(count ?? 10);  // 0   (这才是对的)
\`\`\`

## 7. Promise.all 并行请求

当需要同时发起多个请求时，用 \`Promise.all\` 可以显著提升性能。

\`\`\`javascript
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json()),
]);
\`\`\`

## 8. 对象简写

当属性名和变量名相同时，可以直接简写。

\`\`\`javascript
const name = '小明';
const age = 25;
const user = { name, age }; // 而不是 { name: name, age: age }
\`\`\`

## 9. 动态属性名

可以用方括号在对象字面量中使用变量作为属性名。

\`\`\`javascript
const key = 'favoriteColor';
const user = {
  name: '小明',
  [key]: 'blue', // 动态属性名
};
\`\`\`

## 10. console.table

在调试数组或对象数据时，\`console.table()\` 比 \`console.log()\` 更直观。

\`\`\`javascript
const users = [
  { name: '小明', age: 25, city: '北京' },
  { name: '小红', age: 23, city: '上海' },
];
console.table(users);
// 以表格形式打印，一目了然
\`\`\`

---

这些技巧虽然基础，但每天都会用到。熟能生巧，共勉！`
  },
  {
    id: "building-blog",
    title: "我是如何搭建这个博客的",
    date: "2026-07-30",
    tags: ["技术", "Web", "教程"],
    excerpt: "从零开始构建一个轻量级个人博客的全过程，包含设计思路和技术选型。",
    content: `这个博客从构思到完成只花了一个下午的时间。下面分享一下整个过程。

## 技术选型

我选择了一个极简的技术栈：

- **纯 HTML**：结构清晰，语义化标签
- **CSS 自定义属性**：实现深色/浅色主题切换
- **原生 JavaScript**：实现前端路由和页面渲染
- **marked.js**：Markdown 渲染引擎
- **highlight.js**：代码语法高亮

没有 Webpack、没有 React、没有数据库。所有文章以 JavaScript 对象的形式存储，页面通过 hash 路由切换。

## 设计原则

1. **内容优先**：排版清晰，阅读体验好
2. **响应式**：在手机和电脑上都有好的表现
3. **可访问性**：语义化 HTML，支持键盘导航
4. **性能**：零框架依赖，首屏加载极快

## 主题切换

使用 CSS 自定义属性（CSS Variables）实现主题切换。定义两套颜色变量，通过切换 \`data-theme\` 属性在深浅色之间切换。用户的选择会保存在 \`localStorage\` 中，下次访问自动应用。

\`\`\`css
:root {
  --bg: #050510;
  --accent: #00e5ff;
}

[data-theme="light"] {
  --bg: #f0f4f8;
  --accent: #0077ee;
}
\`\`\`

## 路由设计

使用 hash 路由（\`#/path\`），监听 \`hashchange\` 事件来切换页面内容。这种方式兼容性好，不需要服务器配置。

\`\`\`javascript
function router() {
  const route = window.location.hash.slice(1) || '/';
  const postMatch = route.match(/^\\/post\\/(.+)$/);
  // 根据路由渲染不同页面
}
\`\`\`

## 插件集成

这个博客还集成了几个实用的功能：

| 功能 | 方案 | 说明 |
|------|------|------|
| 评论 | Giscus | 基于 GitHub Discussions，免费无后端 |
| 搜索 | 原生 JS | 实时筛选标题和标签 |
| 统计 | 不蒜子 | 轻量访问计数 |

> 简单就是美。少即是多。

如果你也想搭建自己的博客，希望这篇文章能给你一些启发。`
  },
  {
    id: "reading-notes-2026",
    title: "2026 上半年读书笔记",
    date: "2026-08-01",
    tags: ["阅读", "生活"],
    excerpt: "回顾上半年读过的几本好书，记录一些思考和收获。",
    content: `2026年上半年读了不少书，挑几本印象深刻的记录一下。

## 《原子习惯》

这本书讲的是微小习惯如何带来巨大改变。核心观点是：**不要追求目标，而要建立系统**。每天进步 1%，一年后你会是现在的 37 倍。

最有启发的概念是「习惯叠加」——在已有的习惯后面叠加新习惯，让新习惯更容易坚持。

> 你不应该专注于目标，而应该专注于系统。目标关乎你想要达到的结果，系统关乎你通往结果的日常过程。

## 《思考，快与慢》

诺贝尔经济学奖得主丹尼尔·卡尼曼的经典之作。书中区分了两种思维模式：

- **系统 1**：快速、直觉、自动
- **系统 2**：慢速、理性、需要努力

理解这两种模式如何影响我们的决策，对于提高判断力非常有帮助。

## 《重构》

Martin Fowler 的经典技术书。虽然是写给程序员的，但其中的很多思想——比如**小步前进**、**持续改进**——适用于任何领域。

\`\`\`javascript
// 重构前
function getPrice(quantity, itemPrice) {
  return quantity * itemPrice -
    Math.max(0, quantity - 500) * itemPrice * 0.05 +
    Math.min(quantity * itemPrice * 0.1, 100);
}

// 重构后
function getPrice(quantity, itemPrice) {
  const basePrice = quantity * itemPrice;
  const discount = getDiscount(quantity, itemPrice);
  const shipping = Math.min(basePrice * 0.1, 100);
  return basePrice - discount + shipping;
}
\`\`\`

好的代码是写给人看的。

## 《人类简史》

尤瓦尔·赫拉利从认知革命讲到科学革命，用宏大的视角审视人类历史。读完之后会对「我们是谁、我们从哪里来」有新的理解。

---

读书是性价比最高的投资。下半年继续加油 📚`
  }
];

/* ==========================================
   主题管理
   ========================================== */
function initTheme() {
  const saved = localStorage.getItem('blog-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
  updateThemeIcon();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? null : 'light';
  if (next) {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('blog-theme', next);
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('blog-theme');
  }
  updateThemeIcon();
  // 刷新 Giscus 主题
  updateGiscusTheme();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggle');
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  btn.textContent = isLight ? '☀️' : '🌙';
}

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/* ==========================================
   Giscus 评论系统
   ========================================== */
function loadGiscus() {
  // 检查是否已配置
  if (GISCUS_CONFIG.owner === 'YOUR_GITHUB_USERNAME') {
    const container = document.getElementById('giscusContainer');
    if (container) {
      container.innerHTML = `
        <div class="giscus">
          <div class="giscus-loading">
            <p>💬 评论系统尚未配置</p>
            <p style="font-size:0.85rem;margin-top:8px;">
              打开 <code>script.js</code> 修改 <code>GISCUS_CONFIG</code> 即可启用 Giscus 评论
            </p>
          </div>
        </div>`;
    }
    return;
  }

  // 移除旧的 Giscus
  const oldGiscus = document.querySelector('.giscus');
  if (oldGiscus) oldGiscus.innerHTML = '';

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', `${GISCUS_CONFIG.owner}/${GISCUS_CONFIG.repo}`);
  script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
  script.setAttribute('data-category', GISCUS_CONFIG.category);
  script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
  script.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
  script.setAttribute('data-strict', GISCUS_CONFIG.strict);
  script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled);
  script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata);
  script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
  script.setAttribute('data-theme', getCurrentTheme() === 'light' ? 'light' : 'dark');
  script.setAttribute('data-lang', GISCUS_CONFIG.lang);
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;

  const container = document.getElementById('giscusContainer');
  if (container) {
    container.innerHTML = '<div class="giscus"></div>';
    container.querySelector('.giscus').appendChild(script);
  }
}

function updateGiscusTheme() {
  const iframe = document.querySelector('.giscus iframe');
  if (iframe) {
    const theme = getCurrentTheme() === 'light' ? 'light' : 'dark';
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    );
  }
}

/* ==========================================
   路由
   ========================================== */
function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

function navigate(path) {
  window.location.hash = '#' + path;
}

function router() {
  const route = getRoute();
  const app = document.getElementById('app');

  // 更新导航高亮
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });

  document.getElementById('mobileMenu').classList.remove('open');

  // 匹配路由
  const postMatch = route.match(/^\/post\/(.+)$/);

  if (route === '/' || route === '') {
    renderHome(app);
  } else if (postMatch) {
    renderPost(app, postMatch[1]);
  } else if (route === '/about') {
    renderAbout(app);
  } else {
    render404(app);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================
   搜索功能
   ========================================== */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.post-card');
    const noResults = document.getElementById('noResults');
    const clearBtn = document.getElementById('searchClear');
    const postList = document.getElementById('postList');

    // 清除按钮显示/隐藏
    if (clearBtn) {
      clearBtn.classList.toggle('visible', query.length > 0);
    }

    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const excerpt = (card.dataset.excerpt || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();

      if (!query || title.includes(query) || excerpt.includes(query) || tags.includes(query)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults && postList) {
      if (visibleCount === 0 && query) {
        noResults.style.display = 'block';
        postList.style.display = 'none';
      } else {
        noResults.style.display = 'none';
        postList.style.display = '';
      }
    }
  });

  // 清除按钮
  const clearBtn = document.getElementById('searchClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  }
}

/* ==========================================
   渲染函数
   ========================================== */
function renderHome(app) {
  const postsHtml = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((post, index) => `
      <article class="post-card"
               onclick="navigate('/post/${post.id}')"
               data-title="${escapeHtml(post.title)}"
               data-excerpt="${escapeHtml(post.excerpt)}"
               data-tags="${escapeHtml(post.tags.join(' '))}"
               style="animation: fadeInUp 0.5s ${index * 0.1}s both;">
        <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
        <div class="post-meta">
          <span class="post-date">📅 ${formatDate(post.date)}</span>
          <span>·</span>
          <span>🕐 ${estimateReadTime(post.content)} min read</span>
        </div>
        <div class="post-tags">
          ${post.tags.map(t => `<span class="post-tag"># ${escapeHtml(t)}</span>`).join('')}
        </div>
        <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
        <span class="read-more">[ 阅读更多 → ]</span>
      </article>
    `).join('');

  app.innerHTML = `
    <h1 class="page-title">Latest Posts</h1>
    <p class="page-subtitle">共 ${posts.length} 篇文章 · 记录技术与生活</p>
    <div class="search-wrapper">
      <input type="text" class="search-input" id="searchInput"
             placeholder="🔍 搜索文章标题、标签...">
      <button class="search-clear" id="searchClear" title="清除">✕</button>
      <span class="search-icon">⌘K</span>
    </div>
    <div class="post-list" id="postList">${postsHtml}</div>
    <div class="no-results" id="noResults" style="display:none;">
      <div class="no-results-icon">⊘</div>
      <p>没有找到匹配的文章</p>
      <p style="font-size:0.85rem;margin-top:4px;">试试其他关键词？</p>
    </div>
  `;

  initSearch();
}

function renderPost(app, postId) {
  const post = posts.find(p => p.id === postId);

  if (!post) {
    render404(app);
    return;
  }

  const contentHtml = mdToHtml(post.content);

  app.innerHTML = `
    <a href="#/" class="back-link">← cd ..</a>
    <article>
      <header class="article-header">
        <h1 class="article-title">${escapeHtml(post.title)}</h1>
        <div class="post-meta">
          <span class="post-date">📅 ${formatDate(post.date)}</span>
          <span>·</span>
          <span>🕐 ${estimateReadTime(post.content)} min read</span>
          <span>·</span>
          <span id="postPv" style="font-size:0.84rem;"></span>
        </div>
        <div class="post-tags">
          ${post.tags.map(t => `<span class="post-tag"># ${escapeHtml(t)}</span>`).join('')}
        </div>
      </header>
      <div class="article-content">${contentHtml}</div>
    </article>
    <div style="text-align:center; margin-top: 40px;">
      <a href="#/" class="back-link">← cd .. 返回首页</a>
    </div>
    <section class="comments-section">
      <h2 class="comments-title">评论区</h2>
      <div id="giscusContainer"></div>
    </section>
  `;

  // 加载评论
  loadGiscus();

  // 文章页阅读量（不蒜子）
  if (typeof window.busuanzi !== 'undefined' || true) {
    const postPv = document.getElementById('postPv');
    if (postPv) {
      // 不蒜子文章页计数
      const pageId = post.id;
      postPv.innerHTML = '👁 <span id="busuanzi_value_page_pv">-</span> views';
    }
  }
}

function renderAbout(app) {
  app.innerHTML = `
    <h1 class="page-title">About Me</h1>
    <p class="page-subtitle">whoami</p>
    <div class="about-card">
      <div class="about-avatar">👨‍💻</div>
      <h2>你好，我是博主</h2>
      <p class="about-role">$ Full-Stack Developer / Lifelong Learner</p>
      <p>
        我是一名软件开发者，热爱编程、阅读和写作。这个博客是我记录成长、分享知识的地方。
        我相信技术可以让世界变得更美好，而写作是整理思想最好的方式。
      </p>
      <p>
        工作之余，我喜欢读书、跑步、探索新事物。最近在学习人工智能和机器学习，
        对这个领域充满好奇。
      </p>
      <p>
        如果你对我的文章有任何想法或建议，欢迎通过以下方式找到我 👇
      </p>
      <div class="social-links">
        <a href="https://github.com" target="_blank" rel="noopener" class="social-link">🐙 github</a>
        <a href="mailto:hello@example.com" class="social-link">📧 mail</a>
        <a href="#" class="social-link">🐦 twitter</a>
        <a href="#" class="social-link">💬 discord</a>
      </div>
    </div>
  `;
}

function render404(app) {
  app.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⊘</div>
      <h2>404 — Page Not Found</h2>
      <p>The requested address does not exist on this server.</p>
      <br>
      <a href="#/" class="read-more">← cd ~/home</a>
    </div>
  `;
}

/* ==========================================
   卡片入场动画
   ========================================== */
const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(fadeInUpStyle);

/* ==========================================
   事件绑定 & 初始化
   ========================================== */
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

// 键盘快捷键：Ctrl+K 聚焦搜索
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.focus();
  }
});

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMarked();
  initTheme();
  router();
});

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('blog-theme')) {
    if (e.matches) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    updateThemeIcon();
    updateGiscusTheme();
  }
});
