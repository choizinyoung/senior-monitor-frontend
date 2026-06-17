import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-[10px] border-[1.5px] border-border bg-bg-main px-3.5 py-2.5 text-sm text-text-main transition-all duration-150 appearance-none",
        "focus:border-primary focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(91,103,245,0.10)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";
export default Select;
