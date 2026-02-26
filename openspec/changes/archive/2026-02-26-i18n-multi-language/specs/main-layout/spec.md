## MODIFIED Requirements

### Requirement: TopBar 双模式适配

系统 SHALL 使 TopBar 根据当前路由上下文显示不同内容。

#### Scenario: Office 模式下 TopBar

- **WHEN** 当前路由为 `/`（Office 视图）
- **THEN** TopBar SHALL 显示：应用标题 "OpenClaw Office"、2D/3D 视图切换、主题切换、**语言切换（LanguageSwitcher）**、Agent 活跃指标（活跃/总数、Tokens）、「控制台」菜单、连接状态。右侧控件排列顺序为：ViewModeSwitch → ThemeToggle → **LanguageSwitcher** → ConsoleMenu → ConnectionIndicator

#### Scenario: Console 模式下 TopBar

- **WHEN** 当前路由为管控页面（`/dashboard`、`/channels` 等）
- **THEN** TopBar SHALL 显示：左侧为当前页面标题、右侧为 **LanguageSwitcher**、「← Office」返回按钮和连接状态。SHALL NOT 显示 2D/3D 切换、Agent 指标和下拉菜单

#### Scenario: TopBar 所有文本国际化

- **WHEN** TopBar 渲染
- **THEN** 所有 UI 文本（连接状态标签、页面标题、按钮文案、tooltip 文字等）SHALL 通过 `useTranslation` 的 `t()` 函数获取，不使用硬编码字符串
