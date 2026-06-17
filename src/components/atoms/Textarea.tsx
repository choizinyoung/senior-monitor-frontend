import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-y rounded-[10px] border-[1.5px] border-border bg-bg-main px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-sub transition-all duration-150 min-h-[90px]",
        "focus:border-primary focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(91,103,245,0.10)]",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
export default Textarea;
