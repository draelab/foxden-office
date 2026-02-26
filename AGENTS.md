# OpenClaw Office — Agent 开发指南

本文档为 AI 编码助手（Codex、Claude、Cursor Agent 等）提供项目开发的上下文和规则。

## 项目概述

OpenClaw Office 是一个可视化监控前端，将 OpenClaw Multi-Agent 系统的 Agent 协作具象化为"数字办公室"。前端通过 WebSocket 连接 OpenClaw Gateway，消费 Agent 事件并实时渲染。

## 技术栈

- **语言：** TypeScript (ESM, strict mode)
- **UI 框架：** React 19
- **构建工具：** Vite 6
- **状态管理：** Zustand 5 + Immer
- **样式：** Tailwind CSS 4
- **2D 渲染：** SVG + CSS Animations
- **3D 渲染：** React Three Fiber (R3F) + @react-three/drei（Phase 2+）
- **图表：** Recharts
- **国际化：** i18next + react-i18next + i18next-browser-languagedetector
- **测试：** Vitest + @testing-library/react
- **实时通信：** 原生 WebSocket API

## 目录结构

```
src/
├── main.tsx              # 入口
├── App.tsx               # 根组件
├── i18n/                 # 国际化配置与翻译文件
│   ├── index.ts          # i18next 初始化
│   ├── test-setup.ts     # 测试环境 i18n 初始化
│   └── locales/{zh,en}/  # 中英文翻译 JSON（按命名空间拆分）
├── gateway/              # Gateway 通信层（WS 客户端、RPC、事件解析）
├── store/                # Zustand 状态管理（Agent 状态、指标聚合）
├── components/
│   ├── layout/           # 页面布局
│   ├── office-2d/        # 2D SVG 平面图组件
│   ├── office-3d/        # 3D R3F 场景组件
│   ├── overlays/         # HTML Overlay（气泡、面板）
│   ├── panels/           # 侧边/弹窗面板
│   └── shared/           # 公共组件（含 LanguageSwitcher）
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具函数库
└── styles/               # 全局样式
```

## 开发命令

```bash
pnpm install              # 安装依赖
pnpm dev                  # 启动开发服务器 (port 5180)
pnpm build                # 构建生产版本
pnpm test                 # 运行测试
pnpm test:watch           # 测试 watch 模式
pnpm typecheck            # TypeScript 类型检查
pnpm lint                 # Oxlint 检查
pnpm format               # Oxfmt 格式化
pnpm check                # lint + format 检查
```

## 测试启动（每次 UI 测试前必读）

```bash
# 启动前端 dev server（自动清理旧进程、固定端口 5180）
bash scripts/dev-test.sh

# 单元测试
pnpm test

# 类型检查
pnpm typecheck
```

- 脚本 `scripts/dev-test.sh` 会自动杀掉占用 5180 端口的旧进程后再启动
- 浏览器验证地址: `http://localhost:5180`
- 每次 UI 交互验证前，先执行 `bash scripts/dev-test.sh` 确保 dev server 干净启动

## 编码规范

- TypeScript strict 模式，**不用 `any`**
- 文件不超过 500 行，超过则拆分
- 组件命名 PascalCase，hook 命名 useCamelCase
- 使用 Oxlint + Oxfmt 规范（与 OpenClaw 主项目一致）
- 不添加 `@ts-nocheck`
- 注释仅用于解释非显而易见的逻辑，不做代码叙述

## OpenClaw Gateway 集成

### 连接

前端通过 WebSocket 连接 Gateway（默认 `ws://localhost:18789`）。

### 认证架构

本项目是纯 Web 应用，默认在浏览器中无法使用 Ed25519（Chrome 默认不支持），因此通过 Gateway token + `dangerouslyDisableDeviceAuth` 配置绕过 device identity 要求

前端以 `openclaw-control-ui` 身份连接 Gateway，请求 `operator.admin` scope。

