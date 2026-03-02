## Capability: chat-dialog

Chat 浮动弹窗组件，替代原有的内嵌 `ChatTimelineDrawer`，实现对话界面不占用 Office 视图区域。

### 文件

- `src/components/chat/ChatDialog.tsx` — 新建（替代 ChatTimelineDrawer 在 AppShell 中的角色）
- `src/components/layout/AppShell.tsx` — 修改布局
- `src/components/chat/ChatTimelineDrawer.tsx` — 保留但不再内嵌在 main 中

### 组件设计

```typescript
interface ChatDialogProps {
  // 无需外部 props，从 store 获取状态
}

function ChatDialog(): JSX.Element | null {
  // 当 dockExpanded === true 时渲染浮动弹窗
  // 当 dockExpanded === false 时返回 null
}
```

### 布局变更

**Before（当前）：**
```
<main className="flex flex-1 flex-col">
  <div className="flex-1">{content}</div>       ← Office view
  <ChatTimelineDrawer />                         ← 内嵌，压缩 Office 空间
  <ChatDockBar />
</main>
```

**After：**
```
<main className="relative flex flex-1 flex-col">
  <div className="flex-1">{content}</div>       ← Office view（完整空间）
  <ChatDockBar />                                ← 底部 dock bar
</main>
<ChatDialog />                                   ← fixed 定位浮动弹窗
```

### 弹窗样式规格

| 属性 | 值 |
|------|-----|
| 定位 | `fixed`，bottom 锚定在 dock bar 上方 |
| 宽度 | 响应式，`max-w-2xl`（640px），移动端 100% |
| 默认高度 | 400px |
| 最小高度 | 150px |
| 最大高度 | `60vh` |
| z-index | `z-50` |
| 圆角 | `rounded-t-xl` |
| 阴影 | `shadow-2xl` |
| 背景 | `bg-white dark:bg-gray-900` |
| 边框 | `border border-gray-200 dark:border-gray-700` |

### 动画

- **展开**：`translateY(100%) → translateY(0)`，200ms ease-out
- **折叠**：`translateY(0) → translateY(100%)`，150ms ease-in
- 使用 CSS `transition` + `transform` 实现，无需引入动画库

### 交互行为

| 触发 | 行为 |
|------|------|
| 用户点击 dock bar 展开按钮 | 弹窗 slide-up 展开 |
| 用户在输入框 focus 且有历史消息 | 自动展开弹窗 |
| 用户发送消息 | 自动展开弹窗（如未展开） |
| 用户点击折叠按钮 | 弹窗 slide-down 折叠 |
| 用户按 Escape | 弹窗折叠 |
| 弹窗顶部拖拽条 | 拖拽调整高度 |

### 弹窗内部结构

```
┌──────────────────────────────┐
│ ═══ (拖拽条)                 │
│ 📋 Session: main:main  ▾    │  ← SessionSwitcher
├──────────────────────────────┤
│                              │
│  消息列表（滚动区域）          │
│  - MessageBubble             │
│  - StreamingIndicator        │
│                              │
├──────────────────────────────┤
│ ↓ (滚动到底部按钮)            │
└──────────────────────────────┘
```

### 场景

| 场景 | 期望行为 |
|------|---------|
| 页面加载，dock 折叠 | 只显示 dock bar，不显示弹窗，Office 视图占满 |
| 点击展开 | 弹窗 slide-up 出现在 dock bar 上方，Office 视图不被压缩 |
| 展开状态下浏览 Office | 可同时看到弹窗和 Office 视图（弹窗浮动） |
| 点击折叠或按 Escape | 弹窗 slide-down 消失 |
| 拖拽弹窗顶部调整高度 | 高度实时变化，松开后持久化到 localStorage |
| 移动端 | 弹窗宽度 100%，高度最大 50vh |

### 验收标准

- [ ] 弹窗展开时 Office 2D/3D 视图保持完整尺寸
- [ ] 弹窗展开/折叠有 slide 动画
- [ ] 拖拽调整高度正常工作，高度在 150px–60vh 范围内
- [ ] 高度偏好刷新后保留
- [ ] 发送消息时弹窗自动展开
- [ ] Escape 键折叠弹窗
- [ ] 消息列表自动滚动到底部
- [ ] 暗色主题样式正确
