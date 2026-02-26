## ADDED Requirements

### Requirement: Store 不维护 locale 状态

office-store SHALL NOT 新增 locale 相关状态字段。语言状态由 i18next 实例独立管理。

#### Scenario: 语言切换不经过 Zustand

- **WHEN** 用户切换语言
- **THEN** 语言变更 SHALL 直接通过 `i18next.changeLanguage()` 完成，不经过 office-store 的 action 或 state
- **THEN** i18next-browser-languagedetector 负责将语言偏好持久化到 localStorage

#### Scenario: office-store 现有字段不受影响

- **WHEN** 引入 i18n 框架后
- **THEN** office-store 中现有的 `agents`、`connectionStatus`、`viewMode`、`theme`、`currentPage` 等字段及其 action SHALL 保持不变，无新增、无修改
