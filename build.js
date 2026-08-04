/**
 * build.js — 静态博客构建脚本（支持多分类目录）
 *
 * 用途：
 *   1. 扫描所有 articles_* 分类目录下的 .md 文件
 *   2. 解析每篇文章的 frontmatter（标题、日期、标签、摘要）
 *   3. 根据所在目录自动确定文章分类
 *   4. 生成 posts-data.js 供前端 index.html 加载
 *
 * 分类对应（目录名 → 分类名）：
 *   articles_tech/       → 技术
 *   articles_literature/ → 文学
 *   articles_movies/     → 电影
 *   articles_essays/     → 随笔
 *   articles_novels/     → 小说
 *   articles/            → 未分类（兼容旧目录）
 *
 * 用法：
 *   node build.js
 *
 * 文章格式（articles_xxx/xxx.md）：
 *   ---
 *   title: 文章标题
 *   date: 2026-08-04
 *   tags: [标签1, 标签2]
 *   excerpt: 简短摘要
 *   ---
 *
 *   正文内容（Markdown）...
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, 'posts-data.js');

// ── 分类目录映射 ──────────────────────────────────
// 目录名前缀 → 中文分类名，按此顺序扫描
const CATEGORY_DIRS = [
  { dir: 'articles_tech',       category: '技术' },
  { dir: 'articles_literature', category: '文学' },
  { dir: 'articles_movies',     category: '电影' },
  { dir: 'articles_essays',     category: '随笔' },
  { dir: 'articles_novels',     category: '小说' },
  // 兼容旧 articles/ 目录（归入"未分类"）
  { dir: 'articles',            category: '未分类' },
];

// ── 解析 frontmatter ──────────────────────────────────
function parseFrontmatter(raw) {
  const meta = {};
  const lines = raw.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // title: xxx
    const titleMatch = trimmed.match(/^title:\s*(.+)$/i);
    if (titleMatch) { meta.title = titleMatch[1].trim(); continue; }

    // date: YYYY-MM-DD
    const dateMatch = trimmed.match(/^date:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) { meta.date = dateMatch[1]; continue; }

    // tags: [a, b, c]  或  tags: a, b
    const tagsMatch = trimmed.match(/^tags:\s*\[(.+)\]/);
    if (tagsMatch) {
      meta.tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
      continue;
    }
    const tagsSimple = trimmed.match(/^tags:\s*(.+)$/i);
    if (tagsSimple && !tagsMatch) {
      meta.tags = tagsSimple[1].split(',').map(t => t.trim()).filter(Boolean);
      continue;
    }

    // excerpt: xxx
    const excerptMatch = trimmed.match(/^excerpt:\s*(.+)$/i);
    if (excerptMatch) { meta.excerpt = excerptMatch[1].trim(); continue; }
  }

  return meta;
}

// ── 解析单个 .md 文件 ─────────────────────────────────
function parseMarkdownFile(filePath, category) {
  const raw = fs.readFileSync(filePath, 'utf-8');

  // 必须以 --- 开头才是有效的 frontmatter
  if (!raw.startsWith('---')) {
    console.warn(`  ⚠ 跳过（无 frontmatter）：${path.basename(filePath)}`);
    return null;
  }

  // 找到第二个 ---（frontmatter 结束标记）
  const endIdx = raw.indexOf('---', 3);
  if (endIdx === -1) {
    console.warn(`  ⚠ 跳过（frontmatter 未闭合）：${path.basename(filePath)}`);
    return null;
  }

  const frontmatterRaw = raw.slice(3, endIdx);
  const body = raw.slice(endIdx + 3).trim();
  const meta = parseFrontmatter(frontmatterRaw);

  // 用文件名（去扩展名）作为 id，确保唯一性：加分类前缀
  const baseId = path.basename(filePath, '.md');
  const id = (category === '未分类') ? baseId : `${category}-${baseId}`;
  // 用于 URL 的短 id（保持不变，方便旧链接）
  const shortId = baseId;

  if (!meta.title) {
    console.warn(`  ⚠ 跳过（缺少 title）：${path.basename(filePath)}`);
    return null;
  }
  if (!meta.date) {
    console.warn(`  ⚠ 跳过（缺少 date）：${path.basename(filePath)}`);
    return null;
  }

  return {
    id: shortId,
    title: meta.title,
    date: meta.date,
    category: category,
    tags: meta.tags || [],
    excerpt: meta.excerpt || '',
    content: body,
  };
}

// ── 扫描单个目录 ─────────────────────────────────────
function scanDirectory(dirName, category) {
  const dirPath = path.join(ROOT_DIR, dirName);

  if (!fs.existsSync(dirPath)) {
    console.log(`  📁 ${dirName}/ — 目录不存在，跳过`);
    return [];
  }

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log(`  📁 ${dirName}/ — 无 .md 文件`);
    return [];
  }

  const posts = [];
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const post = parseMarkdownFile(filePath, category);
    if (post) {
      posts.push(post);
      console.log(`  ✅ ${dirName}/${file}  →  "${post.title}"  [${category}]`);
    }
  }

  return posts;
}

// ── 主流程 ────────────────────────────────────────────
function build() {
  console.log('🔍 扫描文章目录...\n');

  const allPosts = [];

  for (const { dir, category } of CATEGORY_DIRS) {
    const posts = scanDirectory(dir, category);
    allPosts.push(...posts);
  }

  // 按日期倒序排列
  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 统计各分类数量
  console.log('\n📊 分类统计：');
  const categoryCount = {};
  allPosts.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} 篇`);
  });

  // 生成 JS 文件
  const output = [
    '// ⚠ 此文件由 build.js 自动生成，请勿手动编辑',
    '// 运行 node build.js 重新生成',
    `// 生成时间：${new Date().toISOString()}`,
    `// 文章数量：${allPosts.length}`,
    `// 分类数量：${Object.keys(categoryCount).length}`,
    '',
    'const postsData = ' + JSON.stringify(allPosts, null, 2) + ';',
    '',
  ].join('\n');

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\n📦 已生成 posts-data.js（${allPosts.length} 篇文章，${Object.keys(categoryCount).length} 个分类）`);
  console.log(`📁 ${OUTPUT_FILE}\n`);
}

build();
