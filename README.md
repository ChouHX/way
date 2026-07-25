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

## 后台访问控制

使用 Cloudflare Access 保护以下路径：

```text
/admin*
/api/admin*
```

设置管理员邮箱白名单：

```bash
npx wrangler secret put ADMIN_EMAILS
```

在 Zero Trust 的 Access Application 中，为对应邮箱配置 Allow Policy。生产环境依赖 Cloudflare Access 注入的身份信息；`.dev.vars` 中的本地管理员变量仅适用于 `wrangler dev`。

## GitHub 构建部署

在 Cloudflare Workers 中连接 GitHub 仓库后，使用：

```text
Build command: pnpm cf:build
Deploy command: pnpm exec opennextjs-cloudflare deploy
```
