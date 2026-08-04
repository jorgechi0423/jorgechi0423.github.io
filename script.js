/*
 * 博客脚本 — 安静文艺极简风格
 *
 * 功能模块：
 *   1. 主题管理（深色/浅色切换，localStorage 持久化）
 *   2. 路由（hash-based SPA，含首页/归档/标签/关于/文章详情/404）
 *   3. 搜索（实时筛选文章标题、摘要、标签）
 *   4. 侧边悬浮目录 TOC（IntersectionObserver 跟踪当前章节）
 *   5. 骨架屏（首次加载避免空白闪烁）
 *   6. Giscus 评论系统（GitHub Discussions 集成）
 *   7. 代码高亮 + 复制按钮
 *
 * 数据来源：posts-data.js（由 node build.js 扫描 articles_xx/ 分类目录生成）
 *
 * 分类系统：
 *   文章按目录自动归类：articles_tech(技术) / articles_literature(文学) /
 *   articles_movies(电影) / articles_essays(随笔) / articles_novels(小说)
 *   首页可通过分类筛选栏快速切换浏览
 */

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
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "dark",
  lang: "zh-CN",
};

/* ==========================================
   文章数据 — 由 build.js 扫描 articles/ 生成 posts-data.js
   在 articles/ 下新建 .md → node build.js → 自动更新索引
   ========================================== */
const posts = (typeof postsData !== 'undefined') ? postsData : [];

/* ==========================================
   全局状态
   ========================================== */
let tocObserver = null; // IntersectionObserver for TOC scroll tracking

/* ==========================================
   配置 marked.js + highlight.js
   ========================================== */
function initMarked() {
  if (typeof marked === 'undefined') return;

  marked.setOptions({ gfm: true, breaks: true });

  if (typeof hljs !== 'undefined') {
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try { return hljs.highlight(code, { language: lang }).value; } catch (e) {}
        }
        try { return hljs.highlightAuto(code).value; } catch (e) {
          return escapeHtml(code);
        }
      },
    });
  }

  // 自定义 renderer：为代码块包裹容器 + 复制按钮
  const renderer = new marked.Renderer();
  renderer.code = function (code, language) {
    const langClass = language ? ` language-${language}` : '';
    let highlighted;
    if (typeof hljs !== 'undefined') {
      if (language && hljs.getLanguage(language)) {
        try { highlighted = hljs.highlight(code, { language }).value; } catch (e) { highlighted = escapeHtml(code); }
      } else {
        try { highlighted = hljs.highlightAuto(code).value; } catch (e) { highlighted = escapeHtml(code); }
      }
    } else {
      highlighted = escapeHtml(code);
    }
    return `<div class="code-block-wrapper">` +
      `<button class="copy-btn" onclick="copyCode(this)" title="复制代码">复制</button>` +
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
    btn.textContent = '已复制';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    btn.textContent = '已复制';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
  });
}

/* ==========================================
   工具函数
   ========================================== */
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, c => map[c]);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function estimateReadTime(content) {
  const text = content.replace(/[#*`\[\]()>!\-\n\r|]/g, '');
  const chars = text.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(chars / 400));
}

/* —— 从文章数据中提取所有分类（去重，按文章数量降序） —— */
function getCategories() {
  const countMap = {};
  posts.forEach(p => {
    const cat = p.category || '未分类';
    countMap[cat] = (countMap[cat] || 0) + 1;
  });
  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function mdToHtml(md) {
  if (typeof marked !== 'undefined') {
    return marked.parse(md);
  }
  // 降级方案：基础 Markdown → HTML
  return md
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');
}

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
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: getCurrentTheme() === 'light' ? 'light' : 'dark' } } },
      'https://giscus.app'
    );
  }
}

/* ==========================================
   骨架屏 — 首次加载占位，避免页面空白闪烁
   ========================================== */
function showSkeleton() {
  const root = document.getElementById('skeletonRoot');
  if (!root) return;
  root.innerHTML = `
    <div>
      <div class="skeleton-block title" style="height:1.8rem;width:45%;margin-bottom:8px;"></div>
      <div class="skeleton-block meta" style="height:0.9rem;width:30%;margin-bottom:28px;"></div>
    </div>
    ${[1, 2, 3].map(() => `
      <div class="skeleton-card">
        <div class="skeleton-block title" style="height:1.3rem;width:55%;margin-bottom:10px;"></div>
        <div class="skeleton-block meta" style="height:0.85rem;width:35%;margin-bottom:10px;"></div>
        <div class="skeleton-block excerpt" style="height:0.9rem;width:100%;margin-bottom:8px;"></div>
        <div class="skeleton-block excerpt" style="height:0.9rem;width:70%;margin-bottom:0;"></div>
      </div>
    `).join('')}
  `;
}

