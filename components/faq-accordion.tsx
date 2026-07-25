"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

export function FaqAccordion({ items }: { items: ReadonlyArray<readonly [string, string]> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  return <div className="divide-y divide-slate-200 border-y border-slate-200">{items.map(([question, answer], index) => { const open = openIndex === index; const contentId = `${baseId}-${index}`; return <div key={question} className="py-1"><button type="button" aria-expanded={open} aria-controls={contentId} onClick={() => setOpenIndex(open ? null : index)} className="flex w-full items-start justify-between gap-5 py-4 text-left text-base font-bold leading-6 text-[#0f2747]"><span>{question}</span><motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.28 }} className="mt-1 shrink-0 text-xl font-normal leading-none text-blue-600">+</motion.span></button><AnimatePresence initial={false}>{open && <motion.div id={contentId} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={reduceMotion ? { duration: 0.01 } : { height: { type: "spring", bounce: 0, duration: 0.32 }, opacity: { duration: 0.18, ease: "easeOut" } }} className="overflow-hidden"><p className="max-w-3xl pb-5 text-sm leading-7 text-slate-600">{answer}</p></motion.div>}</AnimatePresence></div>; })}</div>;
}
