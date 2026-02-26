## ADDED Requirements

### Requirement: 翻译资源文件结构

系统 SHALL 在 `src/i18n/locales/` 下以 `{lang}/{namespace}.json` 结构组织翻译资源。

#### Scenario: 目录结构

- **WHEN** 查看 `src/i18n/locales/` 目录
- **THEN** SHALL 包含以下结构：
  - `zh/common.json`, `zh/layout.json`, `zh/office.json`, `zh/panels.json`, `zh/chat.json`, `zh/console.json`
  - `en/common.json`, `en/layout.json`, `en/office.json`, `en/panels.json`, `en/chat.json`, `en/console.json`

#### Scenario: 命名空间覆盖范围

- **WHEN** 检查每个命名空间的覆盖范围
- **THEN** SHALL 满足以下对应关系：
  - `common`：通用文本（连接状态、通用操作按钮如发送/取消、通用空态提示、时间格式化模板）
  - `layout`：TopBar、Sidebar、ActionBar、ConsoleLayout 中的 UI 文本
  - `office`：2D/3D 办公室场景中的区域名称、加载提示等
  - `panels`：侧边面板（MetricsPanel、AgentDetailPanel、SubAgentPanel、EventTimeline、图表组件等）
  - `chat`：ChatDockBar、ChatTimelineDrawer、MessageBubble 中的文本
  - `console`：控制台各页面（Dashboard/Channels/Skills/Cron/Settings）中的文本

### Requirement: 翻译 key 命名规范

翻译 key SHALL 使用 `section.descriptiveKey` 扁平化点号分隔结构，跨命名空间引用使用 `namespace:key` 格式。

#### Scenario: key 命名示例

- **WHEN** 为 TopBar 连接状态文本定义翻译 key
- **THEN** SHALL 使用如 `topbar.status.connected`（命名空间 `layout`），完整引用为 `layout:topbar.status.connected`

#### Scenario: 通用操作 key 复用

- **WHEN** 多个组件使用相同的操作按钮文案（如"取消"、"发送"）
- **THEN** SHALL 使用 `common` 命名空间中的统一 key（如 `common:actions.send`），避免重复定义

### Requirement: 中英文翻译完整对应

每个中文翻译 key SHALL 在英文翻译文件中有对应条目，且语义准确。

#### Scenario: 翻译完整性

- **WHEN** 比较 `zh/{namespace}.json` 和 `en/{namespace}.json` 的 key 集合
- **THEN** 两者 SHALL 拥有完全相同的 key 集合，无遗漏

#### Scenario: 连接状态翻译

- **WHEN** 查看连接状态的翻译
- **THEN** SHALL 包含以下对应：
  - `connecting` → 中文 "连接中..." / 英文 "Connecting..."
  - `connected` → 中文 "已连接" / 英文 "Connected"
  - `reconnecting` → 中文 "重连中" / 英文 "Reconnecting"
  - `disconnected` → 中文 "未连接" / 英文 "Disconnected"
  - `error` → 中文 "连接错误" / 英文 "Connection Error"

### Requirement: 动态插值支持

翻译文本中的动态值 SHALL 使用 i18next 插值语法 `{{variable}}`。

#### Scenario: Agent 活跃计数插值

- **WHEN** TopBar 显示活跃 Agent 数
- **THEN** SHALL 使用插值 key，如 `layout:topbar.activeCount`，值为 `"活跃 {{active}}/{{total}}"` (zh) / `"Active {{active}}/{{total}}"` (en)

#### Scenario: Token 计数插值

- **WHEN** TopBar 显示 Token 总量
- **THEN** SHALL 使用插值 key，如 `layout:topbar.tokens`，值为 `"Tokens {{count}}"` (zh/en)

#### Scenario: 时间相对格式插值

- **WHEN** 显示相对时间（如 "3秒前"）
- **THEN** SHALL 使用插值 key，如 `common:time.secondsAgo`，值为 `"{{count}}秒前"` (zh) / `"{{count}}s ago"` (en)
