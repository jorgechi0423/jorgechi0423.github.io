---
title: 2026 上半年读书笔记
date: 2026-08-01
tags: [阅读, 生活]
excerpt: 回顾上半年读过的几本好书，记录一些思考和收获。
---

2026年上半年读了不少书，挑几本印象深刻的记录一下。

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

```javascript
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
```

好的代码是写给人看的。

## 《人类简史》

尤瓦尔·赫拉利从认知革命讲到科学革命，用宏大的视角审视人类历史。读完之后会对「我们是谁、我们从哪里来」有新的理解。

---

读书是性价比最高的投资。下半年继续加油 📚
