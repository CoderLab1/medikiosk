import React from "react";
import { cn } from "../../lib/utils";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

const alertVariants = {
  base: "relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  variant: {
    default: "bg-white text-slate-950 border-slate-200",
    destructive: "border-rose-500/50 text-rose-600 bg-rose-50 [&>svg]:text-rose-600",
    warning: "border-amber-500/50 text-amber-700 bg-amber-50 [&>svg]:text-amber-600",
    success: "border-emerald-500/50 text-emerald-700 bg-emerald-50 [&>svg]:text-emerald-600",
    info: "border-blue-500/50 text-blue-700 bg-blue-50 [&>svg]:text-blue-600"
  }
};

const icons = {
  default: Info,
  destructive: XCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info
};

const Alert = React.forwardRef(({ className, variant = "default", title, children, ...props }, ref) => {
  const Icon = icons[variant] || icons.default;
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants.base, alertVariants.variant[variant], className)}
      {...props}
    >
      <Icon className="h-5 w-5" />
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm [&_p]:leading-relaxed">{children}</div>
    </div>
  );
});
Alert.displayName = "Alert";

export { Alert };
