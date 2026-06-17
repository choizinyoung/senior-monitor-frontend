import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "danger" | "success" | "outline" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_4px_14px_rgba(91,103,245,0.35)] hover:bg-primary-dark hover:shadow-[0_6px_18px_rgba(91,103,245,0.45)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
  danger:
    "bg-danger text-white shadow-[0_4px_14px_rgba(245,54,92,0.25)] hover:bg-[#D42F52] hover:-translate-y-px disabled:opacity-50",
  success:
    "bg-success text-white shadow-[0_4px_14px_rgba(45,206,137,0.3)] hover:bg-[#24B576] hover:-translate-y-px disabled:opacity-50",
  outline:
    "bg-white text-text-sub border border-border hover:bg-bg-main hover:text-text-main hover:border-[#D0D3EC] disabled:opacity-50",
  ghost:
    "bg-transparent text-primary hover:bg-primary-light rounded-md disabled:opacity-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-[10px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", isLoading, className, children, disabled, ...props },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-150 whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
