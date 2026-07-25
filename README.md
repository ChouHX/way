# 永盛罚单／移民咨询中心

Next.js 14（App Router）企业展示站，包含中英双语、响应式页面、案例展示、联系表单，以及 Cloudflare D1 图片配置接口。

## 本地运行

```bash
pnpm install
pnpm dev
```

## Cloudflare D1

项目包含独立的 D1 API Worker：`worker/src/index.ts`，D1 表结构位于 `schema.sql`。

```bash
npx wrangler login
npx wrangler d1 create ticket-consulting
```

将命令返回的数据库 ID 填入 `wrangler.toml` 的 `database_id`，再执行：

```bash
npx wrangler d1 execute ticket-consulting --remote --file=./schema.sql
npx wrangler deploy
```

部署后，Worker 提供：

```text
GET /api/assets?section=hero
GET /api/assets?section=case-study
```

## GitHub 与 Cloudflare 部署

推送本仓库后，可在 Cloudflare Dashboard 中创建 Workers 或 Pages 项目，并连接 GitHub 仓库 `ChouHX/way`。建议将 Next.js 前端与 D1 API Worker 分开部署：

1. 连接 GitHub 仓库，并配置前端的 Next.js / OpenNext Cloudflare 构建流程。
2. 使用本仓库的 `wrangler.toml` 部署 D1 API Worker，并在 Cloudflare 控制台中为它绑定 `DB`。
3. 将前端的动态资源请求指向已部署 Worker 的 `/api/assets` 地址，或在 OpenNext Worker 中使用同名 `DB` 绑定。

> `database_id` 属于部署配置，不应提交真实数据库 ID 或任何密钥。
