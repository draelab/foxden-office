## 1. 基础设施搭建

- [x] 1.1 安装依赖：`pnpm add i18next react-i18next i18next-browser-languagedetector`
- [x] 1.2 创建 `src/i18n/index.ts`：初始化 i18next 实例，配置 `react-i18next`、`browser-languagedetector`、回退策略（`fallbackLng: 'zh'`）、命名空间列表和资源加载
- [x] 1.3 在 `src/main.tsx` 中引入 `src/i18n/index.ts`，确保 i18n 在 React 渲染前完成初始化

## 2. 翻译资源文件创建

- [x] 2.1 创建 `src/i18n/locales/zh/common.json`：通用文本（连接状态、通用按钮、时间格式、空态提示）
- [x] 2.2 创建 `src/i18n/locales/zh/layout.json`：TopBar、Sidebar、ActionBar、ConsoleLayout 文本
- [x] 2.3 创建 `src/i18n/locales/zh/office.json`：2D/3D 场景区域名称、加载提示
- [x] 2.4 创建 `src/i18n/locales/zh/panels.json`：MetricsPanel、AgentDetailPanel、SubAgentPanel、EventTimeline、图表组件文本
- [x] 2.5 创建 `src/i18n/locales/zh/chat.json`：ChatDockBar、ChatTimelineDrawer、AgentSelector、对话框、上下文菜单文本
- [x] 2.6 创建 `src/i18n/locales/zh/console.json`：Dashboard/Channels/Skills/Cron/Settings 页面文本及 viewModels 相关翻译
- [x] 2.7 创建 `src/i18n/locales/en/common.json`：对应中文 common 的英文翻译
- [x] 2.8 创建 `src/i18n/locales/en/layout.json`：对应中文 layout 的英文翻译
- [x] 2.9 创建 `src/i18n/locales/en/office.json`：对应中文 office 的英文翻译
- [x] 2.10 创建 `src/i18n/locales/en/panels.json`：对应中文 panels 的英文翻译
- [x] 2.11 创建 `src/i18n/locales/en/chat.json`：对应中文 chat 的英文翻译
- [x] 2.12 创建 `src/i18n/locales/en/console.json`：对应中文 console 的英文翻译

## 3. LanguageSwitcher 组件

- [x] 3.1 创建 `src/components/shared/LanguageSwitcher.tsx`：紧凑按钮式语言切换组件，显示当前语言标识（"中文"/"EN"），调用 `i18next.changeLanguage()` 切换
- [x] 3.2 在 `TopBar.tsx` 中引入 LanguageSwitcher，放置于 ThemeToggle 之后
- [x] 3.3 为 LanguageSwitcher 添加 `aria-label`（根据当前语言显示 "切换到英文" / "Switch to Chinese"）

## 4. 硬编码文本提取 — Layout 组件

- [x] 4.1 改造 `TopBar.tsx`：将 STATUS_CONFIG、PAGE_TITLES、tooltip 文案、指标文案（含 "Tokens"）等替换为 `t()` 调用
- [x] 4.2 改造 `Sidebar.tsx`：将过滤器标签、搜索占位符、面板标题、空态提示、时间格式等替换为 `t()` 调用
- [x] 4.3 改造 `ActionBar.tsx`：将操作按钮文案、权限提示、状态文案替换为 `t()` 调用
- [x] 4.4 改造 `AppShell.tsx`：将 aria-label 文本替换为 `t()` 调用
- [x] 4.5 改造 `ConsoleLayout.tsx`：将导航项标签替换为 `t()` 调用

## 5. 硬编码文本提取 — Panel 组件

