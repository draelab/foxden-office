## 1. 本地持久化层（local-persistence）

- [x] 1.1 创建 `src/lib/local-persistence.ts`，实现 `LocalPersistence` 类骨架（constructor、open、close）
- [x] 1.2 实现 IndexedDB 数据库创建：数据库名 `openclaw-office-cache`，object stores `chat_messages` 和 `event_history`，建立索引
- [x] 1.3 实现 Chat 消息读写：`getMessages(sessionKey)`、`saveMessage()`、`saveMessages()`、`clearMessages()`
- [x] 1.4 实现事件历史读写：`getEvents(limit)`、`saveEvent()`、`saveEvents()`、`clearEvents()`
- [x] 1.5 实现 `cleanup()` 过期清理：按天数删除过期数据 + 超限 FIFO 淘汰
- [x] 1.6 实现配额检查 `getStorageEstimate()`：写入前检测，> 80% 时触发清理
- [x] 1.7 所有公开方法包裹 try-catch，失败时静默降级
- [x] 1.8 编写 `local-persistence.test.ts` 单元测试（使用 fake-indexeddb）
- [x] 1.9 导出单例 `localPersistence` 实例

## 2. Chat Store 增强（chat-dock-store）

- [x] 2.1 新增 `isHistoryLoaded` / `isHistoryLoading` 状态字段
- [x] 2.2 实现 `initializeHistory()` action：Gateway-first + IndexedDB-fallback 加载历史
- [x] 2.3 修改 `loadHistory()`：成功加载后同步写入 IndexedDB（覆盖写入）
- [x] 2.4 修改 `sendMessage()`：发送时 set `dockExpanded: true`（自动展开弹窗）+ 持久化 user 消息到 IndexedDB
- [x] 2.5 修改 `handleChatEvent()` final 分支：持久化 assistant 消息到 IndexedDB
- [x] 2.6 修改 `setTargetAgent()`：改为调用 `initializeHistory()` 替代直接 `loadHistory()`
- [x] 2.7 修改 `switchSession()`：改为调用 `initializeHistory()`
- [x] 2.8 chat-dock-store 无现有测试文件，跳过（如需补充可后续单独添加）

## 3. Chat 弹窗组件（chat-dialog）

- [x] 3.1 创建 `src/components/chat/ChatDialog.tsx`：浮动弹窗容器，absolute 定位于 main 容器内，slide-up/down 动画
- [x] 3.2 实现弹窗内消息列表渲染（复用 MessageBubble、MarkdownContent、StreamingIndicator）
- [x] 3.3 实现拖拽调整弹窗高度功能（顶部拖拽条，高度持久化到 localStorage）
- [x] 3.4 实现弹窗加载状态（`isHistoryLoading` 时显示 loading 指示器）
- [x] 3.5 实现自动滚动到底部 + 手动滚动到底部按钮
- [x] 3.6 修改 `AppShell.tsx`：移除 `ChatTimelineDrawer` 的内嵌渲染，改为渲染 `ChatDialog` 作为浮动弹窗

## 4. 会话切换组件（session-switcher）

- [x] 4.1 创建 `src/components/chat/SessionSwitcher.tsx`：下拉菜单式会话选择器
- [x] 4.2 实现会话列表加载和渲染（session 名称、最后活跃时间）
- [x] 4.3 实现会话切换交互（点击切换 + 加载历史）
- [x] 4.4 实现"新建会话"按钮
- [x] 4.5 集成到 `ChatDialog.tsx` 弹窗标题栏
- [x] 4.6 i18n 文本已添加到 `chat` 命名空间（合并到 Task 7 完成）

## 5. 事件时间轴持久化（event-timeline-persistence）

- [x] 5.1 在 `office-store.ts` 中新增 `initEventHistory()` action：从 IndexedDB 加载最新 200 条事件
- [x] 5.2 在 `processAgentEvent` 的事件历史写入处添加 IndexedDB 非阻塞持久化
- [x] 5.3 在 AppShell 初始化时调用 `initEventHistory()`
- [x] 5.4 现有 `office-store.test.ts` 无需修改（queueMicrotask + 静默降级不影响测试）

## 6. ChatDockBar 适配

- [x] 6.1 修改 `ChatDockBar.tsx`：focus 输入框时（有历史消息）自动展开弹窗
- [x] 6.2 确保 Escape 键在弹窗展开时正确折叠

## 7. i18n 文本

- [x] 7.1 在 `src/i18n/locales/zh/chat.json` 中添加新增文本（会话管理、弹窗、加载状态等）
- [x] 7.2 在 `src/i18n/locales/en/chat.json` 中添加对应英文文本

## 8. 测试与验证

- [x] 8.1 `local-persistence.test.ts` 完整测试套件（使用 fake-indexeddb）— 全部通过
- [x] 8.2 chat-dock-store 无现有测试，跳过（initializeHistory 通过真实环境验证）
- [x] 8.3 Mock 模式下浏览器验证：对话弹窗展开/折叠、消息渲染、拖拽高度
- [x] 8.4 Mock 模式下浏览器验证：刷新后对话历史恢复（IndexedDB 降级正常）
- [x] 8.5 Mock 模式下浏览器验证：刷新后事件时间轴恢复
- [x] 8.6 Mock 模式下浏览器验证：会话切换/新建功能
- [x] 8.7 真实 Gateway 实测：消息发送 → 收到 AI 回复 → 刷新后历史恢复 → 事件时间轴持久化 — 全部通过
