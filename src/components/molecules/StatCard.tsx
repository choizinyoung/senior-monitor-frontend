import Link from "next/link";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  valueColor?: "default" | "red" | "blue" | "green";
  href?: string;
}

const valueColorStyles = {
  default: "text-text-main",
  red: "text-danger",
  blue: "text-primary",
  green: "text-success",
};

export default function StatCard({ label, value, sub, valueColor = "default", href }: StatCardProps) {
  const content = (
    <>
      <p className="text-sm text-text-sub font-medium mb-2.5">{label}</p>
      <p className={cn("text-[32px] font-extrabold leading-none", valueColorStyles[valueColor])}>{value}</p>
      <p className="text-xs text-text-sub mt-2">{sub}</p>
    </>
  );

  const base = "bg-bg-card rounded-2xl p-5 border border-border shadow-[0_2px_10px_rgba(91,103,245,0.06)] transition-all duration-200";

  if (href) {
    return (
      <Link href={href} className={cn(base, "cursor-pointer hover:shadow-[0_4px_24px_rgba(91,103,245,0.08)] hover:border-[#C7CBF9] hover:-translate-y-0.5")}>
        {content}
      </Link>
    );
  }

  return <div className={base}>{content}</div>;
}
