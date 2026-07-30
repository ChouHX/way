import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSession,
  createAdminSession,
  getWorkerEnv,
  requireAdminSession,
  validateAdminPassword,
} from "@/lib/cloudflare";

const json = (data: unknown, init?: ResponseInit) =>
  NextResponse.json(data, init);
const slugFor = (name: string, prefix: string) =>
  `${prefix}-${
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || crypto.randomUUID().slice(0, 8)
  }`;
const imageDataLimit = 450 * 1024;
const validImage = (value: string) =>
  !value ||
  /^https:\/\//i.test(value) ||
  (/^data:image\/(webp|jpeg|png);base64,/i.test(value) &&
    Math.ceil((value.split(",", 2)[1]?.length ?? 0) * 0.75) <= imageDataLimit);

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession(request);
    const { DB } = await getWorkerEnv();
    if (!DB)
      return json({ error: "D1 binding is unavailable" }, { status: 503 });
    const url = new URL(request.url);
    const resource = url.searchParams.get("resource") ?? "dashboard";
    if (resource === "site") {
      const { results } = await DB.prepare(
        "SELECT key,value FROM site_settings",
      ).all<{ key: string; value: string }>();
      return json({
        settings: Object.fromEntries(results.map((x) => [x.key, x.value])),
      });
    }
    if (resource === "contact") {
      const { results } = await DB.prepare(
        "SELECT key,value FROM site_settings WHERE key LIKE 'contact_%'",
      ).all<{ key: string; value: string }>();
      return json({ settings: Object.fromEntries(results.map((row) => [row.key, row.value])) });
    }
    if (resource === "categories") {
      const { results } = await DB.prepare(
        "SELECT * FROM case_categories ORDER BY sort_order,created_at",
      ).all();
      return json({ categories: results });
    }
    if (resource === "types") {
      const { results } = await DB.prepare(
        "SELECT t.*,c.name_zh category_name_zh,c.name_en category_name_en FROM case_types t JOIN case_categories c ON c.id=t.category_id WHERE NOT (LOWER(TRIM(t.name_en))='other' OR TRIM(t.name_zh)='其他') ORDER BY c.sort_order,t.sort_order,t.name_zh",
      ).all();
      return json({ types: results });
    }
    if (resource === "regions") {
      const { results } = await DB.prepare(
        "SELECT * FROM case_regions ORDER BY sort_order,name_zh",
      ).all();
      return json({ regions: results });
    }
    if (resource === "guides") {
      const { results } = await DB.prepare(
        "SELECT g.*,c.name_zh category_name_zh,t.name_zh type_name_zh FROM guides g LEFT JOIN case_categories c ON c.id=g.category_id LEFT JOIN case_types t ON t.id=g.type_id ORDER BY g.updated_at DESC",
      ).all();
      return json({ guides: results });
    }
    if (resource === "services") {
      const { results } = await DB.prepare(
        "SELECT s.*,c.content_config_json FROM services s LEFT JOIN service_content_configs c ON c.service_id=s.id ORDER BY s.sort_order,s.created_at",
      ).all();
      return json({ services: results });
    }
    if (resource === "cases") {
      const requestedPage = Math.max(
        1,
        Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1,
      );
      const pageSize = Math.min(
        50,
        Math.max(
          10,
          Number.parseInt(url.searchParams.get("pageSize") ?? "20", 10) || 20,
        ),
      );
      const count = await DB.prepare(
        "SELECT COUNT(*) total FROM case_studies",
      ).all<{ total: number }>();
      const total = Number(count.results[0]?.total ?? 0);
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const page = Math.min(requestedPage, totalPages);
      const { results } = await DB.prepare(
        "SELECT s.*,c.name_zh category_name_zh,c.name_en category_name_en,t.name_zh type_name_zh,t.name_en type_name_en,r.name_zh region_name_zh,r.name_en region_name_en,g.title_zh guide_title_zh FROM case_studies s LEFT JOIN case_categories c ON c.id=s.category_id LEFT JOIN case_types t ON t.id=s.type_id AND NOT (LOWER(TRIM(t.name_en))='other' OR TRIM(t.name_zh)='其他') LEFT JOIN case_regions r ON r.id=s.region_id LEFT JOIN guides g ON g.id=s.guide_id ORDER BY COALESCE(s.updated_at,s.created_at) DESC,s.created_at DESC LIMIT ? OFFSET ?",
      )
        .bind(pageSize, (page - 1) * pageSize)
        .all();
      return json({
        cases: results,
        pagination: { page, pageSize, total, totalPages },
      });
    }
    const [categories, types, regions, guides, cases] = await Promise.all(
      [
        "case_categories",
        "case_types",
        "case_regions",
        "guides",
        "case_studies",
      ].map((table) => DB.prepare(`SELECT COUNT(*) total FROM ${table}`).all()),
    );
    return json({
      categories: categories.results[0],
      types: types.results[0],
      regions: regions.results[0],
      guides: guides.results[0],
      cases: cases.results[0],
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load administration data",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "login") {
      if (!(await validateAdminPassword(String(body.password ?? ""))))
        return json({ error: "密码不正确" }, { status: 401 });
      const response = json({ ok: true });
      response.headers.set("Set-Cookie", await createAdminSession());
      return response;
    }
    if (body.action === "logout") {
      const response = json({ ok: true });
      response.headers.set("Set-Cookie", clearAdminSession());
      return response;
    }
    await requireAdminSession(request);
    const { DB } = await getWorkerEnv();
    if (!DB)
      return json({ error: "D1 binding is unavailable" }, { status: 503 });
    if (body.action === "site") {
      for (const [key, value] of [
        ["title_zh", body.titleZh],
        ["title_en", body.titleEn],
      ])
        await DB.prepare(
          "INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP",
        )
          .bind(key, String(value ?? ""))
          .run();
      return json({ ok: true });
    }
    if (body.action === "contact") {
      const values = [
        ["contact_phone", body.phone], ["contact_email", body.email],
        ["contact_address_zh", body.addressZh], ["contact_address_en", body.addressEn],
        ["contact_hours_zh", body.hoursZh], ["contact_hours_en", body.hoursEn],
        ["contact_map_url", body.mapUrl],
      ];
      if (values.some(([, value]) => !String(value ?? "").trim()))
        return json({ error: "所有联系方式字段均为必填项" }, { status: 400 });
      if (!/^https:\/\//i.test(String(body.mapUrl)))
        return json({ error: "地图地址必须是 HTTPS 链接" }, { status: 400 });
      for (const [key, value] of values)
        await DB.prepare(
          "INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP",
        ).bind(key, String(value).trim()).run();
      return json({ ok: true });
    }
    if (body.action === "service" || body.action === "update-service") {
      if (!String(body.slug ?? "").trim() || (!String(body.titleZh ?? "").trim() && !String(body.titleEn ?? "").trim()))
        return json({ error: "URL 标识和至少一种语言的服务标题为必填项" }, { status: 400 });
      const slug = String(body.slug).trim().toLowerCase();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        return json({ error: "URL 标识只能使用小写字母、数字和连字符" }, { status: 400 });
      const pointsZh = Array.isArray(body.pointsZh) ? body.pointsZh.map(String).filter(Boolean) : [];
      const pointsEn = Array.isArray(body.pointsEn) ? body.pointsEn.map(String).filter(Boolean) : [];
      const steps = Array.isArray(body.steps) ? body.steps : [];
      if (!validImage(String(body.imageUrl ?? "")))
        return json({ error: "图片格式无效或压缩后超过 450 KB" }, { status: 413 });
      const contentConfig = body.contentConfig && typeof body.contentConfig === "object" ? body.contentConfig as Record<string, unknown> : {};
      const localized = (key: string) => String(contentConfig[key] ?? "").trim();
      const config = {
        overview_title_zh: localized("overview_title_zh"),
        overview_title_en: localized("overview_title_en"),
        points_title_zh: localized("points_title_zh"),
        points_title_en: localized("points_title_en"),
        process_title_zh: localized("process_title_zh"),
        process_title_en: localized("process_title_en"),
        show_overview: contentConfig.show_overview !== false,
        show_points: contentConfig.show_points !== false,
        show_process: contentConfig.show_process !== false,
      };
      const titleZh = String(body.titleZh ?? "").trim();
      const titleEn = String(body.titleEn ?? "").trim();
      const shortTitleZh = String(body.shortTitleZh ?? "").trim() || titleZh;
      const shortTitleEn = String(body.shortTitleEn ?? "").trim() || titleEn;
      const id = String(body.id || crypto.randomUUID());
      const values = [
        slug, String(body.iconKey || "ticket"), titleZh, titleEn,
        shortTitleZh, shortTitleEn, String(body.introZh ?? ""), String(body.introEn ?? ""),
        String(body.overviewZh ?? ""), String(body.overviewEn ?? ""), JSON.stringify(pointsZh), JSON.stringify(pointsEn),
        JSON.stringify(steps), String(body.imageUrl ?? ""), Number(body.sortOrder ?? 0),
        body.published === false ? 0 : 1,
      ];
      if (body.action === "service")
        await DB.prepare("INSERT INTO services(id,slug,icon_key,title_zh,title_en,short_title_zh,short_title_en,intro_zh,intro_en,overview_zh,overview_en,points_zh,points_en,steps_json,image_url,sort_order,published) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
          .bind(id, ...values).run();
      else
        await DB.prepare("UPDATE services SET slug=?,icon_key=?,title_zh=?,title_en=?,short_title_zh=?,short_title_en=?,intro_zh=?,intro_en=?,overview_zh=?,overview_en=?,points_zh=?,points_en=?,steps_json=?,image_url=?,sort_order=?,published=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
          .bind(...values, id).run();
      await DB.prepare("INSERT INTO service_content_configs(service_id,content_config_json,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(service_id) DO UPDATE SET content_config_json=excluded.content_config_json,updated_at=CURRENT_TIMESTAMP")
        .bind(id, JSON.stringify(config)).run();
      return json({ ok: true, id });
    }
    if (body.action === "delete-service") {
      await DB.prepare("DELETE FROM service_content_configs WHERE service_id=?").bind(String(body.id)).run();
      await DB.prepare("DELETE FROM services WHERE id=?").bind(String(body.id)).run();
      return json({ ok: true });
    }
    if (body.action === "type" || body.action === "update-type") {
      if (!body.categoryId || !body.nameZh || !body.nameEn)
        return json({ error: "大类、中英文名称均为必填项" }, { status: 400 });
      if (
        String(body.nameZh).trim() === "其他" ||
        String(body.nameEn).trim().toLowerCase() === "other"
      )
        return json(
          { error: "“其他”已统一为大类，请将未细分案例直接归入“其他”大类" },
          { status: 400 },
        );
      const id = String(body.id || crypto.randomUUID());
      if (body.action === "type")
        await DB.prepare(
          "INSERT INTO case_types(id,category_id,slug,name_zh,name_en,sort_order) VALUES(?,?,?,?,?,?)",
        )
          .bind(
            id,
            String(body.categoryId),
            slugFor(String(body.nameEn), "type"),
            String(body.nameZh),
            String(body.nameEn),
            Number(body.sortOrder ?? 0),
          )
          .run();
      else
        await DB.prepare(
          "UPDATE case_types SET category_id=?,name_zh=?,name_en=?,sort_order=? WHERE id=?",
        )
          .bind(
            String(body.categoryId),
            String(body.nameZh),
            String(body.nameEn),
            Number(body.sortOrder ?? 0),
            id,
          )
          .run();
      return json({ ok: true, id });
    }
    if (body.action === "delete-type") {
      await DB.prepare(
        "UPDATE case_studies SET type_id=NULL,updated_at=CURRENT_TIMESTAMP WHERE type_id=?",
      )
        .bind(String(body.id))
        .run();
      await DB.prepare(
        "UPDATE guides SET type_id=NULL,updated_at=CURRENT_TIMESTAMP WHERE type_id=?",
      )
        .bind(String(body.id))
        .run();
      await DB.prepare("DELETE FROM case_types WHERE id=?")
        .bind(String(body.id))
        .run();
      return json({ ok: true });
    }
    if (body.action === "region" || body.action === "update-region") {
      if (!body.nameZh || !body.nameEn)
        return json({ error: "中英文地区名称均为必填项" }, { status: 400 });
      const id = String(body.id || crypto.randomUUID());
      if (body.action === "region")
        await DB.prepare(
          "INSERT INTO case_regions(id,slug,name_zh,name_en,sort_order) VALUES(?,?,?,?,?)",
        )
          .bind(
            id,
            slugFor(String(body.nameEn), "region"),
            String(body.nameZh),
            String(body.nameEn),
            Number(body.sortOrder ?? 0),
          )
          .run();
      else
        await DB.prepare(
          "UPDATE case_regions SET name_zh=?,name_en=?,sort_order=? WHERE id=?",
        )
          .bind(
            String(body.nameZh),
            String(body.nameEn),
            Number(body.sortOrder ?? 0),
            id,
          )
          .run();
      return json({ ok: true, id });
    }
    if (body.action === "delete-region") {
      await DB.prepare(
        "UPDATE case_studies SET region_id=NULL,updated_at=CURRENT_TIMESTAMP WHERE region_id=?",
      )
        .bind(String(body.id))
        .run();
      await DB.prepare("DELETE FROM case_regions WHERE id=?")
        .bind(String(body.id))
        .run();
      return json({ ok: true });
    }
    if (body.action === "case" || body.action === "update-case") {
      if (!validImage(String(body.imageUrl ?? "")))
        return json(
          { error: "图片格式无效或压缩后超过 450 KB" },
          { status: 413 },
        );
      const id = String(body.id || crypto.randomUUID()),
        values = [
          body.categoryId || null,
          body.typeId || null,
          body.regionId || null,
          body.guideId || null,
          String(body.titleZh),
          String(body.titleEn),
          String(body.summaryZh),
          String(body.summaryEn),
          String(body.contentZh ?? ""),
          String(body.contentEn ?? ""),
          String(body.imageUrl ?? ""),
          String(body.caseDate ?? ""),
          body.published === false ? 0 : 1,
        ];
      if (body.action === "case")
        await DB.prepare(
          "INSERT INTO case_studies(id,category_id,type_id,region_id,guide_id,title_zh,title_en,summary_zh,summary_en,content_zh,content_en,image_url,case_date,published) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        )
          .bind(id, ...values)
          .run();
      else
        await DB.prepare(
          "UPDATE case_studies SET category_id=?,type_id=?,region_id=?,guide_id=?,title_zh=?,title_en=?,summary_zh=?,summary_en=?,content_zh=?,content_en=?,image_url=?,case_date=?,published=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
        )
          .bind(...values, id)
          .run();
      return json({ ok: true, id });
    }
    if (body.action === "delete-case") {
      await DB.prepare("DELETE FROM case_studies WHERE id=?")
        .bind(String(body.id))
        .run();
      return json({ ok: true });
    }
    return json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Admin save failed", error);
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save administration data",
      },
      { status: 500 },
    );
  }
}
