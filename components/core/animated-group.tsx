"use client";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedGroup({ children, className = "", variants }: { children: ReactNode; className?: string; variants?: { container?: Variants; item?: Variants } }) {
  const items = Array.isArray(children) ? children : [children];
  return <motion.div className={className} variants={variants?.container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }}>{items.map((child, index) => <motion.div key={index} variants={variants?.item}>{child}</motion.div>)}</motion.div>;
}
