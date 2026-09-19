import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variant: {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    destructive: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-indigo-600 underline-offset-4 hover:underline",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
  },
  size: {
    default: "h-11 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-2xl px-8 text-base",
    icon: "h-11 w-11",
  }
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", loading = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          buttonVariants.base,
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
