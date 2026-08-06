"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, createElement, useContext, useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { Check, LoaderCircle, Pencil, RotateCcw, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { TextEffect } from "@/components/core/text-effect";

type EditorContextValue = {
  editable: boolean;
  content: Record<string, string>;
  save: (key: string, value: string) => Promise<void>;
  reset: (key: string) => Promise<void>;
};

const EditorContext = createContext<EditorContextValue>({
  editable: false,
  content: {},
  save: async () => {},
  reset: async () => {},
});

const pagePathFor = (pathname: string, locale: Locale) => {
  const path = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
};

export function InlineEditorProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname();
  const pagePath = useMemo(() => pagePathFor(pathname, locale), [locale, pathname]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [requested, setRequested] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setRequested(new URLSearchParams(window.location.search).get("edit") === "1");
  }, [pathname]);

  useEffect(() => {
    let active = true;
    fetch(`/api/page-content?locale=${locale}&path=${encodeURIComponent(pagePath)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { content: {} })
      .then((data) => { if (active) setContent(data.content || {}); })
      .catch(() => { if (active) setContent({}); });
    return () => { active = false; };
  }, [locale, pagePath]);

  useEffect(() => {
    if (!requested) { setAuthorized(false); return; }
    let active = true;
    setChecking(true);
    fetch("/api/admin?resource=site", { cache: "no-store" })
      .then((response) => { if (active) setAuthorized(response.ok); })
      .catch(() => { if (active) setAuthorized(false); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [requested]);

  const request = async (method: "POST" | "DELETE", body: object) => {
    const response = await fetch("/api/page-content", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, path: pagePath, ...body }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "保存失败");
  };

  const save = async (key: string, value: string) => {
    setStatus("正在保存…");
    try {
      await request("POST", { key, value });
      setContent((current) => ({ ...current, [key]: value }));
      setStatus("已保存");
      window.setTimeout(() => setStatus(""), 1600);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "保存失败");
      throw error;
    }
  };

  const reset = async (key: string) => {
    setStatus("正在恢复…");
    await request("DELETE", { key });
    setContent((current) => { const next = { ...current }; delete next[key]; return next; });
    setStatus("已恢复默认");
    window.setTimeout(() => setStatus(""), 1600);
  };

  const resetPage = async () => {
    if (!window.confirm(locale === "zh" ? "恢复本页所有默认文案？" : "Restore all default copy on this page?")) return;
    setStatus("正在恢复…");
    try {
      await request("DELETE", {});
      setContent({});
      setStatus("本页已恢复默认");
      window.setTimeout(() => setStatus(""), 1600);
    } catch (error) { setStatus(error instanceof Error ? error.message : "恢复失败"); }
  };

  const value = { editable: requested && authorized, content, save, reset };
  return (
    <EditorContext.Provider value={value}>
      <div className={requested && authorized ? "cms-edit-mode" : undefined}>{children}</div>
      {requested && <div className="fixed bottom-4 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1a243f] shadow-[0_12px_40px_rgba(15,23,42,.18)]">
        {checking ? <><LoaderCircle size={14} className="animate-spin" />正在验证管理员身份</> : authorized ? <><span className="inline-flex items-center gap-1.5 text-emerald-700"><Check size={14} />页面编辑模式</span><span className="max-w-40 truncate font-normal text-slate-400">{status || "双击文字进行编辑"}</span><button type="button" onClick={() => void resetPage()} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-slate-500 hover:bg-slate-100"><RotateCcw size={13} />恢复本页</button><Link href={pathname} className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100" aria-label="退出编辑模式"><X size={14} /></Link></> : <><span className="text-amber-700">请先登录后台</span><Link href="/admin" className="rounded-md bg-[#1a243f] px-2.5 py-1.5 text-white">前往登录</Link><Link href={pathname} className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100" aria-label="退出编辑模式"><X size={14} /></Link></>}
      </div>}
    </EditorContext.Provider>
  );
}

export function EditableText({ contentKey, children, className = "", multiline = false }: { contentKey: string; children: string; className?: string; multiline?: boolean }) {
  const editor = useContext(EditorContext);
  const ref = useRef<HTMLSpanElement>(null);
  const [editing, setEditing] = useState(false);
  const value = editor.content[contentKey] ?? children;
  const overridden = Object.prototype.hasOwnProperty.call(editor.content, contentKey);

  useEffect(() => {
    if (!editing || !ref.current) return;
    ref.current.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [editing]);

  const finish = async () => {
    if (!editing) return;
    setEditing(false);
    const next = ref.current?.innerText.trim() || "";
    if (!next || next === value) { if (ref.current) ref.current.innerText = value; return; }
    try { await editor.save(contentKey, next); }
    catch { if (ref.current) ref.current.innerText = value; }
  };

  return <span className={`cms-editable relative ${className}`} data-cms-key={contentKey}>
    <span ref={ref} contentEditable={editing} suppressContentEditableWarning onDoubleClick={(event) => { if (!editor.editable) return; event.preventDefault(); setEditing(true); }} onBlur={() => void finish()} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); if (ref.current) ref.current.innerText = value; setEditing(false); ref.current?.blur(); } else if (event.key === "Enter" && (!multiline || !event.shiftKey)) { event.preventDefault(); ref.current?.blur(); } }} className={editing ? "outline-none" : undefined}>{value}</span>
    {editor.editable && overridden && !editing && <button type="button" title="恢复此项默认文案" aria-label="恢复此项默认文案" onClick={(event) => { event.preventDefault(); event.stopPropagation(); void editor.reset(contentKey); }} className="cms-reset absolute -right-2 -top-2 hidden h-5 w-5 place-items-center rounded-full bg-white text-slate-500 shadow-md"><RotateCcw size={11} /></button>}
    {editor.editable && !editing && <span className="cms-pencil pointer-events-none absolute -left-2 -top-2 hidden h-5 w-5 place-items-center rounded-full bg-[#1a243f] text-white shadow-md"><Pencil size={10} /></span>}
  </span>;
}

export function EditableTextEffect({
  contentKey,
  children,
  ...props
}: {
  contentKey: string;
  children: string;
} & Omit<ComponentProps<typeof TextEffect>, "children">) {
  const editor = useContext(EditorContext);
  const value = editor.content[contentKey] ?? children;
  if (!editor.editable) return <TextEffect {...props}>{value}</TextEffect>;
  return createElement(
    props.as || "p",
    { className: props.className },
    <EditableText contentKey={contentKey} multiline>{children}</EditableText>,
  );
}
