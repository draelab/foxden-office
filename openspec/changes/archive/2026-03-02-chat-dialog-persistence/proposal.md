## Why

当前 Chat 和事件时间轴存在三个核心体验问题：

1. **Chat 占用 Office 区域**：`ChatTimelineDrawer` 嵌入在 `<main>` flex 容器底部，展开后直接压缩 Office 2D/3D 视图的可用空间。用户查看对话时无法同时观察完整的 Office 场景，且 dock 展开/折叠体验生硬。
2. **对话历史刷新丢失**：`ChatDockStore.messages` 是纯内存状态（Zustand），页面刷新后清空。虽然 Gateway 提供 `chat.history` RPC 可恢复历史，但当前仅在 `setTargetAgent` 或 `final` 事件后才调用 `loadHistory()`，**初始加载、页面刷新、重连**场景均未自动恢复。且 `loadSessions()`、`switchSession()`、`newSession()` 虽已实现但 UI 中从未暴露。当 Gateway 不可用（Mock 模式、离线）时，对话完全无法持久化。
3. **事件时间轴刷新丢失**：`officeStore.eventHistory` 是纯内存数组（上限 200 条），页面刷新后全部清空。Gateway 目前不提供事件历史查询接口，因此需要浏览器本地持久化方案。

用户期望：Chat 像普通聊天应用一样管理对话——弹窗展开、可折叠、历史可追溯、刷新不丢。事件时间轴作为重要的运维参考信息，也应该在刷新后保留。

## What Changes

- **Chat 弹窗化**：将 `ChatTimelineDrawer` 从 `<main>` 内嵌改为浮动弹窗（Popover/Dialog 形式），不占用 Office 区域。输入框仍保留在底部 dock bar，输入/发送时自动展开弹窗。支持折叠（缩回默认 dock bar 状态）和拖拽调整弹窗大小。
- **Chat 历史持久化**：建立双层存储策略——优先通过 Gateway `chat.history` RPC 获取历史；Gateway 不可用时降级到浏览器 IndexedDB 本地存储。初始化时自动加载历史。暴露会话切换/新建 UI。
- **事件时间轴持久化**：使用浏览器 IndexedDB 缓存事件历史，页面刷新后自动恢复。设置合理的存储上限（1000 条）和过期清理（7 天），避免过度占用。
- **本地存储安全策略**：统一的 IndexedDB 管理层，带存储配额检查、自动过期淘汰、敏感数据不存储（仅缓存已渲染的消息文本，不存储 token/auth 信息）。

## Capabilities

### New Capabilities
- `chat-dialog`: Chat 弹窗 UI 组件——浮动对话窗口、自动展开/折叠、拖拽调整大小、会话管理 UI
- `local-persistence`: 浏览器本地持久化层——IndexedDB 封装、配额管理、过期淘汰、安全策略
- `event-timeline-persistence`: 事件时间轴持久化——IndexedDB 缓存、刷新恢复、自动清理

### Modified Capabilities
- `chat-dock-store`: Store 层适配弹窗模式，增加初始化自动加载、双层存储逻辑、会话管理 action
- `office-store`: eventHistory 初始化时从 IndexedDB 恢复，新事件同步写入 IndexedDB

## Impact

- **核心新增文件**：
  - `src/lib/local-persistence.ts` — IndexedDB 封装，统一的浏览器本地存储管理
  - `src/components/chat/ChatDialog.tsx` — 浮动对话弹窗组件（替代 ChatTimelineDrawer 在 main 中的嵌入）
  - `src/components/chat/SessionSwitcher.tsx` — 会话列表/切换/新建 UI
- **核心修改文件**：
  - `src/store/console-stores/chat-dock-store.ts` — 弹窗状态管理、初始化加载、IndexedDB 降级存储
  - `src/store/office-store.ts` — eventHistory 持久化读写
  - `src/components/layout/AppShell.tsx` — Chat 布局从内嵌改为浮动弹窗
  - `src/components/chat/ChatDockBar.tsx` — 输入时自动展开弹窗、集成 SessionSwitcher
- **无 breaking changes**，完全向后兼容
- **不涉及 Gateway 协议变更**
