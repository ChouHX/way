"use client";

import { FormEvent, InputHTMLAttributes, TextareaHTMLAttributes, useEffect, useState } from "react";
import { BriefcaseBusiness, FolderTree, LayoutPanelTop, ListChecks, Plus, Save, Settings2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button, Card, Select } from "@/components/ui";

type Category = { id: string; slug: string; name_zh: string; name_en: string; sort_order: number };
type CaseStudy = { id: string; title_zh: string; title_en: string; category_name_zh?: string; category_name_en?: string; image_url?: string; published: number };
type Section = "site" | "cases";
type CasePanel = "categories" | "cases";
type AuthState = "loading" | "ready" | "signed-out" | "unavailable";

async function api(resource: string, init?: RequestInit) {
  const response = await fetch(`/api/admin?resource=${resource}`, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  if (!response.ok) { const error = new Error(await response.text()) as Error & { status: number }; error.status = response.status; throw error; }
  return response.json();
}

export default function AdminPage() {
  const [site, setSite] = useState({ titleZh: "", titleEn: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [section, setSection] = useState<Section>("site");
  const [casePanel, setCasePanel] = useState<CasePanel>("cases");
  const [auth, setAuth] = useState<AuthState>("loading");
  const [status, setStatus] = useState("正在检查登录状态…");

  const load = async () => {
    try {
      const [siteData, categoryData, caseData] = await Promise.all([api("site"), api("categories"), api("cases")]);
      setSite({ titleZh: siteData.settings.title_zh ?? "", titleEn: siteData.settings.title_en ?? "" });
      setCategories(categoryData.categories);
      setCases(caseData.cases);
      setAuth("ready");
      setStatus("已连接 D1 管理数据");
    } catch (error) {
      if ((error as { status?: number }).status === 401) { setAuth("signed-out"); setStatus("请登录后继续"); }
      else { setAuth("unavailable"); setStatus("后台服务暂不可用"); }
    }
  };

  useEffect(() => { void load(); }, []);
  const login = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const password = String(new FormData(event.currentTarget).get("password") ?? ""); try { await api("login", { method: "POST", body: JSON.stringify({ action: "login", password }) }); setAuth("loading"); setStatus("登录成功，正在加载数据…"); await load(); } catch (error) { setStatus((error as { status?: number }).status === 401 ? "密码不正确，请重试。" : "暂时无法登录，请稍后重试。"); } };
  const logout = async () => { await api("logout", { method: "POST", body: JSON.stringify({ action: "logout" }) }); setAuth("signed-out"); setStatus("已退出登录"); };
  const saveSite = async (event: FormEvent) => { event.preventDefault(); await api("site", { method: "POST", body: JSON.stringify({ action: "site", ...site }) }); setStatus("站点标题已保存"); };
  const addCategory = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); await api("categories", { method: "POST", body: JSON.stringify({ action: "category", slug: form.get("slug"), nameZh: form.get("nameZh"), nameEn: form.get("nameEn"), sortOrder: Number(form.get("sortOrder") || 0) }) }); event.currentTarget.reset(); await load(); setCasePanel("categories"); };
  const addCase = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); await api("cases", { method: "POST", body: JSON.stringify({ action: "case", categoryId: form.get("categoryId"), titleZh: form.get("titleZh"), titleEn: form.get("titleEn"), summaryZh: form.get("summaryZh"), summaryEn: form.get("summaryEn"), contentZh: form.get("contentZh"), contentEn: form.get("contentEn"), imageUrl: form.get("imageUrl"), published: true }) }); event.currentTarget.reset(); await load(); setCasePanel("cases"); };

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><img src="/logo-transparent.png" alt="永盛罚单／移民咨询中心" className="h-10 w-12 object-contain"/><div><p className="text-xs font-bold tracking-[.14em] text-blue-600">YONGSHENG ADMIN</p><h1 className="mt-0.5 text-lg font-bold tracking-[-.025em] text-[#0f2747]">内容管理后台</h1></div></div><div className="flex items-center gap-4"><p className="hidden items-center gap-2 text-sm text-slate-500 sm:flex"><ShieldCheck size={16} className="text-blue-600"/>{status}</p>{auth === "ready" && <button type="button" onClick={() => void logout()} className="text-sm font-bold text-slate-500 transition hover:text-[#0f2747]">退出登录</button>}</div></div></header>
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      {auth === "signed-out" ? <LoginForm status={status} onLogin={login} /> : auth === "unavailable" ? <Unavailable /> : <>
        <div className="border-b border-slate-200"><nav className="flex gap-7" aria-label="后台模块"><Tab active={section === "site"} onClick={() => setSection("site")} icon={Settings2}>站点管理</Tab><Tab active={section === "cases"} onClick={() => setSection("cases")} icon={BriefcaseBusiness}>案例管理</Tab></nav></div>
        {auth === "loading" ? <div className="py-16 text-sm text-slate-500">正在加载配置…</div> : section === "site" ? <SiteManager site={site} setSite={setSite} saveSite={saveSite}/> : <CaseManager categories={categories} cases={cases} panel={casePanel} setPanel={setCasePanel} addCategory={addCategory} addCase={addCase}/>} 
      </>}
    </div>
  </main>;
}

