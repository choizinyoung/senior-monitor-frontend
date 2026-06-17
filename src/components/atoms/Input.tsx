import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-[10px] border-[1.5px] border-border bg-bg-main px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-sub transition-all duration-150",
        "focus:border-primary focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(91,103,245,0.10)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        error && "border-danger focus:border-danger",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
export default Input;
