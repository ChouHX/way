# 永盛罚单／移民咨询中心

Next.js 15（App Router）企业展示站，包含中英双语、响应式页面、案例展示、联系表单，以及 Cloudflare D1 图片配置接口。

## 本地运行

```bash
pnpm install
pnpm dev
```

`pnpm dev` 适合纯前端视觉开发；它并不模拟 Worker 的 D1 绑定。需要测试 API、D1 与 Edge Runtime 时，请使用下面的 Worker 预览流程。

## 本地与远端 D1 联调

D1 的本地模式是独立 SQLite 文件，**不会自动与云端双向同步**。推荐把它作为快速、无风险的开发数据库；需要验证真实数据或 Cloudflare Access 时再使用独立的 preview D1 数据库。

```bash
# 首次创建本地 D1 表（数据在 .wrangler/，不会提交到 Git）
pnpm d1:local:setup

# 复制本地 Worker 变量模板（仅用于 wrangler dev）
Copy-Item .dev.vars.example .dev.vars

# 构建并以本地 D1 运行完整 Worker
pnpm cf:preview
```

`.dev.vars.example` 已包含仅限本地的 `LOCAL_ADMIN_EMAIL`，因此可直接测试 `/admin`。它只会在 `APP_ENV=development` 时启用；生产环境不要设置这两个变量，继续使用 Cloudflare Access 的登录邮箱。

将 schema 应用到云端数据库时：

```bash
pnpm d1:remote:migrate
```

若要让本地预览直接访问云端绑定（读写会影响真实数据），运行：

```bash
pnpm cf:preview:remote
```

生产环境不要把开发机直连到生产 D1。建议额外创建 `ticket-consulting-preview`，在 preview Worker 的 `wrangler.preview.toml` 里绑定它；这样本地 `--remote`、Git 分支预览与生产数据库完全隔离。表结构更新建议改用版本化 SQL migration，再按 preview → production 的顺序执行。

## Cloudflare D1

项目部署为单个 OpenNext Cloudflare Worker，D1 表结构位于 `schema.sql`。

```bash
npx wrangler login
npx wrangler d1 create ticket-consulting
```

将命令返回的数据库 ID 填入 `wrangler.toml` 的 `database_id`，再执行：

```bash
npx wrangler d1 execute ticket-consulting --remote --file=./schema.sql
pnpm cf:deploy
```

部署后，Worker 提供：

```text
GET /api/assets?section=hero
GET /api/assets?section=case-study
```

## 管理后台与访问控制

后台地址为 `/admin`，可以管理中英文站点标题、案例分类与案例内容。后台 API 需要 Cloudflare Access 身份验证，并通过 `ADMIN_EMAILS` 二次校验邮箱白名单：

```bash
npx wrangler secret put ADMIN_EMAILS
# 输入：admin@example.com,operations@example.com
```

在 Cloudflare Zero Trust 中创建 Access Application，保护以下路径：

```text
/admin*
/api/admin*
```

将允许规则配置为对应管理员邮箱。`ADMIN_EMAILS` 可以随时更新，无需修改代码。

## GitHub 与 Cloudflare 部署

推送本仓库后，可在 Cloudflare Dashboard 中创建 Worker，并连接 GitHub 仓库 `ChouHX/way`。

1. 在 Cloudflare Workers 中选择 **Connect to Git**，选择 `ChouHX/way` 和 `main`。
2. 构建命令设为 `pnpm install --frozen-lockfile && pnpm cf:build`。
3. 部署命令设为 `pnpm opennextjs-cloudflare deploy`。
4. 在 Worker 设置中绑定 D1 数据库为 `DB`，并创建 `ADMIN_EMAILS` Secret。
5. 在 Zero Trust 中为 `/admin*` 和 `/api/admin*` 配置 Cloudflare Access。

> `database_id` 属于部署配置，不应提交真实数据库 ID 或任何密钥。