### 认证前提配置（必须）

连接真实 Gateway 进行 Chat 等写操作（`chat.send`、`chat.abort` 等）前，必须完成以下配置：

**1. 获取 Gateway token 并写入 `.env.local`：**

```bash
# 查看当前 Gateway token
openclaw config get gateway.auth.token

# 创建 .env.local（已在 .gitignore 中，不会被提交）
cat > .env.local << 'EOF'
VITE_GATEWAY_URL=ws://localhost:18789
VITE_GATEWAY_TOKEN=<粘贴上面获取的 token>
EOF
```

**2. 启用 Gateway 的 Control UI device auth bypass：**

Gateway 2026.2.15+ 默认要求签名的 device identity 来授予 operator scopes。Web 客户端无法提供 device identity，需要配置 bypass：

```bash
openclaw config set gateway.controlUi.dangerouslyDisableDeviceAuth true
```

配置后需**重启 Gateway**使其生效。

**3. 确保 Gateway 正在运行：**

本项目不负责启动/停止 Gateway。请确保 OpenClaw Gateway 已在 `localhost:18789` 上运行（通过 macOS app、`openclaw gateway run` 或其他方式）。

### 认证流程（协议级别）

1. 建立 WebSocket 连接到 `ws://localhost:18789`
2. Gateway 发送 `connect.challenge`（含 nonce）
3. 前端发送 `connect` 请求，包含 `client.id: "openclaw-control-ui"`、`scopes: ["operator.admin"]` 和 `auth.token`
4. Gateway 验证 token，因 `dangerouslyDisableDeviceAuth=true` 跳过 device identity 检查，保留请求的 scopes
5. Gateway 返回 `hello-ok` 响应

### 事件订阅

连接后自动接收 Gateway 广播的事件：

| 事件 | 内容 |
|------|------|
| `agent` | Agent 生命周期、工具调用、文本输出、错误 |
| `presence` | 在线设备/客户端列表 |
| `health` | 系统健康快照 |
| `heartbeat` | 心跳 |

### Agent 事件 Payload 格式

```typescript
type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: "lifecycle" | "tool" | "assistant" | "error";
  ts: number;
  data: Record<string, unknown>;
  sessionKey?: string;
};
```

### Chat 协议

Chat 功能通过以下 RPC 方法和事件实现：

| 方法/事件 | 方向 | 所需 scope | 说明 |
|-----------|------|-----------|------|
| `chat.send` | RPC 请求 | `operator.write` | 发送消息，参数：`{ sessionKey, message, deliver: false, idempotencyKey }` |
| `chat.abort` | RPC 请求 | `operator.write` | 中止当前 run，参数：`{ sessionKey }` |
| `chat.history` | RPC 请求 | `operator.read` | 获取历史消息，参数：`{ sessionKey }` |
| `chat` | 事件（Gateway → 客户端） | — | 流式事件，payload 含 `{ state, runId, message }` |

Chat 事件的 `state` 取值：
- `delta` — 流式增量，`message` 是累积对象（非增量文本）
- `final` — 完成，`message` 是最终完整消息
- `error` — 错误，`errorMessage` 含错误信息
- `aborted` — 用户中止

### RPC 方法

通过 WebSocket 调用：

- `agents.list` — 获取 Agent 配置列表
- `sessions.list` — 获取会话列表
- `usage.status` — 获取用量统计
- `tools.catalog` — 获取工具目录
- `chat.send` — 发送 Chat 消息
- `chat.abort` — 中止 Chat 会话
- `chat.history` — 获取 Chat 历史

### 关键参考文件（OpenClaw 主项目）

以下文件位于 OpenClaw 主仓库（父级目录），包含 Gateway 协议和类型的权威定义：

