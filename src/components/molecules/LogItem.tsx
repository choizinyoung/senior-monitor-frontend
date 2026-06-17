import { cn } from "@/utils/cn";
import { LogEntry, LogType } from "@/types";
import { LOG_TYPE_LABEL } from "@/constants";

interface LogItemProps {
  log: LogEntry;
}

const typeStyles: Record<LogType, string> = {
  query: "bg-primary-light text-primary",
  action: "bg-success-light text-success",
  system: "bg-bg-main text-text-sub",
  login: "bg-warning-light text-warning",
};

export default function LogItem({ log }: LogItemProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-3 border-b border-[#F5F6FC] text-sm hover:bg-[#FAFBFF] last:border-b-0 transition-colors">
      <span className="text-xs text-text-sub whitespace-nowrap min-w-[140px]">{log.timestamp}</span>
      <span className={cn("px-2.5 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap", typeStyles[log.type])}>
        {LOG_TYPE_LABEL[log.type]}
      </span>
      <span className="font-bold text-text-main whitespace-nowrap min-w-[70px]">{log.user}</span>
      <span className="text-text-main flex-1">{log.message}</span>
    </div>
  );
}
