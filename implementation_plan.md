# CallSign Voice Generator - H5应用开发计划 (最终版)

> **目标**: 开发一个为Ground ATC项目高度特化的呼号语音自动生成工具
> **技术栈**: HTML5 + CSS3 + JavaScript (纯前端)
> **UI风格**: WinUI 3 (深色、扁平、圆角)
> **API**: MiniMax T2A V2 (语音合成)

---

## 📋 功能模块需求

### 1. CSV导入与解析
- **交互**: 支持点击按钮选择或拖拽上传 CSV 文件。
- **解析逻辑**: 
  - 自动识别表头中的 `callSign` 和 `airline` 列（不区分大小写）。
  - 过滤空行和格式错误的行。
- **反馈**: 导入成功后，在状态栏显示“已导入 X 条任务”。

### 2. 智能中英双语翻译 (核心逻辑)

需同时支持中文和英文两种生成模式，根据预设配置自动切换。对于英文预设，将航司代码转换为标准的英文无线电呼号（如 CCA -> Air China, CSN -> China Southern），数字部分保持由 TTS 引擎自然朗读。

#### ✈️ 航司映射表

| ICAO | 中文名 | 英文名 (CallSign) |
|------|--------|-------------------|
| CCA | 国航 | Air China |
| CES | 东方 | China Eastern |
| CSN | 南方 | China Southern |
| CHH | 海南 | Hainan |
| CDG | 成都 | Chengdu |
| CSC | 四川 | SiChuan Air |
| CXA | 白鹭 | Xiamen Air |
| CQH | 春秋 | Spring Air |
| CSZ | 深圳 | Shenzhen Air |
| CJX | 长安 | Chang An |
| UEA | 联航 | United Eagle |

#### 🔢 数字读法规则

| 数字 | 中文航空读法 | 英文处理 |
|------|-------------|---------|
| 0 | 洞 | Zero |
| 1 | 幺 | One |
| 2 | 两 | Two |
| 7 | 拐 | Seven |
| 其他 | (原读音) | (原读音) |

#### 翻译示例
- **CSN8733 (ZH)**: "南方八拐三三"
- **CSN8733 (EN)**: "China Southern Eight Seven Three Three" (注意单词间保留空格以优化朗读节奏)

### 3. 预设管理
- **下拉菜单**: 提供以下预设选择：
    - `Aaron` (EN)
    - `Christopher` (EN)
    - `CN-Captain-Young` (ZH)
    - `CN-Captain-Middle-Aged` (ZH)
    - `CN-Captain-Young-EN` (EN - 此预设特指中国机长说英语)
    - `Fairy` (EN)
    - `Hanser` (ZH)
    - `Hanser-EN` (EN)
- **配置**: 每个预设需绑定 `语言(lang)` 和 `MiniMax voice_id`。

### 4. 任务面板与交互

**UI 结构**:
```
┌──────────────────────────────────────────────────────────────┐
│  预设: [▼ CN-Captain-Young]   [🔊 批量生成] [📥 导出全部]    │
├──────────────────────────────────────────────────────────────┤
│  呼号列表 (支持虚拟滚动或分页以提升性能)                     │
│  ┌────────┬──────────────┬─────────────┬──────────┐         │
│  │ 呼号   │ 翻译文本预览  │ 状态        │ 操作     │         │
│  ├────────┼──────────────┼─────────────┼──────────┤         │
│  │CCA3115 │ 国航三幺幺五  │ ✅ 已完成    │ [▶️][↻]  │         │
│  │CDG2701 │ 成都两拐洞幺  │ ⏳ 排队中    │ [🛑][✖]  │         │
│  └────────┴──────────────┴─────────────┴──────────┘         │
└──────────────────────────────────────────────────────────────┘
```

**关键功能**:
- **试听**: 状态为“已完成”时，显示播放按钮，点击直接播放内存中的 Blob 音频。
- **重试**: 状态为“失败”时，提供重试按钮。
- **防丢失**: 当页面有未导出的已生成音频时，拦截浏览器刷新/关闭操作（`beforeunload`）。

### 5. API 集成与并发控制
- **API集成举例**: 
- **API Endpoint**: `POST https://api.minimaxi.com/v1/t2a_v2`
- **认证**: Header `Authorization: Bearer <用户输入的API Key>`
- **参数举例**: 
  - "model": "speech-2.6-hd",
  "stream": false,
  "voice_setting": {
    "voice_id": "male-qn-qingse",
    "speed": 1,
    "vol": 1,
    "pitch": 0,
    "emotion": "happy"`
    "audio_setting": {
    "sample_rate": 44100,
    "bitrate": 128000,
    "format": "wav",
    "channel": 1
  },
  "subtitle_enable": false
}
- **音频输出规格**: 
采样率：44.1KHz
比特率：128kbps
位深度：32
- **并发队列**: 
  - **重要**: 批量生成时，**严禁**同时发出所有请求。
  - 实现一个并发控制器，限制同时进行的请求不超过 **3** 个。
  - 一个请求完成后，自动调度下一个排队任务。

### 6. 设置与导出

- **设置模态框**:
  - 输入/保存 API Key (存在 localStorage)。
  - (可选) 自定义 voice_id 映射。
- **文件导出**:
  - 使用 `File System Access API` (推荐) 或 `JSZip`。
  - 导出结构：`{导出目录}/{当前预设名}/{呼号}.wav`。

---

## 🎨 UI/UX 设计规范 (WinUI 3 风格)

- **配色**: 
  - 背景: `#202020` (深灰)
  - 卡片/面板: `#2d2d2d` (稍亮灰)
  - 强调色: `#0078d4` (Win11 蓝)
  - 文本: `#ffffff` (纯白主要), `#cccccc` (次要)
- **排版**:
  - 字体: `"Segoe UI", system-ui, sans-serif`
  - 圆角: `8px` (标准控件), `4px` (按钮/输入框)
  - 间距: 宽松舒适，表头 `padding: 12px`。
- **反馈**:
  - 进度条: 在顶部或底部显示总进度 [(成功 20 / 失败 1 / 总 100)](file:///d:/UnityProjects/ground-atc/Assets/Scripts/ContextCross/Dynamics/Dynamics.cs#235-241)。
  - Toast: 操作成功/失败时弹出轻提示。

---

## 📝 给 AI 开发者的 Prompt

> 请根据上述文档，编写一个单文件 HTML (包含 CSS/JS) 应用。
> 确保重点实现了 **双语翻译逻辑**、**API并发控制队列** 以及 **防止数据丢失的刷新保护** 机制。
