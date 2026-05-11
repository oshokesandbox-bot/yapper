import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import React, { forwardRef, type ComponentProps, type ReactNode } from "react";

/* ─── Button ─────────────────────────────────── */

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-950 text-white hover:bg-slate-800",
        secondary: "bg-white text-slate-950 border border-slate-200 hover:bg-slate-100",
        ghost: "bg-slate-100 text-slate-950 hover:bg-slate-200",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={clsx(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

/* ─── Card ───────────────────────────────────── */

export function Card({ className, children, ...props }: ComponentProps<"div">) {
  return <div className={clsx("rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", className)} {...props}>{children}</div>;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx("flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={clsx("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={clsx("text-sm text-slate-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx("pt-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx("flex items-center pt-4", className)} {...props} />;
}

/* ─── Badge ──────────────────────────────────── */

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-amber-100 text-amber-900",
        secondary: "bg-slate-100 text-slate-900",
        outline: "border border-slate-200 text-slate-700",
        destructive: "bg-red-100 text-red-900",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={clsx(badgeVariants({ variant }), className)} {...props} />;
}

/* ─── Input ──────────────────────────────────── */

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input"> & { label?: string }>(
  ({ className, label, id, type = "text", ...props }, ref) => {
    return (
      <div className="grid gap-1.5">
        {label ? <Label htmlFor={id}>{label}</Label> : null}
        <input
          id={id}
          type={type}
          className={clsx(
            "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={clsx("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />;
}

/* ─── Progress ────────────────────────────────── */

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={clsx("h-2.5 w-full rounded-full bg-slate-200 overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ─── Dialog / Modal ─────────────────────────── */

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl mx-4">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={clsx("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={clsx("text-sm text-slate-500", className)} {...props} />;
}
