"use client";

import { useMonitorStore } from "@/store/useMonitorStore";

export default function MobileSidebarBackdrop() {
  const { sidebarOpen, closeSidebar } = useMonitorStore();

  if (!sidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99] bg-[rgba(26,29,59,0.48)] backdrop-blur-[2px] md:hidden"
      onClick={closeSidebar}
    />
  );
}
