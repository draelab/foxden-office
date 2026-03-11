# foxden-office — Setup & Configuration Notes

> Written by AARI, 2026-03-10. Return-to-here doc for resuming work on this project.

---

## What This Is

A fork of [ww-ai-lab/openclaw-office](https://github.com/ww-ai-lab/openclaw-office) — a 3D/2D virtual office that visualizes OpenClaw agent sessions in real time. Agents appear as characters at desks, animate when active, show tool calls, thinking indicators, etc.

**Long-term goal:** Embed this as a page in AARIportal (AP), accessible via Tailscale at `https://draemini.taile60b9d.ts.net:3001`.

**Current state (2026-03-10):**
- ✅ Local dev: running on port 3005, connected directly to gateway
- ✅ Remote (Tailscale): embedded in AARIportal as the DEN tab, accessible at `https://draemini.taile60b9d.ts.net:3001/office`

---

## Repo

- **Local path:** `/Users/draemini/Developer/foxden-office`
- **Remote:** `draelab/foxden-office` (GitHub)
- **Upstream:** `ww-ai-lab/openclaw-office`

---

## Running It

```bash
cd /Users/draemini/Developer/foxden-office
pnpm dev --port 3005
```

Access at: `http://localhost:3005` (must be `http://`, not `https://` — browser may auto-upgrade)

The dev server dies on its own sometimes. Just re-run the command. Background it if needed:
```bash
pnpm dev --port 3005 >> /tmp/foxden.log 2>&1 &
```

---

## Environment

`.env` file at project root (already created, not committed):

```env
VITE_GATEWAY_URL=ws://127.0.0.1:18789
VITE_GATEWAY_TOKEN=<gateway admin token>
```

- `VITE_GATEWAY_URL` — direct WebSocket URL to the OpenClaw gateway. Using `127.0.0.1` (IPv4) explicitly.
- `VITE_GATEWAY_TOKEN` — the gateway's admin token from `~/.openclaw/openclaw.json` → `gateway.auth.token`

---

## Changes Made to Source (from upstream)

### 1. `src/App.tsx` — Direct gateway connection

**Line:** `const proxyGatewayUrl = ...`

**Change:**
```ts
// Before (upstream):
const proxyGatewayUrl = injected?.gatewayUrl || "/gateway-ws";

// After:
const proxyGatewayUrl = injected?.gatewayUrl || import.meta.env.VITE_GATEWAY_URL || "/gateway-ws";
```

**Why:** Vite 6's custom WebSocket upgrade handler (`proxyGatewayUpgrade` in `vite.config.ts`) doesn't reliably fire for browser WS connections. With `VITE_GATEWAY_URL` set, the app connects directly to `ws://127.0.0.1:18789` instead of going through the proxy. This also means `shouldConfigureRuntimeProxy` is `false`, preventing a state race that caused the WS to be closed before it established.

**Also changed** (same file, `syncConnectionTarget` function):
```ts
// Before:
if (shouldConfigureRuntimeProxy) setConnectionReady(false);

// After:
const needsReset = shouldConfigureRuntimeProxy && preference.mode === "remote";
if (needsReset) setConnectionReady(false);
```

**Why:** Only reset `connectionReady` when switching to remote mode (where the proxy URL actually changes). For local mode, resetting it caused a race condition where the in-flight WebSocket got closed before it could establish ("closed before connection is established" error).

---

### 2. `src/gateway/ws-client.ts` — Client identity

**Lines ~199–203 (inside `sendConnect()`):**

```ts
// Before (upstream):
client: {
  id: "openclaw-control-ui",
  version: "0.1.0",
  platform: "web",
  mode: "ui",
},

// After:
client: {
  id: "cli",
  version: "0.1.0",
  platform: "web",
  mode: "cli",
},
```

**Why (critical — do not revert):**

The gateway validates `client.id` against a strict enum. `"openclaw-control-ui"` triggers `isControlUi = true` in the gateway, which requires **device identity** (cryptographic pairing between the gateway and browser). foxden-office is an external app that doesn't have this pairing.

`"cli"` is a valid gateway client ID that uses shared token auth (same as the OpenClaw CLI). `isControlUi` is `false`, so the device identity check is bypassed. `roleCanSkipDeviceIdentity("operator", sharedAuthOk=true)` returns `allow`.

**Why not `mode: "ui"` with `id: "cli"`:** The schema validates ID+mode combinations. `mode: "cli"` is consistent with `id: "cli"`.

**Why this works for AP/Tailscale too:** The device identity bypass for `"cli"` doesn't depend on `isLocalClient`. It works from any origin with a valid token.

---

### 3. `src/main.tsx` — StrictMode disabled

```tsx
// Before:
<React.StrictMode><App /></React.StrictMode>

// After:
<App />
```

**Why:** Was disabled during debugging of the double-connect issue. Not strictly necessary now that the root cause is fixed, but harmless to leave. Can be re-enabled if needed.

---

## Gateway Config (openclaw.json)

**No changes needed.** The only relevant config is:

```json
"controlUi": {
  "allowedOrigins": [
    "http://localhost:18789",
    "http://127.0.0.1:18789",
    "http://localhost:3000",
    "https://draemini.taile60b9d.ts.net"
  ]
}
```

`http://localhost:3005` was briefly added and then reverted — it wasn't the fix. The real fix was the client ID change above.

---

## How the Connection Works

```
Browser (localhost:3005)
  → ws://127.0.0.1:18789  (direct, no Vite proxy)
  → Gateway receives upgrade, sends connect.challenge
  → ws-client responds with connect request (id: "cli", token: ...)
  → Gateway: isControlUi=false → roleCanSkipDeviceIdentity("operator", true) → allow
  → hello-ok received → status: "connected"
  → health event → agents populated
  → agent events → real-time animations
```

---

## What Works

- ✅ WebSocket connects to gateway
- ✅ Agents visible in sidebar and on floor plan
- ✅ `main` agent appears at desk and animates when active (purple thinking indicator)
- ✅ Active/idle state shown in top bar
- ✅ 2D and 3D views both render
- ✅ Event timeline shows live events

## What Hasn't Been Tested Yet

- [ ] Sub-agent spawning visualization (desk characters appearing for spawned agents)
- [ ] Tool call overlays on desks

---

## Remote Setup — AARIportal (Tailscale) ✅ COMPLETE

foxden is embedded as the **DEN tab** in AARIportal, accessible at:
- Local: `http://localhost:3000/office`
- Tailscale: `https://draemini.taile60b9d.ts.net:3001/office`

### How It Works

```
Browser (anywhere via Tailscale)
  → https://draemini.taile60b9d.ts.net:3001/office  (AP serves foxden static files)
  → foxden JS detects HTTPS, constructs: wss://draemini.taile60b9d.ts.net:3001/gateway-ws
  → AP server (Nitro/H3) handles WS upgrade at /gateway-ws
  → AP proxies to: ws://host.docker.internal:18789  (OpenClaw gateway on Mac host)
  → Gateway auth: id="cli", mode="cli", token=baked-in at build time
  → hello-ok → agents populated → real-time animations
```

### Building for AP

```bash
cd /Users/draemini/Developer/foxden-office

# Build with relative proxy path (protocol auto-detected at runtime)
VITE_GATEWAY_URL=/gateway-ws \
VITE_GATEWAY_TOKEN=<gateway admin token> \
pnpm build --base /office/

# Copy dist to AP's public/office/
rm -rf "/Users/draemini/Desktop/App Dev/aariportal/crabwalk/public/office"
cp -r dist "/Users/draemini/Desktop/App Dev/aariportal/crabwalk/public/office"

# Rebuild AP Docker
cd "/Users/draemini/Desktop/App Dev/aariportal/crabwalk"
docker compose up -d --build
```

### Key App.tsx Changes for Remote Mode

**`rawGatewayUrl` → `proxyGatewayUrl` conversion:**
```ts
const rawGatewayUrl = injected?.gatewayUrl || import.meta.env.VITE_GATEWAY_URL || "/gateway-ws";
const proxyGatewayUrl = rawGatewayUrl.startsWith("/")
  ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}${rawGatewayUrl}`
  : rawGatewayUrl;
```
**Why:** Relative paths like `/gateway-ws` can't be passed to `new WebSocket()` directly. This converts them to `wss://host/gateway-ws` (or `ws://` for HTTP). Solves the Mixed Content block when served over HTTPS.

**`shouldConfigureRuntimeProxy` guard:**
```ts
const shouldConfigureRuntimeProxy = import.meta.env.DEV && rawGatewayUrl.startsWith("/");
```
**Why:** Without `import.meta.env.DEV`, production builds call Vite's runtime proxy API (a dev-only endpoint), get AP's 404 HTML back, and render it as an error.

### AP Server — WebSocket Proxy Route

File: `/Users/draemini/Desktop/App Dev/aariportal/crabwalk/server/routes/gateway-ws.ts`

```ts
import { defineWebSocketHandler } from 'h3'
import WebSocket from 'ws'

const GATEWAY_URL = process.env.CLAWDBOT_URL || 'ws://127.0.0.1:18789'

export default defineWebSocketHandler({
  open(peer) { /* create upstream WS, forward messages both ways */ },
  message(peer, message) { /* browser → gateway */ },
  close(peer) { /* clean up upstream */ },
})
```

**Required Nitro config in `vite.config.ts`:**
```ts
nitro({
  experimental: { websocket: true },
  serverDir: './server',   // ← critical: not scanned by default
  ...
})
```
`serverDir: false` is Nitro 3's default — without explicitly setting it, `server/routes/` is never compiled into the build.

### What the Gateway Bind Setting Does NOT Matter For

The gateway is bound to loopback (`127.0.0.1`). This is fine because:
- The browser makes WS connections, not Docker
- On macOS Docker Desktop, `host.docker.internal` reaches the host's loopback addresses
- No gateway bind change needed

---

## Debugging Tips

**Check gateway errors (not gateway.log — that one doesn't log WS rejections):**
```bash
tail -50 ~/.openclaw/logs/gateway.err.log | grep "ws\|closed\|connect"
```

**The error that burned the most time:**
```
reason=control ui requires device identity (use HTTPS or localhost secure context)
```
→ Client ID was `"openclaw-control-ui"`. Fix: change to `"cli"`. See section 2 above.

**Test the proxy manually:**
```bash
curl -v --max-time 3 \
  -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://127.0.0.1:18789/
# Should return 101 + connect.challenge JSON
```
