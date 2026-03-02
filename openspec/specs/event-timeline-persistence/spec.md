## Capability: event-timeline-persistence

事件时间轴数据持久化，使用 IndexedDB 缓存事件历史，页面刷新后自动恢复。

### 文件

- `src/store/office-store.ts` — 修改（事件历史初始化加载 + 新事件写入 IndexedDB）

### 数据流变更

**Before（当前）：**
```
processAgentEvent → state.eventHistory.push(item) → 纯内存，刷新丢失
```

**After：**
```
初始化：localPersistence.getEvents(200) → state.eventHistory = cached

processAgentEvent → state.eventHistory.push(item) + localPersistence.saveEvent(item)
```

### 新增 Action

```typescript
interface OfficeStore {
  // 新增
  initEventHistory: () => Promise<void>;   // 从 IndexedDB 恢复事件历史
  persistEvent: (event: EventHistoryItem) => void;  // 写入 IndexedDB（非阻塞）
}
```

### 初始化流程

```
AppShell mount / Gateway 连接前
  ↓
initEventHistory():
  1. localPersistence.getEvents(EVENT_HISTORY_LIMIT)
  2. set({ eventHistory: cached })
  3. 后续 processAgentEvent 中新事件既 push 到内存也 persist 到 IndexedDB
```

### processAgentEvent 修改

在现有的 `state.eventHistory.push(historyItem)` 之后，添加非阻塞的 IndexedDB 写入：

```typescript
// 现有逻辑不变
state.eventHistory.push(historyItem);
if (state.eventHistory.length > EVENT_HISTORY_LIMIT) {
  state.eventHistory = state.eventHistory.slice(-EVENT_HISTORY_LIMIT);
}

// 新增：非阻塞持久化
queueMicrotask(() => {
  localPersistence.saveEvent(historyItem).catch(() => {});
});
```

使用 `queueMicrotask` 而非 `await`，避免在 Immer produce 回调中引入异步操作。

### 存储限制

| 限制项 | 值 |
|--------|-----|
| IndexedDB 最大事件数 | 1000 条 |
| 内存最大事件数 | 200 条（`EVENT_HISTORY_LIMIT`，保持不变） |
| 过期清理 | 7 天 |
| 初始化加载数 | 最新 200 条 |

### 场景

| 场景 | 行为 |
|------|------|
| 首次使用（无缓存） | `initEventHistory()` 返回空数组，从零开始积累 |
| 页面刷新（有缓存） | `initEventHistory()` 从 IndexedDB 加载最新 200 条，事件时间轴立即有数据 |
| 持续接收事件 | 每个事件同时写入内存和 IndexedDB |
| 事件超过 1000 条 | IndexedDB 自动淘汰最旧的事件 |
| 7 天后 | `cleanup()` 删除过期事件 |
| IndexedDB 不可用 | 静默降级为纯内存模式，行为与当前完全一致 |

### 验收标准

- [ ] 页面刷新后事件时间轴立即显示历史事件（不为空）
- [ ] 新事件既追加到内存又写入 IndexedDB
- [ ] IndexedDB 中事件数不超过 1000 条
- [ ] 7 天前的事件被自动清理
- [ ] IndexedDB 写入失败不影响正常事件处理
- [ ] `initEventHistory()` 在 IndexedDB 不可用时静默返回空数组
