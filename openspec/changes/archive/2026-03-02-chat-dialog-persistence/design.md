## Context

OpenClaw Office 的 Chat 目前以 dock bar 形式嵌入 `AppShell` 的 `<main>` 区域底部（`ChatDockBar` + `ChatTimelineDrawer`）。展开对话时直接压缩 Office 2D/3D 视图空间。消息存储在 Zustand 纯内存 store 中，刷新即丢。事件时间轴（`officeStore.eventHistory`）同样是纯内存数组，刷新清空。

Gateway 提供 `chat.history` / `chat.send` / `chat.abort` / `sessions.list` RPC，但当前仅在切换 Agent 或收到 `final` 事件后才调用 `loadHistory()`。会话管理方法（`switchSession`/`newSession`/`loadSessions`）已在 store 中实现但 UI 未暴露。

## Goals / Non-Goals

**Goals:**
- Chat 对话从内嵌 dock 改为浮动弹窗（Popover），不占用 Office 视图区域
- 输入消息或点击展开时自动弹出对话窗口，支持折叠回 dock bar
- 弹窗支持拖拽调整高度
- 对话历史在页面刷新后自动恢复（优先 Gateway，降级 IndexedDB）
- 暴露会话列表/切换/新建 UI
- 事件时间轴在页面刷新后自动恢复（IndexedDB 缓存）
- 本地存储有安全限制：配额上限、自动过期、不存储敏感信息

**Non-Goals:**
- 不改变 Chat 输入框的位置和外观（仍在底部 dock bar）
- 不改变 Gateway chat RPC 协议
- 不实现端到端加密或复杂的本地数据安全方案
- 不做跨设备同步（浏览器本地存储仅作为降级方案）
- 不实现对话搜索功能（后续迭代）

## Decisions

### 1. Chat 弹窗布局方案

**选择**：Popover/Floating Panel，从 dock bar 向上弹出。

弹窗特征：
- **锚点**：固定于 dock bar 上方，宽度与 dock bar 一致（响应式，最大 640px）
- **高度**：默认 400px，可拖拽调整（150px–窗口高度 60%），高度偏好持久化到 localStorage
- **层级**：`z-50`，浮在 Office 视图之上，不占用 flex 空间
- **动画**：展开时从底部 slide-up 200ms；折叠时 slide-down 150ms
- **自动展开**：用户在输入框输入第一个字符时自动展开（通过 `onFocus` 或 `onChange` 触发）
- **手动折叠**：点击 chevron 按钮或按 Escape 折叠

**备选方案**：Modal Dialog（全屏遮罩）→ 过于打断；侧边抽屉 → 与 Sidebar 冲突。

### 2. 对话历史双层存储策略

**选择**：Gateway-first + IndexedDB-fallback。

```
初始化流程：
1. Gateway connected → chat.history RPC 获取 → 渲染 + 同步写入 IndexedDB
2. Gateway disconnected / Mock 模式 → 从 IndexedDB 读取缓存
3. 新消息到达（final）→ 追加到 store + 写入 IndexedDB
```

IndexedDB 表结构：
```
chat_messages:
  key: [sessionKey, timestamp]
  value: { id, role, content, timestamp, sessionKey }
  index: sessionKey, timestamp
```

**存储限制**：
- 每个 sessionKey 最多 500 条消息（FIFO 淘汰最旧的）
- 总存储上限 5MB 估算（约 10,000 条普通消息）
- 超过 30 天未访问的 session 数据自动清理

### 3. 事件时间轴持久化

**选择**：IndexedDB 缓存，按时间戳索引。

```
event_history:
  key: timestamp (自增)
  value: { timestamp, agentId, agentName, stream, summary }
  index: timestamp
```

**存储限制**：
- 最多 1000 条（与内存 EVENT_HISTORY_LIMIT=200 不同，IndexedDB 保留更多）
- 超过 7 天的事件自动清理
- 初始化时从 IndexedDB 加载最新 200 条到内存

### 4. IndexedDB 封装层设计

**选择**：轻量封装类 `LocalPersistence`，不引入第三方库。

```typescript
class LocalPersistence {
  private db: IDBDatabase | null;

  async open(): Promise<void>; // 打开/创建数据库
  async getMessages(sessionKey: string): Promise<ChatDockMessage[]>;
  async saveMessage(sessionKey: string, msg: ChatDockMessage): Promise<void>;
  async saveMessages(sessionKey: string, msgs: ChatDockMessage[]): Promise<void>;
  async getEvents(limit?: number): Promise<EventHistoryItem[]>;
  async saveEvent(event: EventHistoryItem): Promise<void>;
  async cleanup(): Promise<void>; // 清理过期数据
  async getStorageEstimate(): Promise<{ usage: number; quota: number }>;
}
```

数据库名：`openclaw-office-cache`，版本 1，object stores：`chat_messages`、`event_history`。

**安全策略**：
- 不存储 auth token、WebSocket 密钥等敏感信息
- 仅缓存已渲染的消息文本内容
- 使用 `navigator.storage.estimate()` 检查配额，配额不足时跳过写入
- IndexedDB 操作全部 try-catch，失败时静默降级（不影响功能）

### 5. 会话管理 UI

**选择**：在 dock bar 的 AgentSelector 旁边增加 SessionSwitcher 下拉菜单。

SessionSwitcher 特征：
- 显示当前 session 名称（截断显示）
- 点击展开下拉列表，显示所有 session
- 每个 session 显示最后一条消息的时间和预览
- 底部有"新建会话"按钮
- 初始化时调用 `loadSessions()`

### 6. ChatDockBar 和弹窗的关系

**选择**：ChatDockBar 保持现有位置和外观，但移除 ChatTimelineDrawer 的内嵌渲染。弹窗作为 ChatDockBar 的兄弟元素渲染，使用 absolute/fixed 定位浮在上方。

组件层级变化：
```
Before:
  <main>
    <div>{content}</div>           ← Office view
    <ChatTimelineDrawer />         ← 嵌入式，压缩 Office 空间
    <ChatDockBar />
  </main>

After:
  <main>
    <div>{content}</div>           ← Office view（不被压缩）
    <ChatDockBar />                ← 保持底部 dock
  </main>
  <ChatDialog />                   ← 浮动弹窗，z-50，不占用 flex 空间
```

`ChatDialog` 组件复用 `ChatTimelineDrawer` 的消息渲染逻辑，但布局改为 fixed/absolute 定位。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| IndexedDB 在隐私模式/部分浏览器中不可用 | 所有 IndexedDB 操作 try-catch，不可用时静默降级为纯内存模式 |
| IndexedDB 存储占用增长 | 设置硬上限（消息 500/session，事件 1000 条）+ 定期自动清理过期数据 |
| 弹窗浮动可能遮挡 Office 视图关键信息 | 弹窗半透明背景 + 可拖拽调整高度 + 随时可折叠 |
| 多标签页同时操作可能导致 IndexedDB 数据冲突 | IndexedDB 自带事务机制，读写天然序列化；不做跨 tab 同步广播 |
| Gateway 返回的历史与本地缓存可能不一致 | Gateway 数据优先级更高，连接成功后用 Gateway 数据覆盖本地缓存 |
