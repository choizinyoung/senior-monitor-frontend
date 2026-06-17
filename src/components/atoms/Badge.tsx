import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { SeniorStatus } from "@/types";

type BadgeVariant = SeniorStatus | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  normal: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  offline: "bg-gray-100 text-gray-600",
  info: "bg-blue-100 text-blue-800",
};

const variantLabels: Record<BadgeVariant, string> = {
  normal: "정상",
  warning: "주의",
  danger: "위험",
  offline: "오프라인",
  info: "정보",
};

export default function Badge({ variant = "info", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children ?? variantLabels[variant]}
    </span>
  );
}
