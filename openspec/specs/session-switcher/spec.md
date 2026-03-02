## Capability: session-switcher

会话切换/新建 UI 组件，暴露 ChatDockStore 中已有但未使用的会话管理功能。

### 文件

- `src/components/chat/SessionSwitcher.tsx` — 新建
- `src/components/chat/ChatDockBar.tsx` — 修改（集成 SessionSwitcher）

### 组件设计

```typescript
function SessionSwitcher(): JSX.Element {
  // 从 useChatDockStore 获取 sessions, currentSessionKey, switchSession, newSession, loadSessions
}
```

### UI 结构

```
┌─────────────────────────────┐
│ 📋 当前会话名称  ▾          │  ← 点击展开下拉
├─────────────────────────────┤
│ Session 1 (active)     ✓   │
│   最后消息: "你好..."  3min │
│ Session 2                   │
│   最后消息: "分析..."  1hr  │
│ ─────────────────────────── │
│ ＋ 新建会话                  │
└─────────────────────────────┘
```

### 布局位置

在 `ChatDialog` 弹窗的标题栏区域（拖拽条下方），而非在 dock bar 中，以避免 dock bar 过于拥挤。

### 交互行为

| 触发 | 行为 |
|------|------|
| 弹窗展开时 | 自动调用 `loadSessions()` |
| 点击 session 名称 | 展开下拉列表 |
| 选择其他 session | 调用 `switchSession(key)`，加载对应历史 |
| 点击"新建会话" | 调用 `newSession()`，清空消息区 |
| 在下拉外点击 | 关闭下拉 |

### 会话名称显示

- 主会话：显示 Agent 名称（如 "main"）
- 自定义 session：显示 session key 中的标识部分（如 "session-1709...")，截断为 20 字符
- 未知名称：显示 session key 前 15 字符

### 场景

| 场景 | 行为 |
|------|------|
| 仅有一个 session | 显示当前 session 名称，下拉中只有一项 + 新建按钮 |
| 多个 session | 下拉列表按最后活跃时间排序 |
| 切换 session | 切换后加载对应历史，消息区更新 |
| 新建 session | 生成新 session key，消息区清空 |
| Gateway 不可用 | `loadSessions()` 静默失败，仅显示当前 session |

### 验收标准

- [ ] 弹窗展开时显示 SessionSwitcher
- [ ] 点击可展开会话列表
- [ ] 切换会话后消息区正确更新
- [ ] 新建会话功能正常
- [ ] 仅一个会话时 UI 仍可用
- [ ] i18n 文本正确
