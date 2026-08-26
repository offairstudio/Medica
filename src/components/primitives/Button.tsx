import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: "h-9 px-3 text-caption gap-1.5",
  md: "h-11 px-4 text-[15px] gap-2",
  lg: "h-[52px] px-6 text-[15px] gap-2",
};

const variantClasses = {
  primary:
    "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md active:bg-primary-800 active:scale-[.99]",
  secondary:
    "bg-primary-900 text-white shadow-sm hover:bg-primary-800 active:bg-primary-900 active:scale-[.99]",
  ghost:
    "bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 active:scale-[.99]",
  danger:
    "bg-danger text-white hover:brightness-95 active:brightness-90 active:scale-[.99]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", icon, loading, fullWidth, className, children, disabled, ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-fast select-none",
        sizeClasses[size],
        variantClasses[variant],
        (disabled || loading) && "opacity-45 cursor-not-allowed hover:bg-none",
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-label="טוען" />
      ) : (
        icon
      )}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
