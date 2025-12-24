# 航班表高亮逻辑分析

## 概述

本文档分析 `FlightScheduleEditor.html` 中**蓝色高亮**和**红色高亮**的判断条件。

---

## 🔴 红色高亮（冲突 - Conflict）

### CSS 类名

- `conflict-row` - 行背景变红
- `highlight-conflict` - 鼠标悬停时的强调效果

### 判断函数

`detectStandConflicts()` (第 1098-1143 行)

### 判断条件

**规则 1: 多到达冲突**

```javascript
if (data.arrivals.length >= 2) {
    data.arrivals.forEach(a => conflictIndices.add(a.index));
}
```

- **条件**: 同一停机位有 **≥2 个到达航班**
- **结果**: 所有这些到达航班都标记为冲突

**规则 2: 到达-出发时间冲突**

```javascript
const arrInBlock = arr.flight.inBlockTime || arr.flight.landingTime;
const depTakeOff = dep.flight.takeOffTime || dep.flight.offBlockTime;
if (arrInBlock && depTakeOff && compareTime(arrInBlock, depTakeOff) <= 0) {
    conflictIndices.add(arr.index);
    conflictIndices.add(dep.index);
}
```

- **条件**: 到达航班的 `inBlockTime`（或 `landingTime`）**≤** 出发航班的 `takeOffTime`（或 `offBlockTime`）
- **含义**: "先进后出" - 到达航班在出发航班离开前就入位了
- **问题**: ⚠️ 这个条件的语义似乎有问题！正常的"先出后进"应该是 `depTakeOff < arrInBlock`

### 应用位置

`renderTable()` 函数 (第 1290-1302 行)

```javascript
const hasConflict = conflictIndices.has(idx);
if (hasConflict) {
    tr.classList.add('conflict-row');
    // ...
}
```

---

## 🔵 蓝色高亮（先出后进 - Turnaround）

### CSS 类名

- `turnaround-row` - 行背景变蓝
- `highlight-turnaround` - 鼠标悬停时的强调效果

### 判断函数

`getStandUsageStats()` (第 1074-1090 行)

### 判断条件

```javascript
const arrivals = new Set();   // 有到达航班的停机位
const departures = new Set(); // 有出发航班的停机位

allFlights.forEach(f => {
    if (!f.stand) return;
    const type = getFlightType(f);
    if (type === 'arrival') arrivals.add(f.stand);
    if (type === 'departure') departures.add(f.stand);
});

// 交集：先出后进 (turnaround)
const turnarounds = new Set([...arrivals].filter(s => departures.has(s)));
```

- **条件**: 停机位**同时**出现在到达航班和出发航班中
- **问题**: ⚠️ 这里**没有检查时间顺序**！只检查了"有没有"，没检查"是否先出后进"

### 应用位置

`renderTable()` 函数 (第 1304-1310 行)

```javascript
if (f.stand && turnaroundStands.has(f.stand) && !hasConflict) {
    tr.classList.add('turnaround-row');
    // ...
}
```

- **条件**: 航班的停机位在 turnarounds 集合中，**且没有冲突**

---

## ⚠️ 问题分析

### 问题 1: 冲突检测条件可能反了

当前条件：`arrInBlock <= depTakeOff` 被视为冲突

但从语义上理解：

- **先出后进（正确）**: 出发航班先离开 (`depTakeOff`)，然后到达航班才入位 (`arrInBlock`)  
  → `depTakeOff < arrInBlock` → 无冲突
- **先进后出（冲突）**: 到达航班先入位 (`arrInBlock`)，出发航班还没起飞 (`depTakeOff`)  
  → `arrInBlock < depTakeOff` → 有冲突

当前代码用 `arrInBlock <= depTakeOff` 判断冲突，这意味着**只要到达时间不晚于起飞时间就算冲突**，这实际上是正确的！

### 问题 2: Turnaround 检测缺少时间校验

`getStandUsageStats()` 只检查停机位是否同时有到达和出发航班，**完全不检查时间顺序**。

这导致：

- 即使是"先进后出"（应该是红色冲突），只要有冲突检测未触发，就可能显示蓝色
- 需要添加时间校验，确保 `depTakeOff < arrInBlock` 才是真正的 turnaround

### 问题 3: 优先级处理

当前代码：

```javascript
if (f.stand && turnaroundStands.has(f.stand) && !hasConflict) {
    tr.classList.add('turnaround-row');
}
```

虽然有 `!hasConflict` 检查避免冲突行显示蓝色，但如果冲突检测本身有遗漏，蓝色高亮就会错误显示。

---

## 建议修复方案

### 修复 1: 增强 Turnaround 时间校验

在 `getStandUsageStats()` 或单独创建一个函数，检验每个 turnaround 停机位是否满足 `depTakeOff < arrInBlock`：

```javascript
function getValidTurnaroundStands() {
    const turnarounds = new Set();
    const standFlights = new Map();
    
    // 收集每个停机位的到达和出发航班
    allFlights.forEach((f, idx) => {
        if (!f.stand) return;
        if (!standFlights.has(f.stand)) {
            standFlights.set(f.stand, { arrivals: [], departures: [] });
        }
        const type = getFlightType(f);
        if (type === 'arrival') {
            standFlights.get(f.stand).arrivals.push(f);
        } else {
            standFlights.get(f.stand).departures.push(f);
        }
    });
    
    // 检查每个停机位
    standFlights.forEach((data, stand) => {
        if (data.arrivals.length === 1 && data.departures.length === 1) {
            const arr = data.arrivals[0];
            const dep = data.departures[0];
            const arrTime = arr.inBlockTime || arr.landingTime;
            const depTime = dep.takeOffTime || dep.offBlockTime;
            
            // 先出后进：出发时间 < 到达时间
            if (arrTime && depTime && compareTime(depTime, arrTime) < 0) {
                turnarounds.add(stand);
            }
        }
    });
    
    return turnarounds;
}
```

### 修复 2: 确保冲突优先级

确保 `detectStandConflicts()` 覆盖所有冲突场景，包括：

- 多到达
- 多出发  
- 到达时间 ≤ 出发时间（先进后出）

---

## 相关代码位置

| 功能 | 函数名 | 行号 |
|------|--------|------|
| 冲突检测 | `detectStandConflicts()` | 1098-1143 |
| Turnaround 统计 | `getStandUsageStats()` | 1074-1090 |
| 渲染高亮 | `renderTable()` | 1251-1410 |
| 冲突行应用 | `renderTable()` 内 | 1290-1302 |
| Turnaround 行应用 | `renderTable()` 内 | 1304-1310 |
