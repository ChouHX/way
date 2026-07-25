[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ChouHX/way)

## 本地运行

```bash
pnpm install
pnpm dev
```

`pnpm dev` 不模拟 Worker 的 D1 绑定。需要测试 API、D1 与 Worker Runtime 时，请使用下面的预览流程。

## 本地与远端 D1 联调

本地模式使用独立的 SQLite 数据库，不会自动与云端数据库双向同步。

```bash
# 首次建立本地表结构
pnpm d1:local:setup

# 创建仅用于本地 Worker 的变量文件
Copy-Item .dev.vars.example .dev.vars

# 使用本地 D1 运行完整 Worker
pnpm cf:preview
```

将 schema 应用到远端 D1：

```bash
pnpm d1:remote:migrate
```

如需从本地预览直接读写远端绑定：

```bash
pnpm cf:preview:remote
```

建议创建独立的 preview D1 数据库，避免开发调试时修改生产数据。

## 数据库与部署

```bash
npx wrangler login
npx wrangler d1 create ticket-consulting
pnpm d1:remote:migrate
pnpm cf:deploy
```

## 后台登录

为 Worker 设置后台登录密码：

```bash
npx wrangler secret put ADMIN_PASSWORD
```

输入一个长度至少 16 位、未在其他服务复用的高强度密码。后台登录成功后将使用有效期 8 小时的 HttpOnly 签名 Cookie；修改 Secret 会使所有既有登录失效。

## GitHub 构建部署

在 Cloudflare Workers 中连接 GitHub 仓库后，使用：

```text
Build command: pnpm cf:build
Deploy command: pnpm exec opennextjs-cloudflare deploy
```
