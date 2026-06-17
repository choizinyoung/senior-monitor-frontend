import { cn } from "@/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      className={cn(
        "inline-block animate-spin rounded-full border-primary border-t-transparent",
        sizeStyles[size],
        className
      )}
    />
  );
}
