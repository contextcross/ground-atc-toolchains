# ground-atc-toolchains
本项目旨在为 Ground ATC 游戏开发提供轻量级、易于访问的辅助工具。通过 GitHub Pages 托管，确保团队成员随时随地都能通过 Web 访问最新的工具版本。
本仓库的所有工具均使用 **HTML5** 构建，无需安装，直接在浏览器中打开即可使用。

---

## 🛠️ 工具列表 (Tools)

以下是当前可用的工具链组件，点击下方链接即可直接运行：

### 1. 📡 [ATC Call Sign Generator (ATC 呼号生成器)](https://contextcross.github.io/ground-atc-toolchains/ATCCallSignGenerator.html)
> **功能描述**：  
> 用于快速生成符合航空管制通信规范的航班呼号。适用于游戏内航班数据的批量生成或随机化处理，确保通信术语的真实性与多样性。
>
> **[点击启动呼号生成器 ->](https://contextcross.github.io/ground-atc-toolchains/ATCCallSignGenerator.html)**

### 2. 🗓️ [Flight Schedule Editor (航班时刻表编辑器)](https://contextcross.github.io/ground-atc-toolchains/FlightScheduleEditor.html)
> **功能描述**：  
> 提供可视化的界面来创建、编辑和管理游戏内的航班时刻表（Flight Schedule）。支持对航班起降时间、航线、机型等关键数据进行调整，简化游戏关卡配置流程。
>
> **[点击启动时刻表编辑器 ->](https://contextcross.github.io/ground-atc-toolchains/FlightScheduleEditor.html)**

---

## 🚀 如何使用 (How to Use)
由于本项目完全基于 H5 构建，您无需配置任何本地开发环境：
1. 直接点击上方**工具列表**中的链接即可使用。
2. 如果您是开发者并希望修改工具源码：
   - 将仓库克隆到本地：
     ```bash
     git clone [https://github.com/contextcross/ground-atc-toolchains.git](https://github.com/contextcross/ground-atc-toolchains.git)
     ```
   - 直接用浏览器打开对应的 `.html` 文件进行调试。

## 📂 仓库结构

```text
ground-atc-toolchains/
├── ATCCallSignGenerator.html  # 呼号生成器源码
├── FlightScheduleEditor.html  # 时刻表编辑器源码
└── README.md                  # 说明文档（本页）
