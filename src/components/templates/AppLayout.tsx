import { ReactNode } from "react";
import { SideNav } from "@/components/organisms";
import MobileSidebarBackdrop from "./MobileSidebarBackdrop";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bg-main">
      <SideNav />
      {/* 모바일 사이드바 백드롭 (클라이언트 컴포넌트) */}
      <MobileSidebarBackdrop />
      {/* 데스크톱: ml-60, 모바일: ml-0 */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col gap-4 md:gap-5 px-4 md:px-8 pt-4 md:pt-6 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
