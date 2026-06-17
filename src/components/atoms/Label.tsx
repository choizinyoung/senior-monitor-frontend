import { LabelHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export default function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-semibold text-text-main mb-1.5", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-danger">*</span>}
    </label>
  );
}
