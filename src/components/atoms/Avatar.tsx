import { cn } from "@/utils/cn";

interface AvatarProps {
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-sm",
  lg: "w-10 h-10 text-base",
};

export default function Avatar({ label, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white flex-shrink-0",
        "bg-gradient-to-br from-primary to-[#818CF8]",
        sizeStyles[size],
        className
      )}
    >
      {label}
    </div>
  );
}
