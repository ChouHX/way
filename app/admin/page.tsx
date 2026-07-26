"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { Badge, Button, Card, Select } from "@/components/ui";

type Category = {
  id: string;
  slug: string;
  name_zh: string;
  name_en: string;
  sort_order: number;
};
type CaseType = {
  id: string;
  category_id: string;
  name_zh: string;
  name_en: string;
  category_name_zh: string;
  sort_order: number;
};
type Region = {
  id: string;
  name_zh: string;
  name_en: string;
  sort_order: number;
};
type Guide = { id: string; title_zh: string; title_en: string };
type CaseStudy = {
  id: string;
  category_id?: string;
  type_id?: string;
  region_id?: string;
  guide_id?: string;
  title_zh: string;
  title_en: string;
  summary_zh: string;
  summary_en: string;
  content_zh?: string;
  content_en?: string;
  image_url?: string;
  case_date?: string;
  published: number;
  category_name_zh?: string;
  type_name_zh?: string;
  region_name_zh?: string;
};
type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
type Section = "site" | "cases" | "taxonomy";
type Auth = "loading" | "ready" | "signed-out" | "unavailable";
const maxImageBytes = 450 * 1024;
async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) throw Error("请选择图片文件");
  if (file.size > 10 * 1024 * 1024) throw Error("原始图片不能超过 10 MB");
  const bitmap = await createImageBitmap(file),
    scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height)),
    canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.78, 0.68, 0.58, 0.48]) {
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/webp", quality),
    );
    if (blob && blob.size <= maxImageBytes)
      return await new Promise<string>((r, j) => {
        const reader = new FileReader();
        reader.onload = () => r(String(reader.result));
        reader.onerror = () => j(Error("读取图片失败"));
        reader.readAsDataURL(blob);
      });
  }
  throw Error("图片压缩后仍超过 450 KB");
}
async function api(resource: string, init?: RequestInit) {
  const response = await fetch(`/api/admin?resource=${resource}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "请求失败" }));
    const e = Error(data.error || "请求失败") as Error & { status?: number };
    e.status = response.status;
    throw e;
  }
  return response.json();
}

export default function AdminPage() {
  const [auth, setAuth] = useState<Auth>("loading"),
    [status, setStatus] = useState("正在检查登录状态…"),
    [busy, setBusy] = useState<string | null>("正在加载后台数据"),
    [section, setSection] = useState<Section>("site"),
    [site, setSite] = useState({ titleZh: "", titleEn: "" }),
    [categories, setCategories] = useState<Category[]>([]),
    [types, setTypes] = useState<CaseType[]>([]),
    [regions, setRegions] = useState<Region[]>([]),
    [guides, setGuides] = useState<Guide[]>([]),
    [cases, setCases] = useState<CaseStudy[]>([]),
    [pagination, setPagination] = useState<Pagination>({
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 1,
    });
  const load = async (page = 1, pageSize = 20) => {
    setBusy("正在加载后台数据");
    try {
      const [s, c, t, r, g, k] = await Promise.all([
        api("site"),
        api("categories"),
        api("types"),
        api("regions"),
        api("guides"),
        api(`cases&page=${page}&pageSize=${pageSize}`),
      ]);
      setSite({
        titleZh: s.settings.title_zh || "",
        titleEn: s.settings.title_en || "",
      });
      setCategories(c.categories);
      setTypes(t.types);
      setRegions(r.regions);
      setGuides(g.guides);
      setCases(k.cases);
      setPagination(k.pagination);
      setAuth("ready");
      setStatus("已连接 Cloudflare D1");
    } catch (e) {
      if ((e as any).status === 401) {
        setAuth("signed-out");
        setStatus("请登录后继续");
      } else {
        setAuth("unavailable");
        setStatus(e instanceof Error ? e.message : "后台不可用");
      }
    } finally {
      setBusy(null);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const loadCasePage = async (page: number, pageSize = pagination.pageSize) => {
    setBusy("正在加载案例列表");
    try {
      const data = await api(`cases&page=${page}&pageSize=${pageSize}`);
      setCases(data.cases);
      setPagination(data.pagination);
    } catch (e) {
      if ((e as any).status === 401) setAuth("signed-out");
      else setStatus(e instanceof Error ? e.message : "案例加载失败");
    } finally {
      setBusy(null);
    }
  };
  const post = (resource: string, body: object) =>
    api(resource, { method: "POST", body: JSON.stringify(body) });
  const refresh = async (message: string) => {
    await load(pagination.page, pagination.pageSize);
    setStatus(message);
  };
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-transparent.png"
              alt="永盛"
              className="h-8 w-10 object-contain"
            />
            <div>
              <p className="text-[9px] font-bold tracking-[.14em] text-blue-600">
                YONGSHENG ADMIN
              </p>
              <h1 className="text-[15px] font-bold text-[#0f2747]">
                内容管理后台
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex"
              aria-live="polite"
            >
              {busy ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin text-blue-600"
                />
              ) : (
                <ShieldCheck size={14} className="text-blue-600" />
              )}
              {busy || status}
            </span>
            {auth === "ready" && (
              <button
                disabled={Boolean(busy)}
                onClick={async () => {
                  setBusy("正在退出登录");
                  try {
                    await post("logout", { action: "logout" });
                    setAuth("signed-out");
                  } finally {
                    setBusy(null);
                  }
                }}
                className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-slate-500 hover:text-[#0f2747] disabled:cursor-wait disabled:opacity-60"
              >
                {busy === "正在退出登录" && (
                  <LoaderCircle size={13} className="animate-spin" />
                )}
                {busy === "正在退出登录" ? "正在退出…" : "退出"}
              </button>
            )}
          </div>
        </div>
      </header>
      {busy && <AdminProgress label={busy} />}
      <div
        className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6"
        aria-busy={Boolean(busy)}
      >
        {auth === "signed-out" ? (
          <Login onDone={load} status={status} setStatus={setStatus} />
        ) : auth === "unavailable" ? (
          <Card className="mx-auto mt-12 max-w-lg p-8 text-center">
            <h2 className="font-bold text-[#0f2747]">后台暂不可用</h2>
            <p className="mt-2 text-sm text-slate-500">{status}</p>
          </Card>
        ) : (
          <>
            <nav className="flex gap-5 border-b border-slate-200">
              {[
                ["site", Settings2, "站点管理"],
                ["cases", BriefcaseBusiness, "案例管理"],
                ["taxonomy", Tags, "类型管理"],
              ].map(([id, Icon, label]) => (
                <button
                  key={id as string}
                  disabled={Boolean(busy)}
                  onClick={() => setSection(id as Section)}
                  className={`relative inline-flex items-center gap-1.5 pb-3 text-[13px] font-bold disabled:cursor-wait disabled:opacity-60 ${section === id ? "text-[#0f2747] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-blue-600" : "text-slate-500 hover:text-[#0f2747]"}`}
                >
                  <Icon size={16} />
                  {label as string}
                </button>
              ))}
            </nav>
            {auth === "loading" ? (
              <AdminSkeleton />
            ) : section === "site" ? (
              <SitePanel
                site={site}
                setSite={setSite}
                loading={Boolean(busy)}
                save={async (e) => {
                  e.preventDefault();
                  setBusy("正在保存站点设置");
                  try {
                    await post("site", { action: "site", ...site });
                    setStatus("站点标题已保存");
                  } finally {
                    setBusy(null);
                  }
                }}
              />
            ) : section === "taxonomy" ? (
              <TaxonomyPanel
                categories={categories}
                types={types}
                regions={regions}
                loading={Boolean(busy)}
                save={async (body) => {
                  setBusy("正在更新类型配置");
                  try {
                    await post("taxonomy", body);
                    await refresh("类型数据已更新");
                  } finally {
                    setBusy(null);
                  }
                }}
              />
            ) : (
              <CasesPanel
                categories={categories}
                types={types}
                regions={regions}
                guides={guides}
                cases={cases}
                pagination={pagination}
                loading={Boolean(busy)}
                pageLoading={busy === "正在加载案例列表"}
                changePage={loadCasePage}
                save={async (body) => {
                  setBusy("正在保存案例数据");
                  try {
                    await post("cases", body);
                    await refresh("案例数据已更新");
                  } finally {
                    setBusy(null);
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
function Login({
  onDone,
  status,
  setStatus,
}: {
  onDone: () => Promise<void>;
  status: string;
  setStatus: (x: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <Card className="mx-auto mt-12 max-w-sm p-6">
      <h2 className="text-center text-lg font-bold text-[#0f2747]">
        管理员登录
      </h2>
      <form
        className="mt-5 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setStatus("正在验证管理员身份…");
          try {
            await api("login", {
              method: "POST",
              body: JSON.stringify({
                action: "login",
                password: String(new FormData(e.currentTarget).get("password")),
              }),
            });
            await onDone();
          } catch {
            setStatus("密码不正确，请重试");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <Field
          name="password"
          type="password"
          label="后台密码"
          required
          disabled={submitting}
        />
        <Button disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              正在登录…
            </>
          ) : (
            "登录后台"
          )}
        </Button>
      </form>
      <p className="mt-3 text-center text-xs text-slate-500" aria-live="polite">
        {status}
      </p>
    </Card>
  );
}
function SitePanel({
  site,
  setSite,
  loading,
  save,
}: {
  site: { titleZh: string; titleEn: string };
  setSite: React.Dispatch<
    React.SetStateAction<{ titleZh: string; titleEn: string }>
  >;
  loading: boolean;
  save: (e: FormEvent) => void;
}) {
  return (
    <section className="max-w-xl py-5">
      <Heading
        eyebrow="SITE SETTINGS"
        title="站点管理"
        text="维护中英文站点标题。"
      />
      <Card className="mt-4 p-5">
        <form className="grid gap-3" onSubmit={save}>
          <Field
            label="中文标题"
            value={site.titleZh}
            disabled={loading}
            onChange={(e) =>
              setSite((x) => ({ ...x, titleZh: e.target.value }))
            }
          />
          <Field
            label="English title"
            value={site.titleEn}
            disabled={loading}
            onChange={(e) =>
              setSite((x) => ({ ...x, titleEn: e.target.value }))
            }
          />
          <Button disabled={loading} className="w-fit py-2.5 text-xs">
            {loading ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {loading ? "正在保存…" : "保存"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
function TaxonomyPanel({
  categories,
  types,
  regions,
  loading,
  save,
}: {
  categories: Category[];
  types: CaseType[];
  regions: Region[];
  loading: boolean;
  save: (b: object) => Promise<void>;
}) {
  const [dialog, setDialog] = useState<{
      kind: "type" | "region";
      item?: CaseType | Region;
    } | null>(null),
    [view, setView] = useState<"types" | "regions">("types");
  return (
    <section className="py-5">
      <Heading
        eyebrow="TAXONOMY"
        title="类型与地区管理"
        text="罚单类型与地区均可在此配置；新建罚单类型时必须选择所属大类。"
      />
      <div className="mt-5 flex gap-1 border-b border-slate-200">
        <button
          disabled={loading}
          onClick={() => setView("types")}
          className={`border-b-2 px-4 py-2.5 text-xs font-bold disabled:cursor-wait disabled:opacity-60 ${view === "types" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          罚单类型{" "}
          <span className="ml-1 text-[10px] font-normal">{types.length}</span>
        </button>
        <button
          disabled={loading}
          onClick={() => setView("regions")}
          className={`border-b-2 px-4 py-2.5 text-xs font-bold disabled:cursor-wait disabled:opacity-60 ${view === "regions" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          地区管理{" "}
          <span className="ml-1 text-[10px] font-normal">{regions.length}</span>
        </button>
      </div>
      {view === "types" ? (
        <Card className="mt-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0f2747]">罚单类型配置</h3>
              <p className="mt-1 text-[11px] text-slate-500">
                按交通罚单、法庭传票和 TLC 罚单分组展示。
              </p>
            </div>
            <SmallAdd
              disabled={loading}
              onClick={() => setDialog({ kind: "type" })}
            >
              新增类型
            </SmallAdd>
          </div>
          <div className="mt-5 space-y-6">
            {categories.map((c) => (
              <div key={c.id}>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="h-2 w-2 bg-blue-600" />
                  <h4 className="text-xs font-bold text-slate-700">
                    {c.name_zh}
                    <span className="ml-2 font-normal text-slate-400">
                      {c.name_en}
                    </span>
                  </h4>
                  <span className="ml-auto text-[10px] text-slate-400">
                    {types.filter((t) => t.category_id === c.id).length} 项
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {types
                    .filter((t) => t.category_id === c.id)
                    .map((t) => (
                      <Tag
                        key={t.id}
                        label={t.name_zh}
                        sub={t.name_en}
                        disabled={loading}
                        edit={() => setDialog({ kind: "type", item: t })}
                        remove={() =>
                          void save({ action: "delete-type", id: t.id })
                        }
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="mt-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#0f2747]">
                <MapPin size={16} className="text-blue-600" />
                地区配置
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                地区可在案例新增和编辑时直接选择。
              </p>
            </div>
            <SmallAdd
              disabled={loading}
              onClick={() => setDialog({ kind: "region" })}
            >
              新增地区
            </SmallAdd>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {regions.map((r) => (
              <Tag
                key={r.id}
                label={r.name_zh}
                sub={r.name_en}
                disabled={loading}
                edit={() => setDialog({ kind: "region", item: r })}
                remove={() => void save({ action: "delete-region", id: r.id })}
              />
            ))}
          </div>
        </Card>
      )}
      {dialog && (
        <TaxonomyDialog
          dialog={dialog}
          categories={categories}
          loading={loading}
          close={() => setDialog(null)}
          save={async (body) => {
            await save(body);
            setDialog(null);
          }}
        />
      )}
    </section>
  );
}
function Tag({
  label,
  sub,
  disabled,
  edit,
  remove,
}: {
  label: string;
  sub: string;
  disabled: boolean;
  edit: () => void;
  remove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 py-1 pl-2.5 pr-1 text-xs text-slate-700">
      <span>
        <b>{label}</b>
        <span className="ml-1.5 text-[10px] text-slate-400">{sub}</span>
      </span>
      <button
        aria-label="编辑"
        disabled={disabled}
        onClick={edit}
        className="grid h-6 w-6 place-items-center hover:bg-white hover:text-blue-600 disabled:cursor-wait disabled:opacity-40"
      >
        <Pencil size={12} />
      </button>
      <button
        aria-label="删除"
        disabled={disabled}
        onClick={remove}
        className="grid h-6 w-6 place-items-center hover:bg-white hover:text-red-600 disabled:cursor-wait disabled:opacity-40"
      >
        <X size={12} />
      </button>
    </span>
  );
}
function TaxonomyDialog({
  dialog,
  categories,
  loading,
  close,
  save,
}: {
  dialog: { kind: "type" | "region"; item?: CaseType | Region };
  categories: Category[];
  loading: boolean;
  close: () => void;
  save: (b: object) => Promise<void>;
}) {
  const isType = dialog.kind === "type",
    item = dialog.item;
  return (
    <Modal close={close} locked={loading}>
      <form
        className="relative p-5"
        aria-busy={loading}
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          await save({
            action: item ? `update-${dialog.kind}` : dialog.kind,
            id: item?.id,
            categoryId: f.get("categoryId"),
            nameZh: f.get("nameZh"),
            nameEn: f.get("nameEn"),
            sortOrder: Number(f.get("sortOrder")),
          });
        }}
      >
        <h2 className="text-lg font-bold text-[#0f2747]">
          {item ? "编辑" : "新增"}
          {isType ? "罚单类型" : "地区"}
        </h2>
        <div className="mt-4 grid gap-3">
          {isType && (
            <label className="grid gap-1.5 text-xs font-bold">
              所属大类
              <Select
                disabled={loading}
                name="categoryId"
                defaultValue={(item as CaseType)?.category_id}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_zh} / {c.name_en}
                  </option>
                ))}
              </Select>
            </label>
          )}
          <Field
            name="nameZh"
            label="中文名称"
            disabled={loading}
            defaultValue={item?.name_zh}
            required
          />
          <Field
            name="nameEn"
            label="English name"
            disabled={loading}
            defaultValue={item?.name_en}
            required
          />
          <Field
            name="sortOrder"
            type="number"
            disabled={loading}
            label="排序"
            defaultValue={item?.sort_order || 0}
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={close}
            className="border border-slate-300 px-3 py-2 text-xs font-bold disabled:cursor-wait disabled:opacity-50"
          >
            取消
          </button>
          <Button disabled={loading} className="min-w-20 py-2 text-xs">
            {loading && <LoaderCircle size={14} className="animate-spin" />}
            {loading ? "保存中…" : "保存"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
function CasesPanel({
  categories,
  types,
  regions,
  guides,
  cases,
  pagination,
  loading,
  pageLoading,
  changePage,
  save,
}: {
  categories: Category[];
  types: CaseType[];
  regions: Region[];
  guides: Guide[];
  cases: CaseStudy[];
  pagination: Pagination;
  loading: boolean;
  pageLoading: boolean;
  changePage: (page: number, pageSize?: number) => Promise<void>;
  save: (b: object) => Promise<void>;
}) {
  const [dialog, setDialog] = useState<{
      mode: "create" | "edit" | "preview" | "delete";
      item?: CaseStudy;
    } | null>(null),
    from = pagination.total
      ? (pagination.page - 1) * pagination.pageSize + 1
      : 0,
    to = Math.min(pagination.page * pagination.pageSize, pagination.total);
  return (
    <section className="py-5">
      <div className="flex items-end justify-between gap-4">
        <Heading
          eyebrow="CASE LIBRARY"
          title="案例管理"
          text={`共 ${pagination.total} 个案例，当前显示 ${from}-${to}。`}
        />
        <Button
          disabled={loading}
          className="shrink-0 px-4 py-2.5 text-xs"
          onClick={() => setDialog({ mode: "create" })}
        >
          <Plus size={15} />
          新增案例
        </Button>
      </div>
      <Card className="relative mt-4 overflow-hidden">
        {pageLoading && (
          <div className="admin-loading-layer absolute inset-0 z-20 grid place-items-center bg-white/72 backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0f2747] shadow-sm">
              <LoaderCircle size={15} className="animate-spin text-blue-600" />
              正在加载案例…
            </span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b bg-slate-50 text-[10px] text-slate-500">
              <tr>
                <th className="px-4 py-3">案例</th>
                <th className="px-4 py-3">大类 / 类型</th>
                <th className="px-4 py-3">地区</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((x) => (
                <tr key={x.id} className="hover:bg-blue-50/30">
                  <td className="max-w-[330px] px-4 py-3">
                    <b className="line-clamp-1 text-[#0f2747]">{x.title_zh}</b>
                    <span className="mt-1 block line-clamp-1 text-[11px] text-slate-500">
                      {x.summary_zh}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{x.category_name_zh || "未分类"}</Badge>
                    <span className="ml-2 text-slate-500">
                      {x.type_name_zh || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {x.region_name_zh || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        x.published ? "text-emerald-700" : "text-slate-400"
                      }
                    >
                      {x.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Icon
                        onClick={() => setDialog({ mode: "preview", item: x })}
                      >
                        <Eye size={14} />
                      </Icon>
                      <Icon
                        onClick={() => setDialog({ mode: "edit", item: x })}
                      >
                        <Pencil size={14} />
                      </Icon>
                      <Icon
                        onClick={() => setDialog({ mode: "delete", item: x })}
                      >
                        <Trash2 size={14} />
                      </Icon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-nowrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/70 px-4 py-3">
          <div className="flex min-w-0 shrink items-center gap-2 whitespace-nowrap text-xs text-slate-500">
            <span className="shrink-0">每页</span>
            <Select
              disabled={loading}
              aria-label="每页案例数"
              value={pagination.pageSize}
              onChange={(e) => void changePage(1, Number(e.target.value))}
              className="!w-20 shrink-0 py-1.5 text-xs"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
            <span className="shrink-0">条，共 {pagination.total} 条</span>
          </div>
          <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2 whitespace-nowrap">
            <button
              aria-label="上一页"
              disabled={loading || pagination.page <= 1}
              onClick={() => void changePage(pagination.page - 1)}
              className="grid h-8 w-8 shrink-0 place-items-center border border-slate-200 bg-white text-slate-600 disabled:opacity-35"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="min-w-20 shrink-0 whitespace-nowrap text-center text-xs font-bold text-slate-600">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              aria-label="下一页"
              disabled={loading || pagination.page >= pagination.totalPages}
              onClick={() => void changePage(pagination.page + 1)}
              className="grid h-8 w-8 shrink-0 place-items-center border border-slate-200 bg-white text-slate-600 disabled:opacity-35"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </Card>
      {dialog && (
        <CaseDialog
          dialog={dialog}
          categories={categories}
          types={types}
          regions={regions}
          guides={guides}
          loading={loading}
          close={() => setDialog(null)}
          save={async (body) => {
            await save(body);
            setDialog(null);
          }}
        />
      )}
    </section>
  );
}
function CaseDialog({
  dialog,
  categories,
  types,
  regions,
  guides,
  loading,
  close,
  save,
}: {
  dialog: { mode: string; item?: CaseStudy };
  categories: Category[];
  types: CaseType[];
  regions: Region[];
  guides: Guide[];
  loading: boolean;
  close: () => void;
  save: (b: object) => Promise<void>;
}) {
  const item = dialog.item;
  if (dialog.mode === "delete")
    return (
      <Modal close={close} locked={loading}>
        <div className="p-5">
          <h2 className="font-bold text-[#0f2747]">删除案例</h2>
          <p className="mt-2 text-sm text-slate-500">
            确认删除“{item?.title_zh}”？此操作无法撤销。
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              disabled={loading}
              onClick={close}
              className="border px-3 py-2 text-xs font-bold disabled:cursor-wait disabled:opacity-50"
            >
              取消
            </button>
            <Button
              disabled={loading}
              className="bg-red-600 py-2 text-xs hover:bg-red-700"
              onClick={() => save({ action: "delete-case", id: item?.id })}
            >
              {loading && <LoaderCircle size={14} className="animate-spin" />}
              {loading ? "删除中…" : "删除"}
            </Button>
          </div>
        </div>
      </Modal>
    );
  if (dialog.mode === "preview")
    return (
      <Modal close={close}>
        <div className="overflow-hidden">
          <img
            src={item?.image_url || "/logo-transparent.png"}
            className="h-52 w-full object-cover"
            alt=""
          />
          <div className="p-5">
            <Badge>{item?.category_name_zh}</Badge>
            <h2 className="mt-3 text-xl font-bold text-[#0f2747]">
              {item?.title_zh}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
              {item?.content_zh || item?.summary_zh}
            </p>
          </div>
        </div>
      </Modal>
    );
  return (
    <CaseForm
      item={item}
      categories={categories}
      types={types}
      regions={regions}
      guides={guides}
      loading={loading}
      close={close}
      save={save}
    />
  );
}
function CaseForm({
  item,
  categories,
  types,
  regions,
  guides,
  loading,
  close,
  save,
}: {
  item?: CaseStudy;
  categories: Category[];
  types: CaseType[];
  regions: Region[];
  guides: Guide[];
  loading: boolean;
  close: () => void;
  save: (b: object) => Promise<void>;
}) {
  const [category, setCategory] = useState(
      item?.category_id || categories[0]?.id || "",
    ),
    [image, setImage] = useState(item?.image_url || ""),
    [error, setError] = useState("");
  const filtered = useMemo(
    () => types.filter((t) => t.category_id === category),
    [types, category],
  );
  return (
    <Modal close={close} wide locked={loading}>
      <form
        className="p-5"
        aria-busy={loading}
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          try {
            await save({
              action: item ? "update-case" : "case",
              id: item?.id,
              categoryId: category,
              typeId: f.get("typeId"),
              regionId: f.get("regionId"),
              guideId: f.get("guideId"),
              titleZh: f.get("titleZh"),
              titleEn: f.get("titleEn"),
              summaryZh: f.get("summaryZh"),
              summaryEn: f.get("summaryEn"),
              contentZh: f.get("contentZh"),
              contentEn: f.get("contentEn"),
              imageUrl: image,
              caseDate: f.get("caseDate"),
              published: f.get("published") === "1",
            });
          } catch (e) {
            setError(e instanceof Error ? e.message : "保存失败");
          }
        }}
      >
        <h2 className="text-lg font-bold text-[#0f2747]">
          {item ? "编辑案例" : "新增案例"}
        </h2>
        <fieldset disabled={loading} className="mt-4 grid gap-3 md:grid-cols-2">
          <Field
            name="titleZh"
            label="中文标题"
            defaultValue={item?.title_zh}
            required
          />
          <Field
            name="titleEn"
            label="English title"
            defaultValue={item?.title_en}
            required
          />
          <label className="grid gap-1.5 text-xs font-bold">
            大类
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_zh}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            罚单类型
            <Select name="typeId" defaultValue={item?.type_id || ""}>
              <option value="">未指定</option>
              {filtered.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name_zh}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            地区
            <Select name="regionId" defaultValue={item?.region_id || ""}>
              <option value="">未指定</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name_zh}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            关联知识
            <Select name="guideId" defaultValue={item?.guide_id || ""}>
              <option value="">未关联</option>
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title_zh}
                </option>
              ))}
            </Select>
          </label>
          <Field
            name="caseDate"
            label="案例日期"
            defaultValue={item?.case_date}
          />
          <label className="grid gap-1.5 text-xs font-bold">
            状态
            <Select
              name="published"
              defaultValue={item?.published === 0 ? "0" : "1"}
            >
              <option value="1">已发布</option>
              <option value="0">草稿</option>
            </Select>
          </label>
          <Area
            name="summaryZh"
            label="中文摘要"
            defaultValue={item?.summary_zh}
            required
          />
          <Area
            name="summaryEn"
            label="English summary"
            defaultValue={item?.summary_en}
            required
          />
          <Area
            name="contentZh"
            label="中文正文"
            defaultValue={item?.content_zh}
          />
          <Area
            name="contentEn"
            label="English content"
            defaultValue={item?.content_en}
          />
          <div className="md:col-span-2">
            <label className="grid gap-1.5 text-xs font-bold">
              案例图片
              <div className="flex items-center gap-3 border border-dashed border-slate-300 bg-slate-50 p-3">
                {image ? (
                  <img src={image} className="h-16 w-24 object-cover" alt="" />
                ) : (
                  <span className="grid h-16 w-24 place-items-center bg-white text-slate-400">
                    <ImagePlus size={20} />
                  </span>
                )}
                <label className="cursor-pointer border bg-white px-3 py-2 text-xs font-bold text-blue-700">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        try {
                          setImage(await compressImage(f));
                        } catch (e) {
                          setError(
                            e instanceof Error ? e.message : "图片处理失败",
                          );
                        }
                    }}
                  />
                  {image ? "替换图片" : "选择图片"}
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="text-xs text-slate-500"
                  >
                    移除
                  </button>
                )}
              </div>
            </label>
          </div>
        </fieldset>
        {error && (
          <p className="mt-3 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={close}
            className="border px-3 py-2 text-xs font-bold disabled:cursor-wait disabled:opacity-50"
          >
            取消
          </button>
          <Button disabled={loading} className="min-w-28 py-2 text-xs">
            {loading ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {loading ? "保存中…" : "保存案例"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
function Modal({
  children,
  close,
  wide = false,
  locked = false,
}: {
  children: React.ReactNode;
  close: () => void;
  wide?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative my-auto max-h-[calc(100dvh-2rem)] w-full overflow-y-auto overflow-x-hidden bg-white shadow-2xl ${wide ? "max-w-3xl" : "max-w-lg"}`}
      >
        <button
          aria-label="关闭"
          disabled={locked}
          onClick={close}
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center bg-white/90 text-slate-500 disabled:cursor-wait disabled:opacity-40"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
function AdminProgress({ label }: { label: string }) {
  return (
    <div
      className="fixed inset-x-0 top-14 z-50 h-0.5 overflow-hidden bg-blue-100"
      role="status"
      aria-label={label}
    >
      <span className="admin-progress-bar block h-full w-1/2 bg-blue-600" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
function AdminSkeleton() {
  return (
    <section className="py-5" aria-label="正在加载后台内容">
      <div className="h-2.5 w-24 shimmer" />
      <div className="mt-3 h-6 w-40 shimmer" />
      <div className="mt-2 h-3 w-72 max-w-full shimmer" />
      <Card className="mt-5 overflow-hidden p-0">
        <div className="border-b border-slate-200 p-4">
          <div className="h-4 w-28 shimmer" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1.5fr_.7fr_.45fr] gap-5 px-4 py-4"
            >
              <div>
                <div className="h-3.5 w-3/4 shimmer" />
                <div className="mt-2 h-2.5 w-full shimmer" />
              </div>
              <div className="h-5 w-24 shimmer" />
              <div className="h-5 w-14 shimmer" />
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
function Heading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[.14em] text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-[-.025em] text-[#0f2747]">
        {title}
      </h2>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}
function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-xs font-bold">
      <span>{label}</span>
      <input
        {...props}
        className="border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
function Area({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-xs font-bold">
      <span>{label}</span>
      <textarea
        {...props}
        rows={3}
        className="resize-y border border-slate-300 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
function SmallAdd({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-bold text-blue-600 hover:text-blue-700 disabled:cursor-wait disabled:opacity-50"
    >
      <Plus size={14} />
      {children}
    </button>
  );
}
function Icon({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="grid h-7 w-7 place-items-center border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
    >
      {children}
    </button>
  );
}
