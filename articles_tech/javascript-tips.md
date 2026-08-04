---
title: 10 个实用的 JavaScript 小技巧
date: 2026-07-25
tags: [技术, JavaScript]
excerpt: 分享一些在日常开发中非常实用的 JavaScript 技巧，让你的代码更简洁优雅。
---

JavaScript 是一门充满惊喜的语言。这里整理了一些我在日常开发中经常用到的小技巧，希望能帮到你。

## 1. 解构赋值简化代码

解构赋值可以让你从对象或数组中提取值，赋值给变量。这在处理函数参数时特别有用：

```javascript
const user = { name: '小明', age: 25, city: '北京' };
const { name, age } = user;
console.log(name); // 小明
```

## 2. 可选链操作符 ( ?. )

访问深层嵌套的对象属性时，不用再写一堆 `&&` 判断了：

```javascript
const city = user?.address?.city ?? '未知';
// 等价于 user && user.address && user.address.city || '未知'
```

## 3. 模板字符串

使用反引号可以轻松拼接字符串和多行文本，嵌入变量也非常方便。

```javascript
const name = '小明';
console.log(`你好，${name}！欢迎回来。`);
```

## 4. 数组方法：map / filter / reduce

这三个方法是函数式编程的核心，熟练掌握后可以大大减少代码量。

```javascript
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);        // [2, 4, 6, 8, 10]
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
const sum = nums.reduce((a, b) => a + b, 0); // 15
```

## 5. 展开运算符

`...` 运算符可以轻松合并数组和对象，或者在函数调用中展开参数。

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2]; // [1,2,3,4,5,6]

const defaults = { theme: 'dark', lang: 'zh' };
const userSettings = { lang: 'en' };
const config = { ...defaults, ...userSettings }; // { theme:'dark', lang:'en' }
```

## 6. 空值合并运算符 ( ?? )

和 `||` 不同，`??` 只在左侧为 `null` 或 `undefined` 时才取右侧的值，`0` 和空字符串不会被误判。

```javascript
const count = 0;
console.log(count || 10);  // 10  (可能不是你想要的)
console.log(count ?? 10);  // 0   (这才是对的)
```

## 7. Promise.all 并行请求

当需要同时发起多个请求时，用 `Promise.all` 可以显著提升性能。

```javascript
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json()),
]);
```

## 8. 对象简写

当属性名和变量名相同时，可以直接简写。

```javascript
const name = '小明';
const age = 25;
const user = { name, age }; // 而不是 { name: name, age: age }
```

## 9. 动态属性名

可以用方括号在对象字面量中使用变量作为属性名。

```javascript
const key = 'favoriteColor';
const user = {
  name: '小明',
  [key]: 'blue', // 动态属性名
};
```

## 10. console.table

在调试数组或对象数据时，`console.table()` 比 `console.log()` 更直观。

```javascript
const users = [
  { name: '小明', age: 25, city: '北京' },
  { name: '小红', age: 23, city: '上海' },
];
console.table(users);
// 以表格形式打印，一目了然
```

---

这些技巧虽然基础，但每天都会用到。熟能生巧，共勉！
