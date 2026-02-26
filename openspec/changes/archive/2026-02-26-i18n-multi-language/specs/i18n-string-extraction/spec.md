## ADDED Requirements

### Requirement: 硬编码文本提取为 t() 调用

所有用户可见的 UI 硬编码文本 SHALL 替换为 `useTranslation` hook 的 `t()` 函数调用。

#### Scenario: 组件中的静态文本

- **WHEN** 组件中存在硬编码的中文或英文 UI 文本（如 `"已连接"`、`"Dashboard"`）
- **THEN** SHALL 替换为 `t('namespace:key')` 调用，对应翻译 key 在 zh/en JSON 文件中有正确值

#### Scenario: 组件外的常量对象

- **WHEN** 文件中存在组件外定义的常量对象包含 UI 文本（如 `STATUS_CONFIG`、`PAGE_TITLES`）
- **THEN** SHALL 将常量对象改造为函数或在组件内通过 `t()` 获取文本，不在模块顶层调用 `t()`（i18next 在模块加载时可能尚未初始化）

#### Scenario: aria-label 和 title 属性

- **WHEN** HTML 元素包含硬编码的 `aria-label`、`title`、`placeholder` 属性
- **THEN** SHALL 同样替换为 `t()` 调用

### Requirement: 提取覆盖范围

硬编码文本提取 SHALL 覆盖以下所有文件类别。

#### Scenario: Layout 组件提取

- **WHEN** 检查 `src/components/layout/` 下的组件
- **THEN** 以下文件中的硬编码文本 SHALL 已全部提取：
  - `TopBar.tsx`（连接状态、页面标题、视图切换提示、主题切换提示、指标文案）
  - `Sidebar.tsx`（过滤器标签、搜索占位符、空态提示、时间格式、面板标题）
  - `ActionBar.tsx`（操作按钮文案、权限提示）
  - `AppShell.tsx`（aria-label 文本）
  - `ConsoleLayout.tsx`（导航项标签）

#### Scenario: Panel 组件提取

- **WHEN** 检查 `src/components/panels/` 下的组件
- **THEN** 以下文件中的硬编码文本 SHALL 已全部提取：
  - `MetricsPanel.tsx`（Tab 标签）
  - `CostPieChart.tsx`（空态文案）
  - `AgentDetailPanel.tsx`（面板标题、操作文案）
  - `SubAgentPanel.tsx`（空态文案、运行时间格式）
  - `EventTimeline.tsx`（空态文案、新事件提示）
  - `ActivityHeatmap.tsx`、`NetworkGraph.tsx`、`TokenLineChart.tsx`（空态/标签文案）

#### Scenario: Chat 组件提取

- **WHEN** 检查 `src/components/chat/` 下的组件
- **THEN** 以下文件中的硬编码文本 SHALL 已全部提取：
  - `ChatDockBar.tsx`（输入占位符、操作按钮文案、提示文本）
  - `ChatTimelineDrawer.tsx`（新对话按钮、思考提示）

#### Scenario: Overlay 组件提取

- **WHEN** 检查 `src/components/overlays/` 下的组件
- **THEN** 以下文件中的硬编码文本 SHALL 已全部提取：
  - `ForceActionDialog.tsx`（对话框标题、确认提示、按钮文案）
  - `AgentContextMenu.tsx`（菜单项文案、权限提示）

#### Scenario: Page 组件提取

- **WHEN** 检查 `src/components/pages/` 下的组件
- **THEN** 所有 Console 页面（Dashboard/Channels/Skills/Cron/Settings）中的标题、描述和空态提示 SHALL 已全部提取

#### Scenario: 工具/模型层提取

- **WHEN** 检查 `src/lib/`、`src/gateway/`、`src/store/` 下的文件
- **THEN** 以下文件中的面向用户的文本 SHALL 已全部提取：
  - `src/lib/constants.ts`（区域名称、Agent 状态显示名）
  - `src/lib/view-models.ts`（连接状态文案、频率格式化）
  - `src/gateway/event-parser.ts`（事件摘要文本）
  - `src/gateway/force-action-rpc.ts`（错误提示文案）
  - `src/store/console-stores/chat-dock-store.ts`（错误提示）

### Requirement: Mock 数据排除

mock-adapter 中的模拟数据文本 SHALL NOT 进行 i18n 提取。

#### Scenario: mock-adapter 保持不变

- **WHEN** 检查 `src/gateway/mock-adapter.ts`
- **THEN** 其中的模拟对话内容、工具名称等 SHALL 保持硬编码中文，不进行翻译提取（mock 数据仅用于开发调试，不面向最终用户）

### Requirement: 非组件文件中的 t() 调用策略

在非 React 组件文件（如工具函数、store action）中需要翻译文本时，SHALL 使用 i18next 实例直接调用。

#### Scenario: 工具函数中的翻译

- **WHEN** `src/lib/constants.ts` 或 `src/gateway/event-parser.ts` 等非组件文件需要返回可翻译文本
- **THEN** SHALL 使用 `import i18n from '@/i18n'` 然后调用 `i18n.t('key')` 获取翻译值，或将翻译 key 传回组件层由组件负责调用 `t()`
