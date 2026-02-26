## ADDED Requirements

### Requirement: LanguageSwitcher 组件

系统 SHALL 提供 `LanguageSwitcher` 组件（`src/components/shared/LanguageSwitcher.tsx`），用于在界面上切换语言。

#### Scenario: 组件渲染

- **WHEN** LanguageSwitcher 组件渲染
- **THEN** SHALL 显示一个紧凑按钮，显示当前未激活语言的标识（当前为中文时显示 "EN"，当前为英文时显示 "中"），引导用户点击切换到另一种语言

#### Scenario: 视觉样式

- **WHEN** LanguageSwitcher 渲染
- **THEN** SHALL 使用与 TopBar 中 ThemeToggle 一致的按钮尺寸和样式风格（`rounded-md`, `p-1.5` 等），确保视觉协调

### Requirement: 语言切换行为

LanguageSwitcher SHALL 在用户点击时立即切换应用语言，无需二次确认。

#### Scenario: 从中文切换到英文

- **WHEN** 当前语言为 `zh`，用户点击 LanguageSwitcher
- **THEN** i18next SHALL 立即调用 `changeLanguage('en')`，所有使用 `useTranslation` 的组件 SHALL 自动重渲染为英文文本，按钮显示变为 "中"

#### Scenario: 从英文切换到中文

- **WHEN** 当前语言为 `en`，用户点击 LanguageSwitcher
- **THEN** i18next SHALL 立即调用 `changeLanguage('zh')`，所有组件自动重渲染为中文文本，按钮显示变为 "EN"

### Requirement: 语言偏好持久化

语言切换后 SHALL 自动持久化到 localStorage，页面刷新后恢复。

#### Scenario: 切换后持久化

- **WHEN** 用户切换语言
- **THEN** `i18next-browser-languagedetector` SHALL 自动将新语言值保存到 `localStorage` 的 `i18nextLng` key

#### Scenario: 页面刷新后恢复

- **WHEN** 用户刷新页面
- **THEN** 应用 SHALL 从 `localStorage` 读取 `i18nextLng` 值，恢复到用户上次选择的语言

### Requirement: TopBar 中的放置位置

LanguageSwitcher SHALL 放置在 TopBar 右侧区域，位于 ThemeToggle 之后、ConnectionIndicator 之前。

#### Scenario: Office 模式下位置

- **WHEN** 当前路由为 Office 视图
- **THEN** TopBar 右侧区域 SHALL 按以下顺序排列：ViewModeSwitch → ThemeToggle → LanguageSwitcher → ConsoleMenu → ConnectionIndicator

#### Scenario: Console 模式下位置

- **WHEN** 当前路由为管控页面
- **THEN** TopBar 右侧区域 SHALL 按以下顺序排列：LanguageSwitcher → ConsoleMenu → ConnectionIndicator

### Requirement: 无障碍性

LanguageSwitcher SHALL 具备合理的无障碍属性。

#### Scenario: aria-label 标注

- **WHEN** LanguageSwitcher 渲染
- **THEN** 按钮 SHALL 包含 `aria-label`，内容为当前语言下的 "切换到英文" / "Switch to Chinese" 等描述性文本

#### Scenario: 键盘可操作

- **WHEN** 用户通过 Tab 键聚焦到 LanguageSwitcher 并按下 Enter 或 Space
- **THEN** SHALL 触发语言切换，行为与鼠标点击一致
