## Capability: local-persistence

浏览器本地持久化层，基于 IndexedDB 封装，为 Chat 消息和事件时间轴提供统一的本地缓存能力。

### 文件

- `src/lib/local-persistence.ts` — 新建

### 接口设计

```typescript
interface LocalPersistenceOptions {
  dbName?: string;            // 默认 "openclaw-office-cache"
  version?: number;           // 默认 1
  maxMessagesPerSession?: number; // 默认 500
  maxEvents?: number;         // 默认 1000
  messageExpireDays?: number; // 默认 30
  eventExpireDays?: number;   // 默认 7
}

class LocalPersistence {
  constructor(options?: LocalPersistenceOptions);

  // 生命周期
  open(): Promise<void>;
  close(): void;

  // Chat 消息
  getMessages(sessionKey: string): Promise<ChatDockMessage[]>;
  saveMessage(sessionKey: string, msg: ChatDockMessage): Promise<void>;
  saveMessages(sessionKey: string, msgs: ChatDockMessage[]): Promise<void>;
  clearMessages(sessionKey: string): Promise<void>;

  // 事件时间轴
  getEvents(limit?: number): Promise<EventHistoryItem[]>;
  saveEvent(event: EventHistoryItem): Promise<void>;
  saveEvents(events: EventHistoryItem[]): Promise<void>;
  clearEvents(): Promise<void>;

  // 维护
  cleanup(): Promise<void>;          // 清理过期数据 + 超限淘汰
  getStorageEstimate(): Promise<{ usage: number; quota: number }>;
}
```

### IndexedDB Schema

数据库名：`openclaw-office-cache`，版本 1。

**Object Store: `chat_messages`**
- keyPath: `id`
- 索引: `sessionKey`（非唯一）、`timestamp`（非唯一）、`[sessionKey, timestamp]` 复合索引
- 存储字段: `{ id, role, content, timestamp, sessionKey }`

**Object Store: `event_history`**
- keyPath: 自增 `autoKey`
- 索引: `timestamp`（非唯一）
- 存储字段: `{ timestamp, agentId, agentName, stream, summary }`

### 安全策略

1. **不存储敏感数据**：仅缓存已渲染的文本内容（`role`、`content`、`timestamp`），不存储 auth token、session secret、WebSocket 密钥
2. **配额检查**：写入前调用 `navigator.storage.estimate()`，若已用 > 80% 配额则跳过写入并触发 `cleanup()`
3. **静默降级**：所有 IndexedDB 操作包裹 try-catch，失败时返回空数组/静默跳过，不影响功能
4. **自动淘汰**：
   - `chat_messages`: 每个 sessionKey 超过 500 条时删除最旧的
   - `event_history`: 超过 1000 条时删除最旧的
   - `cleanup()` 删除超过过期天数的记录

### 场景

| 场景 | 行为 |
|------|------|
| 首次使用（无 IndexedDB 数据） | `open()` 创建数据库和 object store，`getMessages()` 返回空数组 |
| 正常读写 | `saveMessage()` 写入成功，`getMessages()` 按 timestamp 升序返回 |
| 浏览器隐私模式/IndexedDB 不可用 | `open()` 捕获异常，后续所有操作返回空数组/静默跳过 |
| 存储配额接近上限 | 写入前检测到 > 80%，触发 `cleanup()` 后重试一次 |
| 多标签页同时操作 | IndexedDB 事务自动序列化，不做跨 tab 广播 |

### 验收标准

- [ ] `open()` 在支持 IndexedDB 的浏览器中正常创建数据库
- [ ] `open()` 在不支持 IndexedDB 的环境中不抛错
- [ ] `saveMessage()` + `getMessages()` 往返一致
- [ ] `saveEvent()` + `getEvents()` 往返一致
- [ ] 超过 `maxMessagesPerSession` 时自动删除最旧消息
- [ ] 超过 `maxEvents` 时自动删除最旧事件
- [ ] `cleanup()` 正确删除过期记录