function LoginForm({ status, onLogin }: { status: string; onLogin: (event: FormEvent<HTMLFormElement>) => Promise<void> }) { return <Card className="mx-auto mt-12 max-w-md p-8"><span className="mx-auto grid h-11 w-11 place-items-center bg-blue-50 text-blue-700"><ShieldCheck size={21}/></span><h2 className="mt-5 text-center text-xl font-bold text-[#0f2747]">管理员登录</h2><p className="mt-2 text-center text-sm leading-6 text-slate-600">请输入已在 Cloudflare Secret 中配置的后台密码。</p><form className="mt-6 grid gap-4" onSubmit={onLogin}><label className="grid gap-2 text-sm font-bold text-slate-700"><span>后台密码</span><input name="password" type="password" autoComplete="current-password" required className="border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"/></label><Button type="submit">登录后台</Button></form><p role="status" className="mt-4 text-center text-xs text-slate-500">{status}</p></Card>; }
function Unavailable() { return <Card className="mx-auto mt-12 max-w-xl p-8 text-center"><span className="mx-auto grid h-11 w-11 place-items-center bg-amber-50 text-amber-700"><ShieldAlert size={21}/></span><h2 className="mt-5 text-xl font-bold text-[#0f2747]">后台暂不可用</h2><p className="mt-3 text-sm leading-6 text-slate-600">请确认 D1 绑定已配置，并在 Worker Secret 中设置了 <code>ADMIN_PASSWORD</code>。</p></Card>; }
function Tab({ active, icon: Icon, children, onClick }: { active: boolean; icon: typeof Settings2; children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className={`relative inline-flex items-center gap-2 px-1 pb-4 pt-1 text-sm font-bold transition ${active ? "text-[#0f2747] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-blue-600" : "text-slate-500 hover:text-[#0f2747]"}`}><Icon size={17}/>{children}</button>; }
function SiteManager({ site, setSite, saveSite }: { site: { titleZh: string; titleEn: string }; setSite: React.Dispatch<React.SetStateAction<{ titleZh: string; titleEn: string }>>; saveSite: (event: FormEvent) => Promise<void> }) { return <section className="max-w-2xl py-8"><p className="text-xs font-bold tracking-[.14em] text-blue-600">SITE SETTINGS</p><h2 className="mt-2 text-2xl font-bold tracking-[-.025em] text-[#0f2747]">站点管理</h2><Card className="mt-6 p-6 sm:p-7"><h3 className="text-lg font-bold text-[#0f2747]">站点标题</h3><p className="mt-1 text-sm text-slate-500">分别维护中文与英文页面的标题显示。</p><form className="mt-6 grid gap-5" onSubmit={saveSite}><Input label="中文标题" value={site.titleZh} onChange={value => setSite(current => ({ ...current, titleZh: value }))}/><Input label="English title" value={site.titleEn} onChange={value => setSite(current => ({ ...current, titleEn: value }))}/><Button className="w-fit"><Save size={16}/>保存更改</Button></form></Card></section>; }
function CaseManager({ categories, cases, panel, setPanel, addCategory, addCase }: { categories: Category[]; cases: CaseStudy[]; panel: CasePanel; setPanel: (panel: CasePanel) => void; addCategory: (event: FormEvent<HTMLFormElement>) => Promise<void>; addCase: (event: FormEvent<HTMLFormElement>) => Promise<void> }) { return <section className="grid gap-7 py-8 lg:grid-cols-[210px_minmax(0,1fr)]"><aside className="border-r border-slate-200 pr-5"><p className="px-3 text-xs font-bold tracking-[.14em] text-slate-400">CASE MANAGEMENT</p><div className="mt-3 grid gap-1"><SideNav active={panel === "cases"} onClick={() => setPanel("cases")} icon={ListChecks}>案例管理</SideNav><SideNav active={panel === "categories"} onClick={() => setPanel("categories")} icon={FolderTree}>分类管理</SideNav></div><p className="mt-6 px-3 text-xs leading-5 text-slate-500">已自动载入 {categories.length} 个分类，可直接在新增案例中选择。</p></aside><div>{panel === "categories" ? <CategoryPanel categories={categories} addCategory={addCategory}/> : <CasesPanel categories={categories} cases={cases} addCase={addCase}/>}</div></section>; }
function SideNav({ active, icon: Icon, children, onClick }: { active: boolean; icon: typeof Settings2; children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className={`flex items-center gap-3 px-3 py-3 text-left text-sm font-bold transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-[#0f2747]"}`}><Icon size={17}/>{children}</button>; }
function CategoryPanel({ categories, addCategory }: { categories: Category[]; addCategory: (event: FormEvent<HTMLFormElement>) => Promise<void> }) { return <><PanelHeading eyebrow="CASE CATEGORIES" title="分类管理" description="分类会自动显示在案例录入表单中。"/><Card className="mt-6 p-6"><form className="grid gap-4 sm:grid-cols-2" onSubmit={addCategory}><Input name="nameZh" label="中文名称" required/><Input name="nameEn" label="English name" required/><Input name="slug" label="Slug" required/><Input name="sortOrder" label="排序" type="number"/><Button className="w-fit sm:col-span-2"><Plus size={16}/>添加分类</Button></form></Card><div className="mt-6 divide-y border-y border-slate-200 bg-white">{categories.length ? categories.map(category => <div key={category.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm"><div><b>{category.name_zh}</b><span className="ml-2 text-slate-500">{category.name_en}</span></div><span className="text-xs text-slate-400">{category.slug} · #{category.sort_order}</span></div>) : <p className="px-5 py-5 text-sm text-slate-500">尚未建立分类。</p>}</div></>; }
function CasesPanel({ categories, cases, addCase }: { categories: Category[]; cases: CaseStudy[]; addCase: (event: FormEvent<HTMLFormElement>) => Promise<void> }) { return <><PanelHeading eyebrow="CASE STUDIES" title="案例管理" description="发布前请选择已有分类；分类列表会自动从 D1 读取。"/><Card className="mt-6 p-6"><h3 className="text-lg font-bold text-[#0f2747]">新增案例</h3><form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={addCase}><Input name="titleZh" label="案例中文标题" required/><Input name="titleEn" label="Case title (English)" required/><label className="grid gap-2 text-sm font-bold">分类<Select name="categoryId"><option value="">未分类</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name_zh} / {category.name_en}</option>)}</Select></label><Input name="imageUrl" label="图片 URL"/><TextArea name="summaryZh" label="中文摘要" required/><TextArea name="summaryEn" label="English summary" required/><TextArea name="contentZh" label="中文正文"/><TextArea name="contentEn" label="English content"/><Button className="w-fit md:col-span-2"><Plus size={16}/>发布案例</Button></form></Card><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cases.length ? cases.map(item => <Card key={item.id} className="p-5"><p className="text-xs font-bold text-blue-600">{item.category_name_zh ?? "未分类"}</p><h3 className="mt-2 font-bold text-[#0f2747]">{item.title_zh}</h3><p className="mt-1 text-sm text-slate-500">{item.title_en}</p></Card>) : <p className="text-sm text-slate-500">尚无已保存案例。</p>}</div></>; }
function PanelHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div><p className="text-xs font-bold tracking-[.14em] text-blue-600">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold tracking-[-.025em] text-[#0f2747]">{title}</h2><p className="mt-2 text-sm text-slate-500">{description}</p></div>; }
function Input({ label, value, onChange, ...props }: { label: string; value?: string; onChange?: (value: string) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) { return <label className="grid gap-2 text-sm font-bold"><span>{label}</span><input {...props} value={value} onChange={event => onChange?.(event.target.value)} className="border border-slate-300 px-3 py-3 text-sm font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"/></label>; }
function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) { const { label, ...input } = props; return <label className="grid gap-2 text-sm font-bold"><span>{label}</span><textarea {...input} rows={4} className="resize-y border border-slate-300 px-3 py-3 text-sm font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"/></label>; }
