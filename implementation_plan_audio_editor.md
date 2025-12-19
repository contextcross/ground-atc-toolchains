# Audio Editor Module - 开发计划

> **目标**: 为生成的呼号音频添加后期处理功能，模拟真实无线电通讯效果。
> **核心库**: [Wavesurfer.js (v7)](https://wavesurfer.xyz/), Native Web Audio API
> **集成方式**: 作为 `ATCCallSignGenerator` 的独立面板扩展

---

## 🛠️ 技术架构

### 1. 可视化 (Wavesurfer.js)

- 使用 `wavesurfer.js` 渲染生成的 WAV 波形。
- 启用 `Region` 插件（可选），用于裁剪头尾空白（进阶功能）。
- 深色主题适配：波形颜色 `#0078d4` (Blue), 进度颜色 `#55aaff`.

### 2. 音频处理图 (Audio Graph)

利用 Web Audio API 构建处理链路，支持实时预览和离线导出（**OfflineAudioContext**）。

```mermaid
graph LR
    Src[Source (Buffer)] --> Pitch[Pitch/Rate]
    Pitch --> EQ[Radio Filter]
    EQ --> Dist[Distortion]
    Dist --> Gain[Volume]
    Gain --> Dest[Speaker/Export]
```

#### 节点详情

1. **Pitch/Speed (变速变调)**:
    - 使用 `AudioBufferSourceNode.playbackRate`。
    - *注*: 原生 API 变速会同时变调。若需独立调节，建议引入 `Tone.js` (PitchShift) 或接受原生行为。
    - *本计划推荐*: 原生 `detune` + `playbackRate` (性能最好，且变调伴随变速符合磁带/采样器物理特性，适合调整人声年龄感)。
2. **Radio Filter (无线电滤镜)**:
    - `BiquadFilterNode (Highpass, 300Hz)`: 切除低频浑浊。
    - `BiquadFilterNode (Lowpass, 3500Hz)`: 切除高频刺耳，模拟窄带通讯。
3. **Distortion (失真)**:
    - `WaveShaperNode`: 添加轻微过载失真，模拟模拟信号的粗糙感。
    - 可选：混入微量白噪声 (White Noise)。
4. **Volume (音量)**:
    - `GainNode`: 调节最终输出分贝 (dB)。

### 3. I/O 流程

- **输入**: 从 MiniMax API 获取的 `Blob` -> `ArrayBuffer` -> `AudioBuffer`。
- **预览**: 连接到 `AudioContext.destination` 实时播放。
- **导出**: 使用 `OfflineAudioContext` 以快于实时的速度渲染处理后的音频，重新编码为 WAV Blob。

---

## 💻 UI 设计 (WinUI 3 风格)

在现有的任务列表行中添加“编辑”按钮，点击后弹出 **Audio Editor 模态框**。

```
┌─────────────────────────────────────────────────────────────┐
│ 🎙️ Audio Editor - CSN8733.wav                               │
├─────────────────────────────────────────────────────────────┤
│  [        ~~~~~~~~~~~~ 波形显示区域 ~~~~~~~~~~~~        ]   │
│  00:00                                             00:02    │
├─────────────────────────────────────────────────────────────┤
│  🎛️ 参数调节                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ 音量 (Gain)  │  │ 语速 (Rate)  │  │ 音调 (Pitch) │          │
│  │ [====|----] │  │ [--|======] │  │ [---|=====] │          │
│  │     +2 dB   │  │    1.1x     │  │   -200 cts  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                             │
│  📻 特效:                                                   │
│  [☑️ 无线电滤镜] (300Hz-3.5kHz Bandpass + Drive)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [▶️ 预览]   [⏮ 重置]             [💾 保存并覆盖] [❌ 取消]  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 给 AI 的 Prompt (Audio Editor 专项)

> 请在现有的 `CallSignGenerator.html` 基础上，增加 **Audio Editor (音频编辑器)** 模块。
>
> **库依赖**:
>
> - 引入 `https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.min.js`
>
> **功能需求**:
>
> 1. **编辑器入口**:
>     - 在任务列表的“操作”列增加一个 🛠️ 图标按钮。
>     - 仅当状态为“已完成(Done)”时可用。
>     - 点击打开模态框，加载对应的音频数据。
>     - 任务显示面版提供预设的下拉菜单，分不同预设显示已经生成的音频。
>
> 2. **波形可视化**:
>     - 使用 Wavesurfer.js 渲染当前音频。
>     - 支持点击波形跳转播放进度。
>
> 3. **音频处理链路 (Web Audio API)**:
>     - 实现一个 `AudioProcessor` 类。
>     - **Sliders**:
>       - `Volume`: GainNode (-20dB to +20dB).
>       - `Rate`: Source playbackRate (0.5x to 2.0x).
>       - `Detune`: Source detune (-1200 to +1200 cents).
>     - **Toggle**:
>       - `Radio Effect`: 开启/关闭 Highpass(300Hz) + Lowpass(3000Hz) + WaveShaper(轻微失真)。
>
> 4. **导出/保存**:
>     - 增加“保存更改”按钮。
>     - 点击后使用 `OfflineAudioContext` 快速渲染应用了所有效果的新音频。
>     - 将新生成的 Blob 替换掉原来的任务结果，并更新 UI。
>
> **代码要求**:
>
> - 保持单文件结构 (或清晰的模块分离)。
> - 确保 OfflineAudioContext 渲染逻辑正确，能够生成包含效果的 WAV 文件。
