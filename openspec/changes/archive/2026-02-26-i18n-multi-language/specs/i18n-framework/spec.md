## ADDED Requirements

### Requirement: i18next 初始化配置

系统 SHALL 在 `src/i18n/index.ts` 中初始化 i18next 实例，配置语言检测、回退策略和翻译资源加载。

#### Scenario: i18next 实例初始化

- **WHEN** 应用启动时（`main.tsx` 执行）
- **THEN** i18next SHALL 完成以下配置：
  - 使用 `react-i18next` 的 `initReactI18next` 插件
  - 使用 `i18next-browser-languagedetector` 插件进行语言自动检测
  - 设置 `fallbackLng: 'zh'`（回退语言为中文）
  - 设置 `supportedLngs: ['zh', 'en']`
  - 设置 `ns`（命名空间）为 `['common', 'layout', 'office', 'panels', 'chat', 'console']`
  - 设置 `defaultNS: 'common'`
  - 设置 `interpolation.escapeValue: false`（React 已自行处理 XSS）

#### Scenario: 语言检测优先级

- **WHEN** 用户首次访问应用
- **THEN** i18next SHALL 按以下优先级检测语言：
  1. `localStorage` 中 `i18nextLng` 的值
  2. 浏览器 `navigator.language`
  3. 回退到 `zh`

#### Scenario: 不支持的语言回退

- **WHEN** 浏览器语言为不支持的语言（如 `ja`、`ko`）
- **THEN** i18next SHALL 回退到 `zh`（中文），应用正常渲染中文界面

### Requirement: React I18nextProvider 挂载

系统 SHALL 在 React 组件树根部挂载 `I18nextProvider`，使所有子组件可通过 `useTranslation` hook 访问翻译功能。

#### Scenario: Provider 挂载位置

- **WHEN** `main.tsx` 渲染根组件
- **THEN** `I18nextProvider`（或等效的 i18next `initReactI18next` 初始化）SHALL 在 `HashRouter` 之前或同级完成初始化，确保路由组件渲染时 i18n 已就绪

#### Scenario: useTranslation hook 可用

- **WHEN** 任意组件调用 `useTranslation()` 或 `useTranslation('layout')` 等带命名空间的变体
- **THEN** SHALL 返回 `{ t, i18n }` 对象，`t` 函数可正确解析翻译 key，`i18n` 可访问当前语言和切换方法

### Requirement: 翻译资源同步加载

系统 SHALL 以同步方式（inline import）加载翻译资源，避免异步加载导致的 UI 闪烁。

#### Scenario: 翻译资源内联

- **WHEN** i18next 初始化
- **THEN** 所有翻译 JSON SHALL 通过 ES import 同步加载并传入 `resources` 配置，而非使用 `i18next-http-backend` 异步加载

#### Scenario: 无加载闪烁

- **WHEN** 应用首次渲染
- **THEN** 所有 UI 文本 SHALL 立即显示对应语言的翻译，不出现翻译 key 原文或空白闪烁
