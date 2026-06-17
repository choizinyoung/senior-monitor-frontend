import { cn } from "@/utils/cn";
import { AlertStatus } from "@/types";

interface StatusBadgeProps {
  status: AlertStatus;
  className?: string;
}

const styles: Record<AlertStatus, string> = {
  danger: "bg-danger-light text-danger",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  info: "bg-primary-light text-primary",
};

const labels: Record<AlertStatus, string> = {
  danger: "● 확인요망",
  success: "● 정상",
  warning: "● 주의",
  info: "● 정보",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
