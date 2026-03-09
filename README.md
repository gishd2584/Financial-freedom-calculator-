<div align="center">

# ✦ 自由计算器 · Financial Freedom Calculator

**规划你的财富自由之路，让每一小时都有意义。**

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-e8c872?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

<img src="./preview.png" alt="Financial Freedom Calculator Preview" width="680" />

</div>

---

## 简介

**自由计算器**是一个精致的财富自由规划工具，帮助你直观地了解：从现在到实现财务自由，**每年、每月、每天、每小时**需要赚多少钱。

输入你的目标金额、当前年龄和退休计划，计算器会基于复利模型实时生成完整的财富增长路径，并给出可执行的收入目标拆解。

## 核心功能

**参数调节** — 5 个交互式滑块，实时响应：财富自由目标、当前年龄、目标退休年龄、当前存款、预期年化收益率。

**收入目标拆解** — 自动计算每年 / 每月 / 每天 / 每小时（按 8 小时工作制）所需收入，让抽象的大目标变成具体的日常数字。

**财富增长曲线** — 可视化展示从当前到退休的资产增长轨迹，直观感受复利的力量。

**里程碑节点** — 标记 25%、50%、75%、100% 目标达成时的年龄，掌握每个阶段的进度。

**详细财务分析** — 包括复利收益占比、本金 vs 收益拆解、退休后按 4% 法则计算的被动月收入，以及基于你参数的个性化洞察建议。

## 技术栈

| 技术 | 说明 |
|------|------|
| React 18+ | 函数式组件 + Hooks |
| 纯 CSS-in-JS | 零依赖，内联样式实现黑金奢华主题 |
| SVG | 手写轻量图表，无需图表库 |
| Google Fonts | Playfair Display + Noto Sans SC |

## 快速开始

### 前置要求

- Node.js ≥ 16
- npm 或 yarn

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/你的用户名/financial-freedom-calculator.git
cd financial-freedom-calculator

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173`（Vite 默认端口）即可使用。

### 使用 Vite 创建项目（从零开始）

如果你想将本组件集成到新项目中：

```bash
npm create vite@latest my-calculator -- --template react
cd my-calculator
npm install

# 将 financial-freedom-calculator.jsx 复制到 src/ 目录
# 修改 src/App.jsx 引入组件：
```

```jsx
import FinancialFreedomCalc from './financial-freedom-calculator'

function App() {
  return <FinancialFreedomCalc />
}

export default App
```

## 计算模型说明

### 核心公式

计算器基于**年金终值 (Future Value of Annuity)** 模型：

```
目标金额 = 现有存款 × (1+r)^n + 年存款 × [(1+r)^n - 1] / r
```

其中 `r` 为年化收益率，`n` 为投资年数。

### 4% 法则

退休后被动收入按照 [4% 安全提取率](https://en.wikipedia.org/wiki/Trinity_study) 计算——即每年提取总资产的 4%，在大多数市场条件下可维持 30 年以上。

### 年化收益率参考

| 投资类型 | 预期年化 |
|---------|---------|
| 货币基金 | 2% – 3% |
| 债券基金 | 4% – 6% |
| 指数基金 | 7% – 10% |
| 股票组合 | 10% – 15% |

> ⚠️ 以上数据仅供参考，实际收益受市场波动影响，过往表现不代表未来回报。

## 项目结构

```
financial-freedom-calculator/
├── src/
│   └── financial-freedom-calculator.jsx   # 主组件（单文件）
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 自定义与扩展

你可以根据需求进行如下调整：

- **修改主题色**：搜索 `#e8c872`（金色）和 `#1a1c24`（深色背景）替换为你喜欢的配色
- **调整工作时长**：在代码中搜索 `/ 8`，修改为你的每日工作小时数
- **添加通胀因子**：在计算模型中加入年通胀率参数，让结果更贴近实际购买力
- **多币种支持**：修改 `formatCurrency` 函数，切换货币符号和格式

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 许可证

本项目基于 [MIT License](./LICENSE) 开源。

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

*Made with ☕ and compound interest.*

</div>
