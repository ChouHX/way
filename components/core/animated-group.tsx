"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedGroup({
  children,
  className = "",
  itemKey,
}: {
  children: ReactNode;
  className?: string;
  itemKey?: (child: ReactNode, index: number) => string | number;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <motion.div className={className} initial={false}>
      {items.map((child, index) => (
        <motion.div key={itemKey?.(child, index) ?? index}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