function hideSkeleton() {
  const root = document.getElementById('skeletonRoot');
  if (root) root.innerHTML = '';
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
  hideSkeleton();

  // 高亮当前导航链接
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkRoute = link.dataset.route;
    // 对 /post/ 路径特殊处理：不高亮任何导航项
    if (route.startsWith('/post/')) {
      link.classList.remove('active');
    } else {
      link.classList.toggle('active', linkRoute === route);
    }
  });

  // 关闭移动端菜单
  document.getElementById('mobileMenu').classList.remove('open');

  // 销毁旧的 TOC observer
  destroyToc();

  const postMatch = route.match(/^\/post\/(.+)$/);

  if (route === '/' || route === '') {
    renderHome(app);
  } else if (route === '/archive') {
    renderArchive(app);
  } else if (route === '/tags') {
    renderTags(app);
  } else if (route === '/about') {
    renderAbout(app);
  } else if (postMatch) {
    renderPost(app, postMatch[1]);
  } else {
    render404(app);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================
   分类筛选栏 — 点击切换分类，联动搜索框
   ========================================== */
function initCategoryFilter() {
  const filterItems = document.querySelectorAll('.category-filter-item');
  if (filterItems.length === 0) return;

  // 获取当前搜索框的值（如果有的话）
  const searchInput = document.getElementById('searchInput');

  filterItems.forEach(item => {
    item.addEventListener('click', function () {
      const category = this.dataset.category;

      // 更新高亮状态
      filterItems.forEach(el => el.classList.remove('active'));
      this.classList.add('active');

      // 清除搜索框内容（分类筛选与文本搜索互斥）
      if (searchInput) {
        searchInput.value = '';
        // 触发 clear 按钮隐藏
        const clearBtn = document.getElementById('searchClear');
        if (clearBtn) clearBtn.classList.remove('visible');
      }

      // 筛选文章卡片
      applyFilters(category, searchInput ? searchInput.value : '');
    });
  });
}

/* —— 统一筛选逻辑：分类 + 文本搜索的组合过滤 —— */
function applyFilters(category, query) {
  const cards = document.querySelectorAll('.post-card');
  const noResults = document.getElementById('noResults');
  const postList = document.getElementById('postList');
  const q = (query || '').trim().toLowerCase();

  let visibleCount = 0;
  cards.forEach(card => {
    const cardCat = (card.dataset.category || '').toLowerCase();
    const title = (card.dataset.title || '').toLowerCase();
    const excerpt = (card.dataset.excerpt || '').toLowerCase();
    const tags = (card.dataset.tags || '').toLowerCase();

    const matchCategory = !category || cardCat === category.toLowerCase();
    const matchText = !q || title.includes(q) || excerpt.includes(q) || tags.includes(q) || cardCat.includes(q);

    if (matchCategory && matchText) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (noResults && postList) {
    if (visibleCount === 0) {
      noResults.style.display = 'block';
      postList.style.display = 'none';
    } else {
      noResults.style.display = 'none';
      postList.style.display = '';
    }
  }
}
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    const clearBtn = document.getElementById('searchClear');
    if (clearBtn) clearBtn.classList.toggle('visible', query.length > 0);

    // 用户输入搜索文字时，自动切换到「全部」分类以展示完整结果
    if (query.length > 0) {
      const filterItems = document.querySelectorAll('.category-filter-item');
      filterItems.forEach(el => el.classList.remove('active'));
      const allBtn = document.querySelector('.category-filter-item[data-category=""]');
      if (allBtn) allBtn.classList.add('active');
    }

    // 获取当前激活的分类筛选
    const activeFilter = document.querySelector('.category-filter-item.active');
    const category = (activeFilter && activeFilter.dataset.category) ? activeFilter.dataset.category : '';

    applyFilters(category, query);
  });

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
   文章侧边悬浮目录 TOC
   使用 IntersectionObserver 跟踪文章内 h2/h3 标题，
   当前阅读位置的标题自动高亮。
   ========================================== */
function buildToc() {
  const headings = document.querySelectorAll('.article-content h2, .article-content h3');
  const tocList = document.getElementById('tocList');
  const tocContainer = document.getElementById('tocContainer');

  if (!tocList || !tocContainer) return;
  tocList.innerHTML = '';

  // 如果没有标题或标题太少（少于2个），隐藏 TOC
  if (headings.length < 2) {
    tocContainer.classList.remove('visible');
    return;
  }

  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;

    const li = document.createElement('li');
    li.className = `toc-item ${heading.tagName === 'H3' ? 'toc-h3' : ''}`;
    li.textContent = heading.textContent;
    li.dataset.target = id;
    li.addEventListener('click', () => {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tocList.appendChild(li);
  });

  tocContainer.classList.add('visible');

  // 使用 IntersectionObserver 跟踪当前阅读位置
  const tocItems = tocList.querySelectorAll('.toc-item');

  tocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocItems.forEach(item => {
            item.classList.toggle('active', item.dataset.target === id);
          });
        }
      });
    },
    {
      rootMargin: '-80px 0px -60% 0px', // 顶部偏移 header，底部触发线在上方
      threshold: 0,
    }
  );

  headings.forEach(h => tocObserver.observe(h));
}

