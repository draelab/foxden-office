## Why

OpenClaw Office 当前所有 UI 文本（状态标签、按钮文案、占位符、错误提示等约 120–150 条）以中文硬编码散落在 35+ 个组件/工具文件中。这导致：

1. **国际化缺失**：英语用户无法使用产品；
2. **维护成本高**：修改一条文案需要定位散落在不同文件中的硬编码字符串；
3. **扩展困难**：未来若需要支持日语、韩语等语言，需逐文件改造。

现在引入 i18n 基础设施，在产品早期建立多语言架构，成本最低、收益最大。

## What Changes

- **引入 i18n 框架**：集成 `react-i18next` + `i18next`，配置语言检测与回退策略
- **创建翻译资源文件**：按命名空间组织 `zh` / `en` 两套 JSON 翻译文件
- **提取硬编码文本**：将 35+ 个源文件中的约 120–150 条硬编码中英文文本替换为 `t()` 调用
- **语言切换 UI**：在 TopBar 右上角添加语言切换按钮，支持 zh ↔ en 实时切换
- **语言偏好持久化**：通过 `localStorage` 保存用户语言选择，页面刷新后自动恢复
- **可扩展架构**：翻译文件按命名空间拆分，未来添加新语言仅需新增 JSON 文件即可

## Capabilities

### New Capabilities

- `i18n-framework`: i18n 基础设施搭建 —— i18next 初始化、Provider 配置、语言检测与回退策略、翻译资源加载
- `i18n-locale-files`: 翻译资源文件管理 —— 按命名空间拆分的 zh/en JSON 翻译文件，覆盖所有 UI 文本
- `i18n-language-switcher`: 语言切换组件 —— TopBar 右上角的语言切换按钮，支持实时切换与偏好持久化
- `i18n-string-extraction`: 硬编码文本提取 —— 将现有 35+ 个文件中的硬编码文本替换为 t() 调用

### Modified Capabilities

- `main-layout`: TopBar 新增语言切换按钮区域，调整右侧布局适配新控件
- `office-store`: 新增 `locale` 状态字段与 `setLocale` action，用于驱动语言切换

## Impact

- **依赖新增**：`i18next`、`react-i18next`（运行时依赖）
- **新增文件**：`src/i18n/` 目录（配置 + 翻译资源 JSON）、`src/components/shared/LanguageSwitcher.tsx`
- **修改文件**：约 35 个组件/工具文件（提取硬编码文本）、`main.tsx`（挂载 i18n Provider）、`TopBar.tsx`（嵌入切换按钮）、`office-store.ts`（新增 locale 字段）
- **测试影响**：现有测试中包含硬编码中文断言的需同步更新；新增 i18n 配置与 LanguageSwitcher 组件测试
- **无 Breaking Change**：默认语言为中文，现有用户体验不变
