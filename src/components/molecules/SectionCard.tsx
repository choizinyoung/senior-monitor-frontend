import { ReactNode } from "react";

interface SectionCardProps {
  title: ReactNode;
  titleIcon?: ReactNode;
  actions?: ReactNode;
  subTitle?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, titleIcon, actions, subTitle, children }: SectionCardProps) {
  return (
    <div className="bg-bg-card rounded-2xl border border-border shadow-[0_2px_10px_rgba(91,103,245,0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-[18px] border-b border-border">
        <div>
          <h2 className="text-base font-bold text-text-main flex items-center gap-2">
            {titleIcon && <span className="text-text-sub">{titleIcon}</span>}
            {title}
          </h2>
          {subTitle && <p className="text-xs text-text-sub mt-0.5">{subTitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
