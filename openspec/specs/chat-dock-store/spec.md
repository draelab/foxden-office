## Capability: chat-dock-store (Modified)

增强 `ChatDockStore`，支持初始化自动加载历史、双层存储（Gateway + IndexedDB）、弹窗模式状态管理。

### 文件

- `src/store/console-stores/chat-dock-store.ts` — 修改

### 新增/修改 Action

```typescript
interface ChatDockState {
  // 新增状态
  isHistoryLoaded: boolean;      // 标记是否已加载过历史
  isHistoryLoading: boolean;     // 加载中状态

  // 新增 action
  initializeHistory: () => Promise<void>;  // 初始化加载历史（Gateway-first，IndexedDB-fallback）
  persistMessage: (msg: ChatDockMessage) => Promise<void>; // 双写消息到 IndexedDB

  // 修改的 action
  sendMessage: (text: string) => Promise<void>;       // 增加：发送时自动展开弹窗
  handleChatEvent: (event: Record<string, unknown>) => void; // 增加：final 时持久化到 IndexedDB
  loadHistory: () => Promise<void>;                    // 增加：加载后同步写入 IndexedDB
}
```

### 初始化流程

```
AppShell 连接成功 → setTargetAgent(mainAgent)
  ↓
setTargetAgent(agentId):
  1. set({ targetAgentId, currentSessionKey, messages: [] })
  2. initializeHistory()
    ↓
initializeHistory():
  1. set({ isHistoryLoading: true })
  2. try Gateway chat.history RPC
     - 成功 → set({ messages }) + localPersistence.saveMessages()
     - 失败 → localPersistence.getMessages()
       - 有缓存 → set({ messages: cached })
       - 无缓存 → set({ messages: [] })
  3. set({ isHistoryLoaded: true, isHistoryLoading: false })
```

### 消息持久化流程

```
sendMessage(text):
  1. 创建 userMsg
  2. set({ messages: [..., userMsg], dockExpanded: true })  ← 新增：自动展开
  3. localPersistence.saveMessage(sessionKey, userMsg)       ← 新增：持久化
  4. adapter.chatSend(...)

handleChatEvent (state === "final"):
  1. 创建 assistantMsg
  2. set({ messages: [..., assistantMsg] })
  3. localPersistence.saveMessage(sessionKey, assistantMsg)  ← 新增：持久化

loadHistory():
  1. adapter.chatHistory(sessionKey)
  2. set({ messages })
  3. localPersistence.saveMessages(sessionKey, messages)     ← 新增：覆盖写入 IndexedDB
```

### 弹窗自动展开逻辑

| 触发 | 动作 |
|------|------|
| `sendMessage()` 被调用 | `set({ dockExpanded: true })` |
| 用户 focus 输入框 + `messages.length > 0` | 由 `ChatDockBar` 组件调用 `setDockExpanded(true)` |

### 场景

| 场景 | 行为 |
|------|------|
| 首次连接 Gateway | `initializeHistory()` 从 Gateway 加载历史，写入 IndexedDB |
| 页面刷新，Gateway 连接中 | `initializeHistory()` 先尝试 Gateway（等待连接），成功后加载 |
| 页面刷新，Gateway 不可用 | `initializeHistory()` 从 IndexedDB 读取缓存消息 |
| Mock 模式 | Mock adapter 返回模拟历史，同时写入 IndexedDB |
| 切换 Agent | 清空当前消息，重新 `initializeHistory()` 加载新 Agent 的历史 |
| 收到 final 事件 | 追加消息到 store + 写入 IndexedDB |
| 发送消息 | 追加 user 消息 + 自动展开弹窗 + 写入 IndexedDB |

### 验收标准

- [ ] 页面刷新后对话历史自动恢复（Gateway 在线时从 Gateway 加载）
- [ ] Gateway 不可用时从 IndexedDB 恢复缓存的历史消息
- [ ] 新消息（用户发送和助手回复）写入 IndexedDB
- [ ] Gateway 数据覆盖 IndexedDB 数据（Gateway 优先）
- [ ] `sendMessage()` 自动展开弹窗
- [ ] 加载历史时显示 loading 状态
- [ ] 切换 Agent 后正确加载对应 Agent 的历史
