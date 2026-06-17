import { cn } from "@/utils/cn";
import { SeverityLevel } from "@/types";

interface SeverityBadgeProps {
  level: SeverityLevel;
  className?: string;
}

const styles: Record<SeverityLevel, string> = {
  high: "bg-danger text-white",
  mid: "bg-warning text-white",
  low: "bg-success text-white",
};

const labels: Record<SeverityLevel, string> = {
  high: "상",
  mid: "중",
  low: "하",
};

export default function SeverityBadge({ level, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold",
        styles[level],
        className
      )}
    >
      {labels[level]}
    </span>
  );
}