- [x] 5.1 改造 `MetricsPanel.tsx`：将 Tab 标签和 cards 标签（Active Agents、Total Tokens、Collaboration、Token Rate）替换为 `t()` 调用
- [x] 5.2 改造 `CostPieChart.tsx`：将空态文案替换为 `t()` 调用
- [x] 5.3 改造 `AgentDetailPanel.tsx`：将面板标题、操作文案替换为 `t()` 调用
- [x] 5.4 改造 `SubAgentPanel.tsx`：将空态文案、运行时间格式替换为 `t()` 调用
- [x] 5.5 改造 `EventTimeline.tsx`：将空态文案、新事件提示替换为 `t()` 调用
- [x] 5.6 改造 `ActivityHeatmap.tsx`（tooltip events 文案）、`NetworkGraph.tsx`、`TokenLineChart.tsx`：将空态/标签文案替换为 `t()` 调用

## 6. 硬编码文本提取 — Chat 与 Overlay 组件

- [x] 6.1 改造 `ChatDockBar.tsx`：将输入占位符、操作按钮、提示文本替换为 `t()` 调用
- [x] 6.2 改造 `ChatTimelineDrawer.tsx`：将新对话按钮、思考提示替换为 `t()` 调用
- [x] 6.3 改造 `AgentSelector.tsx`：将缺省标签 "Agent" 替换为 `t()` 调用

## 7. 硬编码文本提取 — Page 与工具层

- [x] 7.1 改造 `DashboardPage.tsx`、`ChannelsPage.tsx`、`SkillsPage.tsx`、`CronPage.tsx`、`SettingsPage.tsx`：将标题、描述、空态提示替换为 `t()` 调用
- [x] 7.2 改造 `src/lib/constants.ts`：添加 `getZoneLabel()` 和 `getStatusLabel()` 函数，使用 `i18n.t()` 返回翻译文本
- [x] 7.3 改造 `src/lib/view-models.ts`：将连接状态文案、频率格式化文本、技能来源标签替换为 `i18n.t()` 调用
- [x] 7.4 改造 `src/gateway/event-parser.ts`：将所有事件摘要文本（含 unknown stream、lifecycle unknown）替换为 `i18n.t()` 调用
- [x] 7.5 改造 `src/gateway/force-action-rpc.ts`：将错误提示文案替换为 `i18n.t()` 调用
- [x] 7.6 改造 `src/store/console-stores/chat-dock-store.ts`：将错误提示替换为 `i18n.t()` 调用
- [x] 7.7 改造 `src/App.tsx`：将 3D 加载提示替换为 `t()` 调用

## 8. 2D/3D 场景组件 i18n

- [x] 8.1 改造 `AgentDot.tsx`（2D）：STATUS_LABELS → `t("common:agent.statusLabels.${status}")`
- [x] 8.2 改造 `AgentCharacter.tsx`（3D）：STATUS_LABELS → `t("common:agent.statusLabels.${status}")`
- [x] 8.3 改造 `ZoneLabel.tsx`（2D）：接收 `zoneKey` prop，使用 `t("zones.${zoneKey}")` 显示区域标签
- [x] 8.4 改造 `OfficeLayout3D.tsx`（3D）：使用 `t("zones.desk")` 等翻译区域标签

## 9. 测试

- [x] 9.1 创建 `src/i18n/__tests__/i18n-setup.test.ts`：测试 i18next 初始化、命名空间加载、语言回退
- [x] 9.2 创建 `src/components/shared/__tests__/LanguageSwitcher.test.tsx`：测试语言切换行为、按钮显示、aria-label
- [x] 9.3 创建 `src/i18n/test-setup.ts`：测试环境的 i18n 简化配置（`lng: 'zh'`），供其他测试文件复用
- [x] 9.4 更新现有测试文件，在测试环境中初始化 i18n（确保 `t()` 调用不报错），验证中文断言仍通过

## 10. 验证与收尾

- [x] 10.1 运行 `pnpm typecheck` 确认无类型错误
- [x] 10.2 运行 `pnpm test` 确认所有测试通过（26 个文件、158 个测试全部通过）
- [x] 10.3 运行 `pnpm build` 确认生产构建正常
- [x] 10.4 搜索残留的硬编码文本，确认仅剩 mock 数据和注释
- [x] 10.5 更新 AGENTS.md 加入 i18n 开发规范
