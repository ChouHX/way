"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import {
  createContext,
  useContext,
  useId,
  useState,
  type CSSProperties,
  type ReactEventHandler,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ContextValue = {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  transition: Transition;
  content: boolean;
};
const DialogContext = createContext<ContextValue | null>(null);
const useDialog = () => {
  const value = useContext(DialogContext);
  if (!value)
    throw new Error("Morphing dialog components must be inside MorphingDialog");
  return value;
};

export function MorphingDialog({
  children,
  transition = { type: "spring", bounce: 0.05, duration: 0.25 },
}: {
  children: ReactNode;
  transition?: Transition;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <DialogContext.Provider
      value={{ id, open, setOpen, transition, content: false }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function MorphingDialogTrigger({
  children,
  className = "",
  wrapperClassName = "",
  style,
  onClick,
  disabled = false,
  tabIndex,
  ariaHidden,
}: {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  tabIndex?: number;
  ariaHidden?: boolean;
}) {
  const { id, setOpen, transition } = useDialog();
  return (
    <div className={`relative ${wrapperClassName}`}>
      <button
        type="button"
        disabled={disabled}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden || undefined}
        onClick={() => {
          if (disabled) return;
          onClick?.();
          setOpen(true);
        }}
        className={className}
        style={style}
      >
        {children}
      </button>
      <motion.div
        aria-hidden
        layoutId={`dialog-${id}`}
        transition={transition}
        className="pointer-events-none absolute inset-0 opacity-0"
      />
    </div>
  );
}

export function MorphingDialogContainer({ children }: { children: ReactNode }) {
  const context = useDialog();
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {context.open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={() => context.setOpen(false)}
        >
          <DialogContext.Provider value={{ ...context, content: true }}>
            {children}
          </DialogContext.Provider>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function MorphingDialogContent({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { id, transition } = useDialog();
  return (
    <motion.article
      layoutId={`dialog-${id}`}
      transition={transition}
      onClick={(e) => e.stopPropagation()}
      className={`overflow-x-hidden ${className}`}
      style={style}
    >
      {children}
    </motion.article>
  );
}

export function MorphingDialogTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { id, transition, content } = useDialog();
  return content ? (
    <motion.h2
      layoutId={`title-${id}`}
      transition={transition}
      className={className}
    >
      {children}
    </motion.h2>
  ) : (
    <h2 className={className}>{children}</h2>
  );
}
export function MorphingDialogSubtitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { id, transition, content } = useDialog();
  return content ? (
    <motion.p
      layoutId={`subtitle-${id}`}
      transition={transition}
      className={className}
    >
      {children}
    </motion.p>
  ) : (
    <p className={className}>{children}</p>
  );
}
export function MorphingDialogImage({
  className = "",
  src,
  alt,
  onError,
  loading,
}: {
  className?: string;
  src: string;
  alt: string;
  onError?: ReactEventHandler<HTMLImageElement>;
  loading?: "eager" | "lazy";
}) {
  const { id, transition, content } = useDialog();
  return content ? (
    <motion.img
      onError={onError}
      loading={loading}
      className={className}
      src={src}
      alt={alt}
    />
  ) : (
    <img
      onError={onError}
      loading={loading}
      className={className}
      src={src}
      alt={alt}
    />
  );
}
export function MorphingDialogDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: unknown;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.08, duration: 0.18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
export function MorphingDialogClose({
  className = "",
}: {
  className?: string;
}) {
  const { setOpen } = useDialog();
  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      aria-label="Close dialog"
      className={`pressable absolute right-3 top-3 grid h-8 w-8 place-items-center bg-slate-950/55 text-white backdrop-blur-sm ${className}`}
    >
      <X size={17} />
    </button>
  );
}