- `src/infra/agent-events.ts` — AgentEventPayload 类型定义
- `src/gateway/protocol/schema/frames.ts` — WS 帧格式（ConnectParams 等）
- `src/gateway/server/ws-connection.ts` — WS 认证流程实现
- `src/agents/subagent-spawn.ts` — SubAgent 派生类型
- `src/agents/subagent-registry.types.ts` — SubAgent 运行记录
- `src/agents/subagent-lifecycle-events.ts` — SubAgent 生命周期状态
- `src/gateway/server-methods-list.ts` — 所有 Gateway 事件/方法名
- `src/config/types.agents.ts` — Agent 配置类型
- `src/plugins/types.ts` — Plugin API 类型

## Agent 状态映射

前端将 Gateway 事件映射为以下可视化状态：

| Gateway stream | data 关键字段 | 前端状态 | 视觉表现 |
|---------------|-------------|---------|---------|
| `lifecycle` | `phase: "start"` | `working` | 角色坐正 + 加载动画 |
| `lifecycle` | `phase: "end"` | `idle` | 回到休闲状态 |
| `tool` | `name: "xxx"` | `tool_calling` | 工具面板弹出 |
| `assistant` | `text: "..."` | `speaking` | Markdown 气泡 |
| `error` | `message: "..."` | `error` | 红色叹号标识 |

## 国际化（i18n）

项目使用 `react-i18next` + `i18next` 实现中英文双语支持。**所有用户可见的文本必须通过 i18n 翻译，禁止硬编码中文或英文字符串。**

### 目录结构

```
src/i18n/
├── index.ts                # i18next 初始化配置
├── test-setup.ts           # 测试环境专用初始化（强制 lng: 'zh'）
└── locales/
    ├── zh/                 # 中文翻译
    │   ├── common.json     # 通用：状态、错误、时间、zones
    │   ├── layout.json     # 布局：TopBar、Sidebar、ConsoleNav
    │   ├── office.json     # Office 场景：加载文案、场景标签
    │   ├── panels.json     # 面板：指标、Agent 详情、图表
    │   ├── chat.json       # Chat：对话栏、消息
    │   └── console.json    # 控制台：Dashboard/Channels/Skills/Cron/Settings
    └── en/                 # 英文翻译（结构与 zh/ 镜像）
```

### 关键规则

1. **React 组件中**：使用 `useTranslation(namespace)` hook + `t("key")` 访问翻译
2. **非 React 文件中**（store、gateway、lib）：使用 `import i18n from "@/i18n"; i18n.t("namespace:key")`
3. **命名空间选择**：根据功能域选择 `common`、`layout`、`office`、`panels`、`chat`、`console`
4. **翻译文件格式**：中英文 JSON 文件必须保持 key 结构完全一致
5. **新增文本时**：同时在 `zh/` 和 `en/` 对应的 JSON 文件中添加翻译
6. **测试环境**：`src/i18n/test-setup.ts` 已在 `tests/setup.ts` 中全局引入，测试默认使用中文
7. **语言切换**：通过 `LanguageSwitcher` 组件实现，语言偏好存储在 `localStorage`（key: `i18nextLng`）
8. **不由 i18n 管理**：技术标识符（Agent ID、事件名）、CSS 类名、import 路径、`console.log` 等

### 示例

```tsx
// React 组件
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("panels");
  return <h1>{t("metrics.activeAgents")}</h1>;
}
```

```ts
// 非 React 文件（store / lib / gateway）
import i18n from "@/i18n";
const label = i18n.t("common:errors.notConnected");
```

## Mock 模式

设置环境变量 `VITE_MOCK=true` 可在不连接 Gateway 的情况下使用模拟数据开发。Mock provider 位于 `src/gateway/mock-provider.ts`。

## 测试要求

- `store/` 和 `gateway/event-parser.ts` **必须**有单元测试
- 组件使用 `@testing-library/react` 测试关键交互
- 不要求高覆盖率，但关键数据流必须有测试

## Git 约定

- 提交信息使用 Conventional Commits 格式（中英均可）
- 不提交 `.env` 文件、node_modules、dist 目录