function destroyToc() {
  if (tocObserver) {
    tocObserver.disconnect();
    tocObserver = null;
  }
  const tocContainer = document.getElementById('tocContainer');
  const tocList = document.getElementById('tocList');
  if (tocContainer) tocContainer.classList.remove('visible');
  if (tocList) tocList.innerHTML = '';
}

/* ==========================================
   渲染函数
   ========================================== */

/* —— 首页：文章列表 + 搜索 + 分类筛选栏 —— */
function renderHome(app) {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const categories = getCategories();

  // 分类筛选栏 HTML
  const filterBarHtml = categories.length > 1 ? `
    <div class="category-filter" id="categoryFilter">
      <span class="category-filter-item active" data-category="">全部<span class="category-count">${posts.length}</span></span>
      ${categories.map(c => `
        <span class="category-filter-item" data-category="${escapeHtml(c.name)}">
          ${escapeHtml(c.name)}<span class="category-count">${c.count}</span>
        </span>
      `).join('')}
    </div>
  ` : '';

  // 文章卡片列表
  const postsHtml = sortedPosts
    .map((post) => `
      <article class="post-card"
               onclick="navigate('/post/${post.id}')"
               data-category="${escapeHtml(post.category || '未分类')}"
               data-title="${escapeHtml(post.title)}"
               data-excerpt="${escapeHtml(post.excerpt)}"
               data-tags="${escapeHtml((post.tags || []).join(' '))}">
        <div class="post-card-header">
          <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
          ${post.category ? `<span class="category-badge" data-cat="${escapeHtml(post.category)}">${escapeHtml(post.category)}</span>` : ''}
        </div>
        <div class="post-meta">
          <span class="post-date">📅 ${formatDate(post.date)}</span>
          <span>·</span>
          <span>🕐 ${estimateReadTime(post.content)} min read</span>
        </div>
        <div class="post-tags">
          ${(post.tags || []).map(t => `<span class="post-tag"># ${escapeHtml(t)}</span>`).join('')}
        </div>
        <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
        <span class="read-more">阅读更多 →</span>
      </article>
    `).join('');

  app.innerHTML = `
    <h1 class="page-title">文章</h1>
    <p class="page-subtitle">共 ${posts.length} 篇文章</p>
    ${filterBarHtml}
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input type="text" class="search-input" id="searchInput"
             placeholder="搜索文章标题、标签...">
      <button class="search-clear" id="searchClear" title="清除">✕</button>
    </div>
    <div class="post-list" id="postList">${postsHtml || '<p style="text-align:center;color:var(--text-muted);">还没有文章，在对应分类目录下新建 .md 文件吧 ✍️</p>'}</div>
    <div class="no-results" id="noResults" style="display:none;">
      <div class="no-results-icon">⊘</div>
      <p>没有找到匹配的文章</p>
      <p style="font-size:0.85rem;margin-top:4px;">试试其他分类或关键词？</p>
    </div>
  `;

  initSearch();
  initCategoryFilter();
}

/* —— 归档页：按年份分组展示所有文章 —— */
function renderArchive(app) {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedPosts.length === 0) {
    app.innerHTML = `
      <h1 class="page-title">归档</h1>
      <p class="page-subtitle">时间线</p>
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>还没有文章</p>
      </div>`;
    return;
  }

  // 按年份分组
  const grouped = {};
  sortedPosts.forEach(post => {
    const year = new Date(post.date).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });

  const years = Object.keys(grouped).sort((a, b) => b - a);

  const archiveHtml = years.map(year => `
    <div class="archive-year">${year}</div>
    ${grouped[year].map(post => `
      <div class="archive-item" onclick="navigate('/post/${post.id}')">
        <span class="archive-item-date">${formatDateShort(post.date)}</span>
        <span class="archive-item-title">${escapeHtml(post.title)}</span>
        <span class="archive-item-tags">
          ${(post.tags || []).map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')}
        </span>
      </div>
    `).join('')}
  `).join('');

  app.innerHTML = `
    <h1 class="page-title">归档</h1>
    <p class="page-subtitle">共 ${sortedPosts.length} 篇文章 · 按时间排列</p>
    ${archiveHtml}
  `;
}

/* —— 标签页：按标签分类浏览文章 —— */
function renderTags(app) {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedPosts.length === 0) {
    app.innerHTML = `
      <h1 class="page-title">标签</h1>
      <p class="page-subtitle">分类浏览</p>
      <div class="empty-state">
        <div class="empty-icon">🏷️</div>
        <p>还没有文章</p>
      </div>`;
    return;
  }

  // 收集所有标签及其文章
  const tagMap = {};
  sortedPosts.forEach(post => {
    (post.tags || []).forEach(tag => {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push(post);
    });
  });

  const tagNames = Object.keys(tagMap).sort((a, b) => tagMap[b].length - tagMap[a].length);

  // 生成标签云
  const tagsCloudHtml = tagNames.map(tag => `
    <span class="tag-cloud-item" data-tag="${escapeHtml(tag)}" onclick="scrollToTag('${escapeHtml(tag)}')">
      ${escapeHtml(tag)} (${tagMap[tag].length})
    </span>
  `).join('');

  // 每个标签下的文章列表
  const sectionsHtml = tagNames.map(tag => `
    <div class="tag-section" id="tag-${escapeHtml(tag)}">
      <div class="tag-section-header"># ${escapeHtml(tag)}</div>
      ${tagMap[tag].map(post => `
        <article class="post-card" onclick="navigate('/post/${post.id}')"
                 data-title="${escapeHtml(post.title)}"
                 data-excerpt="${escapeHtml(post.excerpt)}"
                 data-tags="${escapeHtml((post.tags || []).join(' '))}">
          <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
          <div class="post-meta">
            <span class="post-date">📅 ${formatDate(post.date)}</span>
            <span>·</span>
            <span>🕐 ${estimateReadTime(post.content)} min read</span>
          </div>
          <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
        </article>
      `).join('')}
    </div>
  `).join('');

  app.innerHTML = `
    <h1 class="page-title">标签</h1>
    <p class="page-subtitle">${tagNames.length} 个标签 · ${sortedPosts.length} 篇文章</p>
    <div class="tags-cloud">${tagsCloudHtml}</div>
    ${sectionsHtml}
  `;
}

/* —— 标签云点击滚动到对应区域 —— */
function scrollToTag(tag) {
  const el = document.getElementById('tag-' + tag);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 高亮当前选中的标签
    document.querySelectorAll('.tag-cloud-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tag === tag);
    });
  }
}

/* —— 文章详情 —— */
function renderPost(app, postId) {
  const post = posts.find(p => p.id === postId);

  if (!post) {
    render404(app);
    return;
  }

  const contentHtml = mdToHtml(post.content);

  app.innerHTML = `
    <a href="#/" class="back-link">← 返回首页</a>
    <article>
      <header class="article-header">
        <h1 class="article-title">${escapeHtml(post.title)}</h1>
        ${post.category ? `<span class="category-badge" style="margin-bottom:10px;display:inline-block;">${escapeHtml(post.category)}</span>` : ''}
        <div class="post-meta">
          <span class="post-date">📅 ${formatDate(post.date)}</span>
          <span>·</span>
          <span>🕐 ${estimateReadTime(post.content)} min read</span>
          <span>·</span>
          <span id="postPv" style="font-size:0.84rem;">👁 <span id="busuanzi_value_page_pv">-</span> views</span>
        </div>
        <div class="post-tags">
          ${(post.tags || []).map(t => `<span class="post-tag" style="cursor:pointer;" onclick="event.stopPropagation();navigate('/tags');setTimeout(()=>scrollToTag('${escapeHtml(t)}'),100);"># ${escapeHtml(t)}</span>`).join('')}
        </div>
      </header>
      <div class="article-content">${contentHtml}</div>
    </article>
    <div style="text-align:center; margin-top: 40px;">
      <a href="#/" class="back-link">← 返回首页</a>
    </div>
    <section class="comments-section">
      <h2 class="comments-title">评论区</h2>
      <div id="giscusContainer"></div>
    </section>
  `;

  // 文章渲染完成后构建 TOC
  setTimeout(buildToc, 50);

  loadGiscus();
}

/* —— 关于页 —— */
function renderAbout(app) {
  app.innerHTML = `
    <h1 class="page-title">关于</h1>
    <p class="page-subtitle">关于我和这个博客</p>
    <div class="about-card">
      <div class="about-avatar">👨‍💻</div>
      <h2>你好，我是博主</h2>
      <p class="about-role">Full-Stack Developer / Lifelong Learner</p>
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

/* —— 404 页面 —— */
function render404(app) {
  app.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⊘</div>
      <h2>404 — 页面不存在</h2>
      <p>你访问的地址不存在</p>
      <br>
      <a href="#/" class="read-more">← 返回首页</a>
    </div>
  `;
}

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

// Ctrl+K 聚焦搜索
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.focus();
  }
});

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  initMarked();
  initTheme();
  showSkeleton();
  // 短暂延迟以确保骨架屏可见，然后渲染实际内容
  setTimeout(() => {
    router();
  }, 80);
});

// 监听系统主题变化（仅当用户未手动设置时生效）
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
